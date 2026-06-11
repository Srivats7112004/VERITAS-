import json
from pathlib import Path

import pandas as pd


BASE_DIR = Path(__file__).resolve().parent.parent.parent

RAW_DIR = BASE_DIR / "data" / "raw" / "profiles" / "instafake-dataset" / "data"
OUT_PATH = BASE_DIR / "data" / "processed" / "profile_dataset.csv"

OUT_PATH.parent.mkdir(parents=True, exist_ok=True)


def load_json_files(folder: Path) -> pd.DataFrame:
    rows = []

    if not folder.exists():
        print(f"Folder not found: {folder}")
        return pd.DataFrame()

    for file in folder.rglob("*.json"):
        try:
            with open(file, "r", encoding="utf-8") as f:
                data = json.load(f)

            if isinstance(data, list):
                rows.extend(data)
            elif isinstance(data, dict):
                if "data" in data and isinstance(data["data"], list):
                    rows.extend(data["data"])
                else:
                    rows.append(data)

        except Exception as error:
            print(f"Could not read {file}: {error}")

    return pd.DataFrame(rows)


def map_boolean_label(series, positive_label, negative_label):
    normalized = series.astype(str).str.strip().str.lower()

    return normalized.map(
        {
            "true": positive_label,
            "1": positive_label,
            "yes": positive_label,
            "false": negative_label,
            "0": negative_label,
            "no": negative_label,
        }
    )


def clean_numeric_column(df: pd.DataFrame, column: str, default_value=0):
    if column not in df.columns:
        df[column] = default_value

    df[column] = pd.to_numeric(df[column], errors="coerce").fillna(default_value)
    return df


fake_path = RAW_DIR / "fake-v1.0"
automated_path = RAW_DIR / "automated-v1.0"

fake_df = load_json_files(fake_path)
automated_df = load_json_files(automated_path)

frames = []

if not fake_df.empty:
    print("\nFake dataset columns:")
    print(fake_df.columns.tolist())

    if "isFake" not in fake_df.columns:
        raise KeyError("Column 'isFake' not found in fake-v1.0 dataset.")

    fake_df["label"] = map_boolean_label(
        fake_df["isFake"],
        positive_label="fake",
        negative_label="real",
    )

    fake_df["source"] = "InstaFake_fake_v1"
    frames.append(fake_df)


if not automated_df.empty:
    print("\nAutomated dataset columns:")
    print(automated_df.columns.tolist())

    if "automatedBehaviour" not in automated_df.columns:
        raise KeyError("Column 'automatedBehaviour' not found in automated-v1.0 dataset.")

    automated_df["label"] = map_boolean_label(
        automated_df["automatedBehaviour"],
        positive_label="automated",
        negative_label="real",
    )

    automated_df["source"] = "InstaFake_automated_v1"
    frames.append(automated_df)


if not frames:
    raise FileNotFoundError(
        f"No dataset files found. Check this path:\n{RAW_DIR}"
    )


profile_df = pd.concat(frames, ignore_index=True)

rename_map = {
    "userFollowerCount": "followers",
    "userFollowingCount": "following",
    "userMediaCount": "posts",
    "userBiographyLength": "bio_length",
    "usernameLength": "username_length",
    "usernameDigitCount": "username_digit_count",
    "userHasProfilPic": "has_profile_pic",
    "userIsPrivate": "is_private",
    "userHasExternalUrl": "has_external_url",
    "userHasHighlighReels": "has_highlight_reels",
}

profile_df = profile_df.rename(columns=rename_map)

profile_df["username"] = ""
profile_df["bio"] = ""

needed_cols = [
    "username",
    "bio",
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
    "label",
    "source",
]

for col in needed_cols:
    if col not in profile_df.columns:
        profile_df[col] = 0 if col not in ["username", "bio", "label", "source"] else ""

profile_df = profile_df[needed_cols]

profile_df = profile_df.dropna(subset=["label"])
profile_df = profile_df[profile_df["label"].isin(["real", "fake", "automated"])]

numeric_cols = [
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
]

for col in numeric_cols:
    profile_df = clean_numeric_column(profile_df, col)

profile_df["follower_following_ratio"] = profile_df["followers"] / (
    profile_df["following"] + 1
)

profile_df.to_csv(OUT_PATH, index=False)

print("\nSaved:", OUT_PATH)

print("\nFirst 5 rows:")
print(profile_df.head())

print("\nLabel counts:")
print(profile_df["label"].value_counts(dropna=False))