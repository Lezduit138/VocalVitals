import os
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROCESSED_DIR = os.path.join(SCRIPT_DIR, "..", "data", "processed")

def load_dataset():
    metadata_path = os.path.join(PROCESSED_DIR, "metadata.csv")
    df = pd.read_csv(metadata_path)

    labels = sorted(df["label"].unique())
    label_to_index = {label: idx for idx, label in enumerate(labels)}

    X = []
    y = []
    for _, row in df.iterrows():
        feature_path = os.path.join(SCRIPT_DIR, "..", row["feature_path"])
        features = np.load(feature_path)
        X.append(features)
        y.append(label_to_index[row["label"]])

    return np.array(X), np.array(y), labels, label_to_index

def main():
    X, y, labels, label_to_index = load_dataset()
    print("=" * 60)
    print("Dataset loaded")
    print(f"  Examples: {X.shape[0]}")
    print(f"  Feature dimension: {X.shape[1]}")
    print(f"  Classes: {len(labels)}")
    print(f"  Labels: {labels}")
    print("=" * 60)

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=0.2, stratify=y, random_state=42
    )

    print(f"\nTraining split: {X_train.shape[0]} examples")
    print(f"Test split: {X_test.shape[0]} examples\n")

    model = RandomForestClassifier(
        n_estimators=250,
        max_depth=20,
        min_samples_leaf=2,
        min_samples_split=5,
        max_features="sqrt",
        class_weight="balanced",
        random_state=42,
        n_jobs=-1,
        verbose=1
    )

    print("Training Random Forest...")
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    y_pred_proba = model.predict_proba(X_test)

    test_acc = accuracy_score(y_test, y_pred)
    print(f"\nTest accuracy: {test_acc:.4f}")

    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=labels, zero_division=0))

    print("Confusion Matrix:")
    cm = confusion_matrix(y_test, y_pred)
    print(cm)
    print()

    print("Cross-validation scores (5-fold):")
    cv_scores = cross_val_score(model, X_scaled, y, cv=5, scoring="accuracy", n_jobs=-1)
    print(f"  CV accuracy: {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")
    print(f"  Fold scores: {[f'{s:.4f}' for s in cv_scores]}")

    print("\nFeature importance (top 10):")
    feature_importance = model.feature_importances_
    top_indices = np.argsort(feature_importance)[-10:][::-1]
    for i, idx in enumerate(top_indices, 1):
        print(f"  {i}. Feature {idx}: {feature_importance[idx]:.4f}")

    model_path = os.path.join(SCRIPT_DIR, "model.pkl")
    scaler_path = os.path.join(SCRIPT_DIR, "scaler.pkl")
    label_map_path = os.path.join(SCRIPT_DIR, "label_map.txt")

    joblib.dump(model, model_path)
    joblib.dump(scaler, scaler_path)
    print(f"\nModel saved to {model_path}")
    print(f"Scaler saved to {scaler_path}")

    with open(label_map_path, "w") as f:
        for label in labels:
            f.write(f"{label}\n")
    print(f"Label map saved to {label_map_path}")

    print("=" * 60)
    print("Training complete!")
    print("=" * 60)

if __name__ == "__main__":
    main()