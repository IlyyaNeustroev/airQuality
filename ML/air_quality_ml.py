import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import joblib
import psycopg2
from datetime import datetime
import os
from flask import Flask, request, jsonify  # ← ИМПОРТ В НАЧАЛО!

class AirQualityPredictor:
    def __init__(self, model_path='air_quality_model.pkl', scaler_path='scaler.pkl'):
        self.model_path = model_path
        self.scaler_path = scaler_path
        self.model = None
        self.scaler = StandardScaler()
        self.feature_columns = [
            'season', 'weekday', 'temp', 'hum', 'mq7', 'mq135', 
            'ky028_analog', 'ky028_digital', 'bmp_temp', 'pressure', 
            'altitude', 'aht21_temp', 'aht21_hum', 'ens_iaq', 'ens_tvoc', 'ens_co2'
        ]
        self.load_model()
    
    def preprocess_features(self, X):
        """Обработка -1 → средние значения"""
        means = {
            'temp': 22.0, 'hum': 45.0, 'mq7': 120, 'mq135': 110,
            'ky028_analog': 35, 'ky028_digital': 0, 'bmp_temp': 15.0,
            'pressure': 1013, 'altitude': 82, 'aht21_temp': 22.0, 'aht21_hum': 45.0,
            'ens_iaq': 75, 'ens_tvoc': 250, 'ens_co2': 800
        }
        
        X_processed = X.copy()
        for col in self.feature_columns:
            if col in means:
                X_processed[col] = np.where(X_processed[col] == -1, means[col], X_processed[col])
        
        return X_processed[self.feature_columns]
    
    def predict(self, sensor_data):
        if self.model is None:
            return {"error": "Модель не обучена!"}
        
        # Заполняем отсутствующие поля средними
        for col in self.feature_columns:
            if col not in sensor_data:
                sensor_data[col] = -1  # Будет заменено на среднее
        
        df = pd.DataFrame([sensor_data])
        X = self.preprocess_features(df)
        X_scaled = self.scaler.transform(X)
        
        iaq_class = self.model.predict(X_scaled)[0]
        iaq_proba = dict(zip(self.model.classes_, self.model.predict_proba(X_scaled)[0]))
        
        return {
            "iaq_class": int(iaq_class),
            "probabilities": {int(k): round(float(v), 3) for k, v in iaq_proba.items()},
            "recommendation": self.get_recommendation(iaq_class)
        }
    
    def get_recommendation(self, iaq_class):
        recs = {
            0: "✅ Отлично", 1: "🟢 Хорошо", 2: "🟡 Удовл.", 
            3: "🟠 Плохо", 4: "🔴 Очень плохо", 5: "🚨 АВАРИЯ!"
        }
        return recs.get(iaq_class, "Неизвестно")
    
    def train_from_csv(self, csv_path):
        df = pd.read_csv(csv_path)
        print(f"Загружен датасет: {len(df)} записей")
        
        X = self.preprocess_features(df)
        y = df['iaq_class']
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        self.model = RandomForestClassifier(n_estimators=200, max_depth=15, random_state=42, class_weight='balanced')
        self.model.fit(X_train_scaled, y_train)
        
        y_pred = self.model.predict(X_test_scaled)
        print("\n📊 Качество модели:")
        print(classification_report(y_test, y_pred))
        
        self.save_model()
        return {"status": "Обучена", "accuracy": self.model.score(X_test_scaled, y_test)}
    
    def train_from_df(self, df):  # ← НОВЫЙ МЕТОД!
        """Обучение на DataFrame (из БД)"""
        print(f"Обучение на DataFrame: {len(df)} записей")
        return self.train_from_csv_like(df)  # Используем тот же код
    
    def retrain_from_db(self, db_config, limit=10000):
        conn = psycopg2.connect(**db_config)
        try:
            query = f"""
            SELECT season, weekday, temp, hum, mq7, mq135, ky028_analog, ky028_digital,
                   bmp_temp, pressure, altitude, aht21_temp, aht21_hum, ens_iaq, ens_tvoc, ens_co2,
                   iaq_class 
            FROM sensor.data 
            WHERE iaq_class IS NOT NULL 
            ORDER BY created_at DESC 
            LIMIT {limit}
            """
            df = pd.read_sql_query(query, conn)
            
            if len(df) < 100:
                return {"error": "Недостаточно данных в БД"}
            
            print(f"Загружено из БД: {len(df)} записей")
            return self.train_from_df(df)
        finally:
            conn.close()
    
    def save_model(self):
        joblib.dump(self.model, self.model_path)
        joblib.dump(self.scaler, self.scaler_path)
        print("✅ Модель сохранена")
    
    def load_model(self):
        try:
            self.model = joblib.load(self.model_path)
            self.scaler = joblib.load(self.scaler_path)
            print("✅ Модель загружена")
        except:
            print("⚠️ Модель не найдена")

# Flask
app = Flask(__name__)  # ← app вместо ml_app!
predictor = AirQualityPredictor()

@app.route('/predict', methods=['POST'])
def api_predict():
    data = request.json
    result = predictor.predict(data)
    return jsonify(result)

@app.route('/retrain', methods=['POST'])
def api_retrain():
    db_config = request.json.get('db_config', {})
    result = predictor.retrain_from_db(db_config)
    return jsonify(result)

@app.route('/status', methods=['GET'])
def status():
    return jsonify({
        "model_loaded": predictor.model is not None,
        "features": predictor.feature_columns
    })

@app.route('/')
def index():
    return """
    <!DOCTYPE html>
    <html><head><title>ML Air Quality</title>
    <style>body{font-family:Arial;padding:20px;} .endpoint{background:#f0f8ff;padding:10px;margin:10px 0;border-left:4px solid #007bff;}</style>
    </head><body>
    <h1>ML Air Quality Predictor (93% accuracy)</h1>
    <h2>Эндпоинты:</h2>
    <div class="endpoint">POST /predict — прогноз IAQ</div>
    <div class="endpoint">GET /status — статус</div>
    <div class="endpoint">POST /retrain — переобучение из БД</div>
    </body></html>
    """

if __name__ == "__main__":
    # Обучение (правильный файл!)
    predictor.train_from_csv("air_quality_training_dataset_2.csv")  # ← ИЛИ ваш файл
    
    app.run(host='0.0.0.0', port=5001, debug=False)