import json
from pathlib import Path

import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline


BACKEND_DIR = Path(__file__).resolve().parents[2]
DATASET_PATH = BACKEND_DIR / "ml" / "datasets" / "processed" / "message_dataset.csv"
MODEL_DIR = BACKEND_DIR / "ml" / "models"
MODEL_PATH = MODEL_DIR / "message_model.joblib"
METRICS_PATH = MODEL_DIR / "message_model_metrics.json"


def clean_text(value: str) -> str:
    if pd.isna(value):
        return ""

    return str(value).strip().lower()


def load_dataset() -> pd.DataFrame:
    if not DATASET_PATH.exists():
        raise FileNotFoundError(f"Dataset not found at: {DATASET_PATH}")

    df = pd.read_csv(DATASET_PATH)

    required_columns = {"text", "label"}
    missing_columns = required_columns - set(df.columns)

    if missing_columns:
        raise ValueError(f"Dataset is missing columns: {missing_columns}")

    df = df.dropna(subset=["text", "label"]).copy()
    df["text"] = df["text"].apply(clean_text)
    df["label"] = df["label"].astype(str).str.strip()

    allowed_labels = {"Safe", "Suspicious", "Scam"}
    invalid_labels = set(df["label"].unique()) - allowed_labels

    if invalid_labels:
        raise ValueError(f"Invalid labels found: {invalid_labels}")

    return df


def train_model(df: pd.DataFrame) -> tuple[Pipeline, dict]:
    x = df["text"]
    y = df["label"]

    label_counts = y.value_counts()
    stratify = y if label_counts.min() >= 2 else None

    x_train, x_test, y_train, y_test = train_test_split(
        x,
        y,
        test_size=0.25,
        random_state=42,
        stratify=stratify,
    )

    model = Pipeline(
        steps=[
            (
                "tfidf",
                TfidfVectorizer(
                    lowercase=True,
                    ngram_range=(1, 2),
                    min_df=1,
                    max_features=5000,
                ),
            ),
            (
                "classifier",
                LogisticRegression(
                    max_iter=1000,
                    class_weight="balanced",
                    random_state=42,
                ),
            ),
        ]
    )

    model.fit(x_train, y_train)

    predictions = model.predict(x_test)

    metrics = {
        "dataset_path": str(DATASET_PATH),
        "total_rows": int(len(df)),
        "train_rows": int(len(x_train)),
        "test_rows": int(len(x_test)),
        "labels": sorted(df["label"].unique().tolist()),
        "label_distribution": {
            label: int(count)
            for label, count in df["label"].value_counts().items()
        },
        "accuracy": float(accuracy_score(y_test, predictions)),
        "classification_report": classification_report(
            y_test,
            predictions,
            output_dict=True,
            zero_division=0,
        ),
        "confusion_matrix": confusion_matrix(
            y_test,
            predictions,
            labels=["Safe", "Suspicious", "Scam"],
        ).tolist(),
        "confusion_matrix_labels": ["Safe", "Suspicious", "Scam"],
    }

    return model, metrics


def main():
    MODEL_DIR.mkdir(parents=True, exist_ok=True)

    df = load_dataset()
    model, metrics = train_model(df)

    joblib.dump(model, MODEL_PATH)

    with open(METRICS_PATH, "w", encoding="utf-8") as file:
        json.dump(metrics, file, indent=2)

    print("Message model trained successfully.")
    print(f"Rows used: {metrics['total_rows']}")
    print(f"Accuracy: {metrics['accuracy']:.4f}")
    print(f"Model saved to: {MODEL_PATH}")
    print(f"Metrics saved to: {METRICS_PATH}")


if __name__ == "__main__":
    main()