
"""
Сравнение только LightGBM и CatBoost для классификации качества воздуха
Запуск:
    python compare_lgbm_catboost.py
"""

import pandas as pd
import numpy as np
import warnings
warnings.filterwarnings("ignore")

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, classification_report

# LightGBM
try:
    from lightgbm import LGBMClassifier
    HAS_LIGHTGBM = True
except ImportError:
    HAS_LIGHTGBM = False
    print("LightGBM не установлен. Установите: pip install lightgbm")

# CatBoost
try:
    from catboost import CatBoostClassifier
    HAS_CATBOOST = True
except ImportError:
    HAS_CATBOOST = False
    print("CatBoost не установлен. Установите: pip install catboost")


FEATURE_COLUMNS = [
    'season', 'weekday', 'temp', 'hum', 'mq7', 'mq135',
    'ky028_analog', 'ky028_digital', 'bmp_temp', 'pressure',
    'altitude', 'aht21_temp', 'aht21_hum', 'ens_iaq', 'ens_tvoc', 'ens_co2'
]

MEANS = {
    'temp': 22.0,
    'hum': 45.0,
    'mq7': 120,
    'mq135': 110,
    'ky028_analog': 35,
    'ky028_digital': 0,
    'bmp_temp': 15.0,
    'pressure': 1013,
    'altitude': 82,
    'aht21_temp': 22.0,
    'aht21_hum': 45.0,
    'ens_iaq': 75,
    'ens_tvoc': 250,
    'ens_co2': 800
}


def preprocess_features(df: pd.DataFrame) -> pd.DataFrame:
    X = df.copy()
    for col in FEATURE_COLUMNS:
        if col in X.columns and col in MEANS:
            X[col] = np.where(X[col] == -1, MEANS[col], X[col])
    return X[FEATURE_COLUMNS]


def evaluate_model(model, X_test, y_test, model_name: str):
    y_pred = model.predict(X_test)

    metrics = {
        'Модель': model_name,
        'Accuracy': accuracy_score(y_test, y_pred),
        'Precision': precision_score(y_test, y_pred, average='weighted', zero_division=0),
        'Recall': recall_score(y_test, y_pred, average='weighted', zero_division=0),
        'F1-Score': f1_score(y_test, y_pred, average='weighted', zero_division=0)
    }

    print(f"\n{'=' * 80}")
    print(f"Модель: {model_name}")
    print(f"{'=' * 80}")
    print(classification_report(y_test, y_pred, zero_division=0))

    return metrics


def main(csv_path="ML//air_quality_training_dataset_2.csv"):
    print("=" * 80)
    print("ЗАГРУЗКА ДАННЫХ")
    print("=" * 80)

    df = pd.read_csv(csv_path)
    print(f"Датасет: {len(df):,} строк")
    print(f"Признаков: {len(df.columns) - 1}")
    print(f"Классы: {sorted(df['iaq_class'].unique())}")

    X = preprocess_features(df)
    y = df['iaq_class']

    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=0.2,
        random_state=42,
        stratify=y
    )

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    results = []

    if HAS_LIGHTGBM:
        lgbm = LGBMClassifier(
            n_estimators=300,
            learning_rate=0.05,
            max_depth=-1,
            num_leaves=31,
            random_state=42,
            n_jobs=-1,
            class_weight='balanced',
            verbose=-1
        )
        print("\nОбучение LightGBM...")
        lgbm.fit(X_train_scaled, y_train)
        results.append(evaluate_model(lgbm, X_test_scaled, y_test, "LightGBM"))

    if HAS_CATBOOST:
        catboost = CatBoostClassifier(
            iterations=300,
            learning_rate=0.05,
            depth=6,
            loss_function='MultiClass',
            random_seed=42,
            verbose=50
        )
        print("\nОбучение CatBoost...")
        catboost.fit(X_train_scaled, y_train)
        results.append(evaluate_model(catboost, X_test_scaled, y_test, "CatBoost"))

    if not results:
        print("Ни одна из моделей не установлена.")
        return

    results_df = pd.DataFrame(results).sort_values(by='F1-Score', ascending=False).reset_index(drop=True)

    print("\n" + "=" * 80)
    print("ИТОГОВОЕ СРАВНЕНИЕ")
    print("=" * 80)
    print(results_df.to_string(index=False))

    best = results_df.iloc[0]
    print("\n" + "=" * 80)
    print(f"ЛУЧШАЯ МОДЕЛЬ: {best['Модель']}")
    print("=" * 80)
    print(f"Accuracy : {best['Accuracy']:.4f}")
    print(f"Precision: {best['Precision']:.4f}")
    print(f"Recall   : {best['Recall']:.4f}")
    print(f"F1-Score : {best['F1-Score']:.4f}")

    results_df.to_csv("lgbm_catboost_comparison.csv", index=False, encoding="utf-8-sig")
    print("\nРезультаты сохранены в файл: lgbm_catboost_comparison.csv")


if __name__ == "__main__":
    main()