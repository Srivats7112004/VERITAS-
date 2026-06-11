from pathlib import Path
from typing import Dict, List

import joblib


BACKEND_DIR = Path(__file__).resolve().parents[1]
MODEL_PATH = BACKEND_DIR / "ml" / "models" / "message_model.joblib"


FALLBACK_KEYWORDS = {
    "scam": [
        "otp",
        "password",
        "send money",
        "bitcoin",
        "btc",
        "gift card",
        "double your money",
        "seed phrase",
        "login here",
        "account disabled",
        "account will be disabled",
        "verify now",
        "verify here",
        "send otp",
        "upi pin",
    ],
    "suspicious": [
        "limited time",
        "special offer",
        "claim",
        "reward",
        "selected",
        "processing fee",
        "urgent",
        "verify",
        "eligible",
        "giveaway",
        "collaboration",
        "guaranteed",
    ],
}


def load_model():
    if MODEL_PATH.exists():
        return joblib.load(MODEL_PATH)

    return None


MODEL = load_model()


def build_feature_text(
    username: str,
    bio: str,
    message: str,
    followers: int,
    following: int,
    url_analysis: Dict | None = None,
) -> str:
    url_analysis = url_analysis or {}

    markers: List[str] = []

    if followers < 100 and following > 1000:
        markers.append("low followers high following suspicious profile")

    if followers < 50:
        markers.append("very low follower account")

    if url_analysis.get("suspicious_urls", 0) > 0:
        markers.append("suspicious url detected phishing link")

    if url_analysis.get("max_url_risk_score", 0) >= 60:
        markers.append("high risk url fake login domain")

    return " ".join(
        [
            username or "",
            bio or "",
            message or "",
            " ".join(markers),
        ]
    ).lower()


def label_to_risk_score(label: str, confidence: float) -> float:
    if label == "Scam":
        return round(65 + confidence * 35, 2)

    if label == "Suspicious":
        return round(35 + confidence * 30, 2)

    return round(confidence * 25, 2)


def fallback_classify(text: str) -> Dict:
    text_lower = text.lower()

    scam_hits = [
        keyword for keyword in FALLBACK_KEYWORDS["scam"]
        if keyword in text_lower
    ]

    suspicious_hits = [
        keyword for keyword in FALLBACK_KEYWORDS["suspicious"]
        if keyword in text_lower
    ]

    if scam_hits:
        label = "Scam"
        confidence = min(0.95, 0.65 + len(scam_hits) * 0.08)
    elif suspicious_hits:
        label = "Suspicious"
        confidence = min(0.85, 0.55 + len(suspicious_hits) * 0.06)
    else:
        label = "Safe"
        confidence = 0.65

    probabilities = {
        "Safe": 0.0,
        "Suspicious": 0.0,
        "Scam": 0.0,
    }

    probabilities[label] = round(confidence, 4)

    remaining = round(1 - confidence, 4)
    other_labels = [item for item in probabilities if item != label]

    for other_label in other_labels:
        probabilities[other_label] = round(remaining / 2, 4)

    return {
        "label": label,
        "confidence": round(float(confidence), 4),
        "risk_score": label_to_risk_score(label, confidence),
        "probabilities": probabilities,
        "indicators": [
            "Fallback keyword classifier used because trained model file was not found"
        ],
    }


def classify_message_with_ml(
    username: str,
    bio: str,
    message: str,
    followers: int,
    following: int,
    url_analysis: Dict | None = None,
) -> Dict:
    text = build_feature_text(
        username=username,
        bio=bio,
        message=message,
        followers=followers,
        following=following,
        url_analysis=url_analysis,
    )

    if MODEL is None:
        return fallback_classify(text)

    predicted_label = MODEL.predict([text])[0]

    probabilities_raw = MODEL.predict_proba([text])[0]
    classes = MODEL.classes_

    probabilities = {
        str(label): round(float(prob), 4)
        for label, prob in zip(classes, probabilities_raw)
    }

    confidence = probabilities.get(predicted_label, 0.0)
    risk_score = label_to_risk_score(predicted_label, confidence)

    if predicted_label == "Scam":
        indicators = ["Trained ML classifier detected scam-like language"]
    elif predicted_label == "Suspicious":
        indicators = ["Trained ML classifier detected suspicious persuasion or risk language"]
    else:
        indicators = ["Trained ML classifier did not detect strong scam-like language"]

    return {
        "label": predicted_label,
        "confidence": round(float(confidence), 4),
        "risk_score": risk_score,
        "probabilities": probabilities,
        "indicators": indicators,
    }


def reload_model():
    global MODEL
    MODEL = load_model()
    return MODEL is not None