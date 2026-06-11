from pathlib import Path
from typing import Dict, List

import joblib
import pandas as pd


BACKEND_DIR = Path(__file__).resolve().parents[1]
MODEL_PATH = BACKEND_DIR / "models" / "profile_model.joblib"


FEATURE_COLS = [
    "followers",
    "following",
    "posts",
    "bio_length",
    "username_length",
    "username_digit_count",
    "has_profile_pic",
    "is_private",
    "has_external_url",
    "has_highlight_reels",
    "follower_following_ratio",
]


def load_model():
    if MODEL_PATH.exists():
        return joblib.load(MODEL_PATH)

    return None


MODEL = load_model()


def count_digits(value: str) -> int:
    return sum(char.isdigit() for char in value or "")


def build_profile_features(
    username: str,
    bio: str,
    followers: int,
    following: int,
) -> pd.DataFrame:
    username_clean = (username or "").replace("@", "").strip()
    bio_clean = bio or ""

    has_external_url = 1 if "http://" in bio_clean.lower() or "https://" in bio_clean.lower() or "www." in bio_clean.lower() else 0

    row = {
        "followers": int(followers or 0),
        "following": int(following or 0),
        "posts": 0,
        "bio_length": len(bio_clean),
        "username_length": len(username_clean),
        "username_digit_count": count_digits(username_clean),
        "has_profile_pic": 1,
        "is_private": 0,
        "has_external_url": has_external_url,
        "has_highlight_reels": 0,
        "follower_following_ratio": int(followers or 0) / (int(following or 0) + 1),
    }

    return pd.DataFrame([row], columns=FEATURE_COLS)


def label_to_profile_risk(label: str, confidence: float) -> float:
    if label == "fake":
        return round(70 + confidence * 30, 2)

    if label == "automated":
        return round(45 + confidence * 35, 2)

    return round(confidence * 25, 2)


def fallback_profile_classify(
    username: str,
    bio: str,
    followers: int,
    following: int,
) -> Dict:
    username_lower = (username or "").lower()
    bio_lower = (bio or "").lower()

    indicators: List[str] = []
    score = 0

    if followers < 100 and following > 1000:
        indicators.append("Very low followers with high following count")
        score += 35

    if any(word in username_lower for word in ["support", "official", "helpdesk", "admin"]):
        indicators.append("Authority-style term detected in username")
        score += 25

    if any(word in bio_lower for word in ["verify", "official", "support", "investment", "profit"]):
        indicators.append("Suspicious trust-building terms detected in bio")
        score += 20

    if score >= 60:
        label = "fake"
        confidence = 0.75
    elif score >= 30:
        label = "automated"
        confidence = 0.65
    else:
        label = "real"
        confidence = 0.65
        indicators.append("Fallback profile classifier found no strong profile-level risk")

    return {
        "label": label,
        "confidence": confidence,
        "risk_score": label_to_profile_risk(label, confidence),
        "probabilities": {
            "real": 0.15 if label != "real" else confidence,
            "fake": confidence if label == "fake" else 0.15,
            "automated": confidence if label == "automated" else 0.15,
        },
        "indicators": indicators,
    }


def classify_profile_with_ml(
    username: str,
    bio: str,
    followers: int,
    following: int,
) -> Dict:
    if MODEL is None:
        return fallback_profile_classify(username, bio, followers, following)

    features = build_profile_features(
        username=username,
        bio=bio,
        followers=followers,
        following=following,
    )

    predicted_label = MODEL.predict(features)[0]

    probabilities_raw = MODEL.predict_proba(features)[0]
    classes = MODEL.classes_

    probabilities = {
        str(label): round(float(prob), 4)
        for label, prob in zip(classes, probabilities_raw)
    }

    confidence = probabilities.get(predicted_label, 0.0)
    risk_score = label_to_profile_risk(predicted_label, confidence)

    indicators = []

    if predicted_label == "fake":
        indicators.append("Profile ML classifier detected fake-account-like metadata")
    elif predicted_label == "automated":
        indicators.append("Profile ML classifier detected automated-account-like metadata")
    else:
        indicators.append("Profile ML classifier classified the profile as real-like")

    return {
        "label": str(predicted_label),
        "confidence": round(float(confidence), 4),
        "risk_score": risk_score,
        "probabilities": probabilities,
        "indicators": indicators,
    }


def reload_model():
    global MODEL
    MODEL = load_model()
    return MODEL is not None