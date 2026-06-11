"""Core hybrid analysis services for scam and fraud identification."""

import json
import os
import re
import urllib.error
import urllib.request
from difflib import SequenceMatcher
from pathlib import Path
from typing import Dict, List, Optional, Set, Tuple


class AnalysisService:
    """Hybrid local dataset + optional Groq LLM identity risk assessment."""

    DATASET_PATH = Path(__file__).resolve().parent / "data" / "instagram_scam_patterns.json"
    GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
    GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
    _dataset: Optional[Dict] = None

    @staticmethod
    def analyze_identity(
        username: str,
        followers: int,
        following: int,
        bio: str,
        message: str,
    ) -> dict:
        """Analyze an Instagram-style profile and return a fraud risk assessment."""
        dataset_score = AnalysisService._score_with_dataset(
            username=username,
            followers=followers,
            following=following,
            bio=bio or "",
            message=message or "",
        )
        llm_result = AnalysisService._analyze_with_groq(
            username=username,
            followers=followers,
            following=following,
            bio=bio or "",
            message=message or "",
            dataset_score=dataset_score,
        )

        if llm_result:
            risk_score = AnalysisService._clamp_score(
                round((dataset_score["risk_score"] * 0.75) + (llm_result["risk_score"] * 0.25))
            )
            fallback_category = AnalysisService._category_for_score(risk_score)
            fallback_explanation = AnalysisService._generate_explanation(
                dataset_score["risk_factors"],
                fallback_category,
                dataset_score["dominant_scam_type"],
            )
            explanation = llm_result["explanation"] or fallback_explanation
            recommendation = llm_result["recommendation"] or AnalysisService._generate_recommendation(
                fallback_category
            )
        else:
            risk_score = dataset_score["risk_score"]
            category = AnalysisService._category_for_score(risk_score)
            explanation = AnalysisService._generate_explanation(
                dataset_score["risk_factors"],
                category,
                dataset_score["dominant_scam_type"],
            )
            recommendation = AnalysisService._generate_recommendation(category)

        category = AnalysisService._category_for_score(risk_score)
        return {
            "risk_score": risk_score,
            "category": category,
            "risk_factors": dataset_score["risk_factors"],
            "explanation": explanation,
            "recommendation": recommendation,
        }

    @staticmethod
    def _load_dataset() -> Dict:
        if AnalysisService._dataset is None:
            with AnalysisService.DATASET_PATH.open("r", encoding="utf-8") as dataset_file:
                AnalysisService._dataset = json.load(dataset_file)
        return AnalysisService._dataset

    @staticmethod
    def _score_with_dataset(
        username: str,
        followers: int,
        following: int,
        bio: str,
        message: str,
    ) -> Dict:
        dataset = AnalysisService._load_dataset()
        risk_score = 0
        risk_factors: List[str] = []
        scam_type_scores: Dict[str, int] = {}
        username_lower = username.lower()
        bio_lower = bio.lower()
        message_lower = message.lower()

        for pattern in dataset["username_patterns"]:
            if re.search(pattern["regex"], username_lower):
                risk_score += pattern["weight"]
                AnalysisService._add_factor(risk_factors, pattern["label"])
                AnalysisService._add_scam_type_score(scam_type_scores, pattern)

        for keyword in dataset["bio_keywords"]:
            if keyword["term"] in bio_lower:
                risk_score += keyword["weight"]
                AnalysisService._add_factor(risk_factors, keyword["label"])
                AnalysisService._add_scam_type_score(scam_type_scores, keyword)

        for signature in dataset["message_signatures"]:
            if re.search(signature["regex"], message_lower):
                risk_score += signature["weight"]
                AnalysisService._add_factor(risk_factors, signature["label"])
                AnalysisService._add_scam_type_score(scam_type_scores, signature)

        ratio_risk, ratio_factors, ratio_types = AnalysisService._analyze_engagement_ratio(
            followers,
            following,
        )
        risk_score += ratio_risk
        for factor in ratio_factors:
            AnalysisService._add_factor(risk_factors, factor)
        for scam_type, score in ratio_types.items():
            scam_type_scores[scam_type] = scam_type_scores.get(scam_type, 0) + score

        example_score = AnalysisService._score_with_synthetic_examples(
            dataset=dataset,
            username=username_lower,
            followers=followers,
            following=following,
            bio=bio_lower,
            message=message_lower,
        )
        if example_score:
            risk_score = round((risk_score * 0.7) + (example_score["risk_score"] * 0.3))
            for factor in example_score["risk_factors"]:
                AnalysisService._add_factor(risk_factors, factor)
            scam_type = example_score["scam_type"]
            if scam_type:
                scam_type_scores[scam_type] = scam_type_scores.get(scam_type, 0) + 12

        dominant_scam_type = max(scam_type_scores, key=scam_type_scores.get) if scam_type_scores else None
        return {
            "risk_score": AnalysisService._clamp_score(risk_score),
            "risk_factors": risk_factors,
            "dominant_scam_type": dominant_scam_type,
            "scam_type_scores": scam_type_scores,
            "dataset_version": dataset.get("version"),
            "coverage_estimate": dataset.get("coverage_estimate"),
            "matched_examples": example_score.get("matched_examples", []) if example_score else [],
        }

    @staticmethod
    def _score_with_synthetic_examples(
        dataset: Dict,
        username: str,
        followers: int,
        following: int,
        bio: str,
        message: str,
    ) -> Optional[Dict]:
        examples = dataset.get("synthetic_profiles", [])
        if not examples:
            return None

        input_text_tokens = AnalysisService._tokens(f"{bio} {message}")
        ranked = []
        for example in examples:
            username_similarity = SequenceMatcher(
                None,
                username,
                str(example["username"]).lower(),
            ).ratio()
            example_tokens = AnalysisService._tokens(f"{example['bio']} {example['message']}")
            text_similarity = AnalysisService._jaccard(input_text_tokens, example_tokens)
            follower_similarity = AnalysisService._count_similarity(followers, int(example["followers"]))
            following_similarity = AnalysisService._count_similarity(following, int(example["following"]))
            similarity = (
                (username_similarity * 0.25)
                + (text_similarity * 0.45)
                + (follower_similarity * 0.15)
                + (following_similarity * 0.15)
            )
            if similarity >= 0.18:
                ranked.append((similarity, example))

        if not ranked:
            return None

        top_matches = sorted(ranked, key=lambda item: item[0], reverse=True)[:5]
        total_weight = sum(similarity for similarity, _ in top_matches)
        if total_weight <= 0:
            return None

        weighted_score = sum(
            similarity * int(example["risk_score"])
            for similarity, example in top_matches
        ) / total_weight
        scam_type_scores: Dict[str, float] = {}
        factors: List[str] = []
        matched_examples = []
        for similarity, example in top_matches:
            scam_type = example.get("scam_type")
            if scam_type:
                scam_type_scores[scam_type] = scam_type_scores.get(scam_type, 0) + similarity
            for factor in example.get("risk_factors", []):
                AnalysisService._add_factor(factors, f"Similar labeled example: {factor}")
            matched_examples.append(
                {
                    "id": example["id"],
                    "similarity": round(similarity, 3),
                    "scam_type": scam_type,
                    "risk_category": example["risk_category"],
                }
            )

        dominant_type = max(scam_type_scores, key=scam_type_scores.get) if scam_type_scores else None
        return {
            "risk_score": AnalysisService._clamp_score(weighted_score),
            "risk_factors": factors[:4],
            "scam_type": dominant_type,
            "matched_examples": matched_examples,
        }

    @staticmethod
    def _tokens(text: str) -> Set[str]:
        stop_words = {
            "a",
            "an",
            "and",
            "are",
            "for",
            "from",
            "i",
            "is",
            "it",
            "my",
            "of",
            "or",
            "the",
            "to",
            "with",
            "you",
            "your",
        }
        return {
            token
            for token in re.findall(r"[a-z0-9]+", text.lower())
            if len(token) > 2 and token not in stop_words
        }

    @staticmethod
    def _jaccard(left: Set[str], right: Set[str]) -> float:
        if not left or not right:
            return 0.0
        return len(left & right) / len(left | right)

    @staticmethod
    def _count_similarity(left: int, right: int) -> float:
        larger = max(abs(left), abs(right), 1)
        return 1 - (abs(left - right) / larger)

    @staticmethod
    def _analyze_with_groq(
        username: str,
        followers: int,
        following: int,
        bio: str,
        message: str,
        dataset_score: Dict,
    ) -> Optional[Dict]:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            return None

        prompt = {
            "profile": {
                "username": username,
                "followers": followers,
                "following": following,
                "bio": bio,
                "message": message,
            },
            "dataset_score": dataset_score,
            "task": (
                "Analyze this Instagram profile for scam risk. Return only JSON with "
                "risk_score, explanation, and recommendation. The dataset_score includes "
                "deterministic pattern matches and similar labeled synthetic examples. Treat "
                "those as evidence, but correct obvious false positives when the user's message "
                "is ordinary and has no payment, login, urgency, or secrecy request. Keep reasoning "
                "evidence-based and do not claim certainty."
            ),
        }
        payload = {
            "model": AnalysisService.GROQ_MODEL,
            "temperature": 0.1,
            "max_tokens": 350,
            "response_format": {"type": "json_object"},
            "messages": [
                {
                    "role": "system",
                    "content": "You are VERITAS, a cautious fraud-risk analyst.",
                },
                {"role": "user", "content": json.dumps(prompt)},
            ],
        }
        request = urllib.request.Request(
            AnalysisService.GROQ_URL,
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            method="POST",
        )

        try:
            with urllib.request.urlopen(request, timeout=6) as response:
                response_body = json.loads(response.read().decode("utf-8"))
            content = response_body["choices"][0]["message"]["content"]
            llm_json = json.loads(content)
            return {
                "risk_score": AnalysisService._clamp_score(llm_json.get("risk_score", 0)),
                "explanation": str(llm_json.get("explanation", "")).strip(),
                "recommendation": str(llm_json.get("recommendation", "")).strip(),
            }
        except (KeyError, ValueError, urllib.error.URLError, TimeoutError):
            return None

    @staticmethod
    def _analyze_engagement_ratio(followers: int, following: int) -> Tuple[int, List[str], Dict[str, int]]:
        risk = 0
        factors: List[str] = []
        scam_type_scores: Dict[str, int] = {}

        if following == 0:
            if followers > 0:
                risk += 8
                factors.append("Following no one but has followers")
                scam_type_scores["inauthentic_profile"] = 8
            return risk, factors, scam_type_scores

        ratio = followers / following
        if ratio > 100:
            risk += 6
            factors.append(f"Extremely high follower/following ratio ({ratio:.1f}:1)")
            scam_type_scores["inauthentic_profile"] = 6
        elif ratio < 0.1 and following > 100:
            risk += 8
            factors.append(f"Following many but few followers (ratio {ratio:.2f}:1)")
            scam_type_scores["bot_or_spam"] = 8

        if following > 5000:
            risk += 7
            factors.append("Following suspiciously large number of accounts")
            scam_type_scores["bot_or_spam"] = scam_type_scores.get("bot_or_spam", 0) + 7

        if followers < 50:
            risk += 8
            factors.append("Very low follower count")
            scam_type_scores["new_or_disposable"] = 8

        if followers < 100 and following > 500:
            risk += 12
            factors.append("Low followers while following many accounts")
            scam_type_scores["bot_or_spam"] = scam_type_scores.get("bot_or_spam", 0) + 12

        return risk, factors, scam_type_scores

    @staticmethod
    def _add_factor(factors: List[str], label: str) -> None:
        if label not in factors:
            factors.append(label)

    @staticmethod
    def _add_scam_type_score(scores: Dict[str, int], pattern: Dict) -> None:
        scam_type = pattern.get("scam_type")
        if scam_type:
            scores[scam_type] = scores.get(scam_type, 0) + int(pattern.get("weight", 0))

    @staticmethod
    def _clamp_score(score: float) -> int:
        return max(0, min(int(score), 100))

    @staticmethod
    def _category_for_score(risk_score: int) -> str:
        if risk_score <= 30:
            return "Low"
        if risk_score <= 60:
            return "Medium"
        return "High"

    @staticmethod
    def _generate_explanation(
        risk_factors: List[str],
        category: str,
        scam_type: Optional[str],
    ) -> str:
        if not risk_factors:
            return (
                "No significant scam patterns were detected in the local dataset. "
                "The account appears lower risk, but unusual requests should still be verified."
            )

        factors_text = "; ".join(risk_factors[:6])
        type_text = f" The strongest pattern family is {scam_type.replace('_', ' ')}." if scam_type else ""
        if category == "High":
            return f"High risk detected. The dataset matched multiple warning signs: {factors_text}.{type_text}"
        if category == "Medium":
            return f"Medium risk detected. Several suspicious indicators are present: {factors_text}.{type_text}"
        return f"Low risk profile with minor concerns: {factors_text}.{type_text}"

    @staticmethod
    def _generate_recommendation(category: str) -> str:
        if category == "High":
            return "Do not engage with this account. Block it and report it for potential fraud or scam activity."
        if category == "Medium":
            return (
                "Use caution. Verify the account through official channels before responding, "
                "and do not share personal information or payment details."
            )
        return "Generally lower risk. Still verify unusual payment, login, or identity requests through official channels."


class TwinDetectionService:
    """Service for detecting impersonation and twin accounts."""

    @staticmethod
    def detect_twin(legitimate_username: str, suspicious_username: str) -> dict:
        similarity = SequenceMatcher(
            None,
            legitimate_username.lower(),
            suspicious_username.lower(),
        ).ratio()
        matching_patterns = TwinDetectionService._find_matching_patterns(
            legitimate_username,
            suspicious_username,
        )
        suspicious_indicators = TwinDetectionService._find_suspicious_indicators(
            legitimate_username,
            suspicious_username,
        )
        is_impersonation = similarity > 0.7 or len(suspicious_indicators) >= 2
        recommendation = TwinDetectionService._generate_recommendation(
            is_impersonation,
            similarity,
        )

        return {
            "is_impersonation": is_impersonation,
            "similarity_score": round(similarity, 3),
            "matching_patterns": matching_patterns,
            "suspicious_indicators": suspicious_indicators,
            "recommendation": recommendation,
        }

    @staticmethod
    def _find_matching_patterns(legit: str, suspicious: str) -> List[str]:
        patterns = []
        legit_clean = legit.replace("_", "").replace("-", "")
        susp_clean = suspicious.replace("_", "").replace("-", "")

        if legit_clean.lower() == susp_clean.lower():
            patterns.append("Same username with different separators/numbers")

        if legit.lower() in suspicious.lower():
            patterns.append("Legitimate username is substring of suspicious one")
        elif suspicious.lower() in legit.lower():
            patterns.append("Suspicious username is substring of legitimate one")

        if SequenceMatcher(None, legit.lower(), suspicious.lower()).ratio() > 0.85:
            patterns.append("Very similar character sequence")

        if re.sub(r"\d+", "", legit.lower()) == re.sub(r"\d+", "", suspicious.lower()):
            patterns.append("Same base name with different number suffix")

        return patterns

    @staticmethod
    def _find_suspicious_indicators(legit: str, suspicious: str) -> List[str]:
        indicators = []
        susp_lower = suspicious.lower()

        if susp_lower.count("_") > legit.lower().count("_"):
            indicators.append("Extra underscores for obfuscation")

        if any(prefix in susp_lower for prefix in ["official_", "real_", "_official", "_real"]):
            indicators.append("Contains 'official' or 'real' in username")

        if re.search(r"\d{2,}$", suspicious):
            indicators.append("Multiple numbers at end")

        if any(word in susp_lower for word in ["support", "help", "admin", "verify"]):
            indicators.append("Contains impersonation keywords")

        return indicators

    @staticmethod
    def _generate_recommendation(is_impersonation: bool, similarity: float) -> str:
        if is_impersonation or similarity > 0.8:
            return (
                "Likely impersonation. Report this account immediately, do not follow it, "
                "and alert the legitimate account owner."
            )
        if similarity > 0.6:
            return "Possible impersonation. Verify independently before engaging."
        return "No clear impersonation detected, but always verify account legitimacy independently."


analysis_service = AnalysisService()
twin_detection_service = TwinDetectionService()
