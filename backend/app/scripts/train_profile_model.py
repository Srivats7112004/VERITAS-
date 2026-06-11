import json
from pathlib import Path

import joblib
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier


BASE_DIR = Path(__file__).resolve().parent.parent.parent

DATA_PATH = BASE_DIR / "data" / "processed" / "profile_dataset.csv"
MODEL_PATH = BASE_DIR / "models" / "profile_model.joblib"
METRICS_PATH = BASE_DIR / "models" / "profile_model_metrics.json"

MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)


feature_cols = [
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


def main():
    if not DATA_PATH.exists():
        raise FileNotFoundError(
            f"Profile dataset not found at: {DATA_PATH}\n"
            "Run prepare_profile_dataset.py first."
        )

    df = pd.read_csv(DATA_PATH)

    print("Dataset loaded:")
    print(df.head())

    print("\nLabel counts:")
    print(df["label"].value_counts())

    for col in feature_cols:
        if col not in df.columns:
            df[col] = 0

        df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0)

    df = df.dropna(subset=["label"])
    df = df[df["label"].isin(["real", "fake", "automated"])]

    X = df[feature_cols]
    y = df["label"]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y,
    )

    model = Pipeline(
        [
            ("scaler", StandardScaler()),
            (
                "classifier",
                RandomForestClassifier(
                    n_estimators=300,
                    random_state=42,
                    class_weight="balanced",
                    max_depth=None,
                ),
            ),
        ]
    )

    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)

    accuracy = accuracy_score(y_test, y_pred)

    report = classification_report(
        y_test,
        y_pred,
        output_dict=True,
        zero_division=0,
    )

    labels = ["real", "fake", "automated"]

    matrix = confusion_matrix(
        y_test,
        y_pred,
        labels=labels,
    ).tolist()

    metrics = {
        "dataset_path": str(DATA_PATH),
        "model_path": str(MODEL_PATH),
        "total_rows": int(len(df)),
        "train_rows": int(len(X_train)),
        "test_rows": int(len(X_test)),
        "features": feature_cols,
        "labels": labels,
        "label_distribution": {
            label: int(count)
            for label, count in df["label"].value_counts().items()
        },
        "accuracy": float(accuracy),
        "classification_report": report,
        "confusion_matrix_labels": labels,
        "confusion_matrix": matrix,
    }

    joblib.dump(model, MODEL_PATH)

    with open(METRICS_PATH, "w", encoding="utf-8") as file:
        json.dump(metrics, file, indent=2)

    print("\nAccuracy:")
    print(accuracy)

    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, zero_division=0))

    print("\nModel saved at:")
    print(MODEL_PATH)

    print("\nMetrics saved at:")
    print(METRICS_PATH)


if __name__ == "__main__":
    main()