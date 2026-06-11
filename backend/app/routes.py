from fastapi import APIRouter, HTTPException

from app.database import (
    get_dashboard_stats as db_dashboard_stats,
    get_deception_graph as db_deception_graph,
    save_analysis,
    save_simulation_attempt,
)

from app.models import (
    AnalysisRequest,
    AnalysisResponse,
    TwinDetectionRequest,
    TwinDetectionResponse,
    SimulationResponse,
)

from app.services import analysis_service, twin_detection_service
from app.url_scanner import scan_urls_from_text
from app.ml_classifier import classify_message_with_ml
from app.profile_classifier import classify_profile_with_ml


router = APIRouter(prefix="/api", tags=["VERITAS API"])


SIMULATION_SCENARIOS = [
    {
        "id": 1,
        "title": "Crypto Doubling Scam",
        "type": "financial",
        "scenario": "You receive a DM from an account claiming to be a crypto analyst. They say: 'Send 1 BTC, I will double it and return 2 BTC. Limited offer - 24 hours only!'",
        "correct_response": "Ignore",
        "manipulation_tactics": [
            "Scarcity - limited time offer",
            "Urgency - 24 hour deadline",
            "Easy profit - unrealistic returns",
            "Financial manipulation",
        ],
    },
    {
        "id": 2,
        "title": "Fake Instagram Support",
        "type": "account_security",
        "scenario": "An account called Instagram Support messages you: 'Your account has suspicious activity. Click here to verify now or your account will be disabled.'",
        "correct_response": "Verify",
        "manipulation_tactics": [
            "Authority impersonation",
            "Urgency",
            "Fear of account loss",
            "Suspicious verification request",
        ],
    },
    {
        "id": 3,
        "title": "Fake Job Recruiter",
        "type": "employment",
        "scenario": "A recruiter says: 'Congratulations! You are selected for a remote job with salary of $5000/month. Send a $500 processing fee to confirm.'",
        "correct_response": "Ignore",
        "manipulation_tactics": [
            "Too-good-to-be-true offer",
            "Advance fee request",
            "Employment scam",
            "False authority",
        ],
    },
]


def category_for_score(score: float) -> str:
    if score <= 30:
        return "Low"
    if score <= 60:
        return "Medium"
    return "High"


def infer_scam_type(result: dict, message: str, bio: str, username: str) -> str:
    text = f"{username} {bio} {message} {' '.join(result.get('risk_factors', []))}".lower()

    if any(word in text for word in ["crypto", "bitcoin", "btc", "forex", "investment", "profit", "returns"]):
        return "investment_fraud"

    if any(word in text for word in ["verify", "password", "otp", "login", "account disabled", "suspicious activity"]):
        return "phishing"

    if any(word in text for word in ["official", "support", "helpdesk", "admin", "meta", "instagram"]):
        return "impersonation"

    if any(word in text for word in ["job", "recruiter", "salary", "processing fee", "remote position"]):
        return "employment_scam"

    if any(word in text for word in ["gift card", "fee", "processing", "advance"]):
        return "advance_fee"

    if any(word in text for word in ["love", "relationship", "romance", "emergency"]):
        return "romance_scam"

    if result.get("category") == "High":
        return "social_engineering"

    return "unknown"


def confidence_for_result(
    risk_score: float,
    risk_factors: list,
    url_analysis: dict | None = None,
    ml_analysis: dict | None = None,
    profile_analysis: dict | None = None,
) -> str:
    url_analysis = url_analysis or {}
    ml_analysis = ml_analysis or {}
    profile_analysis = profile_analysis or {}

    suspicious_urls = int(url_analysis.get("suspicious_urls", 0))
    max_url_score = float(url_analysis.get("max_url_risk_score", 0))

    ml_label = ml_analysis.get("label", "Safe")
    ml_confidence = float(ml_analysis.get("confidence", 0))

    profile_label = profile_analysis.get("label", "real")
    profile_confidence = float(profile_analysis.get("confidence", 0))

    if risk_score >= 70 and len(risk_factors) >= 3:
        return "High"

    if suspicious_urls > 0 and max_url_score >= 60:
        return "High"

    if ml_label == "Scam" and ml_confidence >= 0.50:
        return "High"

    if profile_label == "fake" and profile_confidence >= 0.60:
        return "High"

    if risk_score >= 40 and len(risk_factors) >= 2:
        return "Medium"

    if ml_label == "Suspicious" and ml_confidence >= 0.60:
        return "Medium"

    if profile_label == "automated" and profile_confidence >= 0.60:
        return "Medium"

    if risk_score >= 60:
        return "Medium"

    return "Low"


def build_score_breakdown(
    risk_score: float,
    risk_factors: list,
    url_adjustment: float = 0,
    ml_adjustment: float = 0,
    profile_adjustment: float = 0,
) -> list:
    breakdown = []

    special_adjustment = (
        float(url_adjustment) + float(ml_adjustment) + float(profile_adjustment)
    )

    normal_factors = [
        factor for factor in risk_factors
        if "url" not in str(factor).lower()
        and "link" not in str(factor).lower()
        and "ml classifier" not in str(factor).lower()
        and "profile ml classifier" not in str(factor).lower()
    ]

    if normal_factors:
        base_weight = round(
            max(float(risk_score) - special_adjustment, 0) / max(len(normal_factors), 1),
            2,
        )

        for factor in normal_factors[:8]:
            source = "Risk engine"
            factor_lower = str(factor).lower()

            if any(word in factor_lower for word in ["username", "official", "support"]):
                source = "Username/Profile pattern"
            elif any(word in factor_lower for word in ["bio", "description"]):
                source = "Bio pattern"
            elif any(word in factor_lower for word in ["message", "urgent", "verify", "money", "crypto"]):
                source = "Message pattern"
            elif any(word in factor_lower for word in ["follower", "following", "ratio"]):
                source = "Engagement ratio"
            elif "similar" in factor_lower:
                source = "Synthetic similarity"

            breakdown.append(
                {
                    "factor": str(factor),
                    "weight": base_weight,
                    "source": source,
                }
            )

    if url_adjustment > 0:
        breakdown.append(
            {
                "factor": "Suspicious URL/link risk detected",
                "weight": round(url_adjustment, 2),
                "source": "URL scanner",
            }
        )

    if ml_adjustment > 0:
        breakdown.append(
            {
                "factor": "ML classifier risk adjustment",
                "weight": round(ml_adjustment, 2),
                "source": "NLP / ML classifier",
            }
        )

    if profile_adjustment > 0:
        breakdown.append(
            {
                "factor": "Profile ML classifier risk adjustment",
                "weight": round(profile_adjustment, 2),
                "source": "Profile ML classifier",
            }
        )

    if not breakdown:
        breakdown.append(
            {
                "factor": "No strong suspicious indicators detected",
                "weight": 0,
                "source": "Risk engine",
            }
        )

    return breakdown


def add_url_risk_to_result(result: dict, url_analysis: dict) -> tuple[dict, float]:
    max_url_score = float(url_analysis.get("max_url_risk_score", 0))
    suspicious_urls = int(url_analysis.get("suspicious_urls", 0))
    urls_found = int(url_analysis.get("urls_found", 0))

    url_adjustment = 0

    if urls_found > 0:
        result.setdefault("risk_factors", [])

        if suspicious_urls > 0:
            url_adjustment = min(25, round(max_url_score * 0.25, 2))
            result["risk_factors"].append(
                f"{suspicious_urls} suspicious URL(s) detected"
            )
        else:
            result["risk_factors"].append(
                f"{urls_found} URL(s) found with no major URL risk indicators"
            )

    original_score = float(result.get("risk_score", 0))
    final_score = min(100, round(original_score + url_adjustment, 2))

    result["risk_score"] = final_score
    result["category"] = category_for_score(final_score)
    result["url_analysis"] = url_analysis

    return result, url_adjustment


def add_ml_risk_to_result(result: dict, ml_analysis: dict) -> tuple[dict, float]:
    label = ml_analysis.get("label", "Safe")
    confidence = float(ml_analysis.get("confidence", 0))

    ml_adjustment = 0

    if label == "Scam":
        ml_adjustment = round(15 * confidence, 2)
        result.setdefault("risk_factors", []).append(
            f"ML classifier predicts Scam with {round(confidence * 100)}% confidence"
        )

    elif label == "Suspicious":
        ml_adjustment = round(8 * confidence, 2)
        result.setdefault("risk_factors", []).append(
            f"ML classifier predicts Suspicious with {round(confidence * 100)}% confidence"
        )

    else:
        result.setdefault("risk_factors", []).append(
            f"ML classifier predicts Safe with {round(confidence * 100)}% confidence"
        )

    original_score = float(result.get("risk_score", 0))
    final_score = min(100, round(original_score + ml_adjustment, 2))

    result["risk_score"] = final_score
    result["category"] = category_for_score(final_score)
    result["ml_analysis"] = ml_analysis

    return result, ml_adjustment


def add_profile_risk_to_result(result: dict, profile_analysis: dict) -> tuple[dict, float]:
    label = profile_analysis.get("label", "real")
    confidence = float(profile_analysis.get("confidence", 0))

    profile_adjustment = 0

    if label == "fake":
        profile_adjustment = round(12 * confidence, 2)
        result.setdefault("risk_factors", []).append(
            f"Profile ML classifier predicts Fake with {round(confidence * 100)}% confidence"
        )

    elif label == "automated":
        profile_adjustment = round(8 * confidence, 2)
        result.setdefault("risk_factors", []).append(
            f"Profile ML classifier predicts Automated with {round(confidence * 100)}% confidence"
        )

    else:
        result.setdefault("risk_factors", []).append(
            f"Profile ML classifier predicts Real-like with {round(confidence * 100)}% confidence"
        )

    original_score = float(result.get("risk_score", 0))
    final_score = min(100, round(original_score + profile_adjustment, 2))

    result["risk_score"] = final_score
    result["category"] = category_for_score(final_score)
    result["profile_analysis"] = profile_analysis

    return result, profile_adjustment


def strengthen_explanation_with_url(result: dict, url_analysis: dict) -> dict:
    suspicious_urls = int(url_analysis.get("suspicious_urls", 0))
    urls_found = int(url_analysis.get("urls_found", 0))

    if urls_found <= 0:
        return result

    if suspicious_urls > 0:
        url_sentence = (
            f" URL analysis found {suspicious_urls} suspicious link(s), "
            "which increases the likelihood of phishing, impersonation, or credential theft."
        )

        result["explanation"] = (result.get("explanation", "") + url_sentence).strip()

        result["recommendation"] = (
            result.get("recommendation", "")
            + " Do not click suspicious links or enter login credentials. "
              "Verify the domain through the official app or website."
        ).strip()
    else:
        url_sentence = (
            f" URL analysis found {urls_found} link(s), but no major URL-specific risk indicators were detected."
        )

        result["explanation"] = (result.get("explanation", "") + url_sentence).strip()

    return result


def strengthen_explanation_with_ml(result: dict, ml_analysis: dict) -> dict:
    label = ml_analysis.get("label", "Safe")
    confidence = round(float(ml_analysis.get("confidence", 0)) * 100)

    result["explanation"] = (
        result.get("explanation", "")
        + f" The NLP/ML classifier assessed the message as {label} "
          f"with {confidence}% confidence."
    ).strip()

    if label == "Scam":
        result["recommendation"] = (
            result.get("recommendation", "")
            + " The message also matches scam-like language patterns learned by the ML classifier."
        ).strip()
    elif label == "Suspicious":
        result["recommendation"] = (
            result.get("recommendation", "")
            + " The message also contains suspicious language patterns according to the ML classifier."
        ).strip()

    return result


def strengthen_explanation_with_profile(result: dict, profile_analysis: dict) -> dict:
    label = profile_analysis.get("label", "real")
    confidence = round(float(profile_analysis.get("confidence", 0)) * 100)

    result["explanation"] = (
        result.get("explanation", "")
        + f" The profile ML classifier assessed the account metadata as {label} "
          f"with {confidence}% confidence."
    ).strip()

    if label == "fake":
        result["recommendation"] = (
            result.get("recommendation", "")
            + " The account metadata also resembles fake-profile patterns from the trained profile dataset."
        ).strip()

    elif label == "automated":
        result["recommendation"] = (
            result.get("recommendation", "")
            + " The account metadata also resembles automated-account behaviour from the trained profile dataset."
        ).strip()

    return result


@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_identity(request: AnalysisRequest):
    result = analysis_service.analyze_identity(
        username=request.username,
        followers=request.followers,
        following=request.following,
        bio=request.bio,
        message=request.message,
    )

    url_analysis = scan_urls_from_text(
        request.bio or "",
        request.message or "",
    )

    result, url_adjustment = add_url_risk_to_result(
        result=result,
        url_analysis=url_analysis,
    )

    ml_analysis = classify_message_with_ml(
        username=request.username,
        bio=request.bio or "",
        message=request.message,
        followers=request.followers,
        following=request.following,
        url_analysis=url_analysis,
    )

    result, ml_adjustment = add_ml_risk_to_result(
        result=result,
        ml_analysis=ml_analysis,
    )

    profile_analysis = classify_profile_with_ml(
        username=request.username,
        bio=request.bio or "",
        followers=request.followers,
        following=request.following,
    )

    result, profile_adjustment = add_profile_risk_to_result(
        result=result,
        profile_analysis=profile_analysis,
    )

    result["scam_type"] = infer_scam_type(
        result=result,
        message=request.message,
        bio=request.bio or "",
        username=request.username,
    )

    result["confidence"] = confidence_for_result(
        risk_score=result.get("risk_score", 0),
        risk_factors=result.get("risk_factors", []),
        url_analysis=url_analysis,
        ml_analysis=ml_analysis,
        profile_analysis=profile_analysis,
    )

    result["score_breakdown"] = build_score_breakdown(
        risk_score=result.get("risk_score", 0),
        risk_factors=result.get("risk_factors", []),
        url_adjustment=url_adjustment,
        ml_adjustment=ml_adjustment,
        profile_adjustment=profile_adjustment,
    )

    result = strengthen_explanation_with_url(
        result=result,
        url_analysis=url_analysis,
    )

    result = strengthen_explanation_with_ml(
        result=result,
        ml_analysis=ml_analysis,
    )

    result = strengthen_explanation_with_profile(
        result=result,
        profile_analysis=profile_analysis,
    )

    save_analysis(
        request_data=request.model_dump(),
        result=result,
    )

    return AnalysisResponse(**result)


@router.post("/twin-detection", response_model=TwinDetectionResponse)
async def detect_twin(request: TwinDetectionRequest):
    result = twin_detection_service.detect_twin(
        legitimate_username=request.legitimate_username,
        suspicious_username=request.suspicious_username,
    )
    return TwinDetectionResponse(**result)


@router.get("/simulations")
async def get_simulations():
    return {"scenarios": SIMULATION_SCENARIOS}


@router.post("/simulations/{scenario_id}/response")
async def submit_simulation_response(scenario_id: int, response: dict):
    user_response = response.get("response", "")

    scenario = next(
        (item for item in SIMULATION_SCENARIOS if item["id"] == scenario_id),
        None,
    )

    if not scenario:
        raise HTTPException(status_code=404, detail="Scenario not found")

    is_correct = user_response == scenario["correct_response"]

    save_simulation_attempt(
        scenario=scenario,
        user_response=user_response,
        is_correct=is_correct,
    )

    return SimulationResponse(
        is_correct=is_correct,
        your_response=user_response,
        correct_response=scenario["correct_response"],
        explanation=f"{'Great judgment!' if is_correct else 'Not the best choice.'} The correct action was to {scenario['correct_response'].lower()} this message.",
        tactics_used=scenario["manipulation_tactics"],
    )


@router.get("/dashboard/stats")
async def get_dashboard_stats():
    return db_dashboard_stats()


@router.get("/deception-graph")
async def get_deception_graph():
    return db_deception_graph()


@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "VERITAS API",
    }