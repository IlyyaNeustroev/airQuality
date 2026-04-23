from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Разрешаем кросс‑доменные запросы (для Vue.js и других фронтендов)


# HTML‑шаблон для отображения данных (упрощённый вариант)
HTML_TEMPLATE = '''
<!DOCTYPE html>
<html>
<head>
    <title>Умная вентиляция</title>
    <meta charset="utf-8">
    <meta http-equiv="refresh" content="10">
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .sensor-card { border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px; }
        .value { font-size: 1.5em; font-weight: bold; color: #333; }
        .timestamp { color: #666; font-style: italic; }
        h1 { color: #2c3e50; }
    </style>
</head>
<body>
    <h1>📊 Умная вентиляция</h1>
    <p class="timestamp">Последние данные получены: {{ timestamp }}</p>

    <div class="sensor-card">
        <h3>🌡️ Температура</h3>
        <p class="value">{{ temp }} °C</p>
    </div>
    <div class="sensor-card">
        <h3>💧 Влажность</h3>
        <p class="value">{{ hum }} %</p>
    </div>
    <div class="sensor-card">
        <h3>💨 CO (MQ-7)</h3>
        <p class="value">{{ mq7 }} ppm</p>   
    </div>
    <div class="sensor-card">
        <h3>🌫 Качество воздуха (MQ-135)</h3>
        <p class="value">{{ mq135 }}</p>
    </div>
    <div class="sensor-card">
        <h3>☀️ KY-028 (аналог)</h3>
        <p class="value">{{ ky028_analog }}</p>
    </div>
    <div class="sensor-card">
        <h3>💡 KY-028 (цифра)</h3>
        <p class="value">{{ ky028_digital }}</p>
    </div>
</body>
</html>
'''

# Переменная для хранения последних данных
last_data = {
    'mq7': 0,
    'mq135': 0,
    'temp': 0.0,
    'hum': 0.0,
    'ky028_analog': 0,
    'ky028_digital': 0
}

@app.route('/')
def index():
    """Главная страница — отображает текущие данные в HTML"""
    return render_template_string(
        HTML_TEMPLATE,
        timestamp=datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        mq7=last_data['mq7'],
        mq135=last_data['mq135'],
        temp=last_data['temp'],
        hum=last_data['hum'],
        ky028_analog=last_data['ky028_analog'],
        ky028_digital=last_data['ky028_digital']
    )

@app.route('/api/data', methods=['GET'])
def get_data():
    """API endpoint — возвращает текущие данные в формате JSON"""
    response_data = last_data.copy()
    response_data['timestamp'] = datetime.now().isoformat()
    return jsonify(response_data)

@app.route('/data', methods=['POST'])
def receive_data():
    """Приём данных от Arduino через ESP-01"""
    global last_data

    try:
        # Получаем JSON из запроса
        data = request.get_json()
        if not data:
            return jsonify({'status': 'error', 'message': 'No JSON data received'}), 400

        # Обновляем данные
        last_data.update(data)
        print(f"[{datetime.now().strftime('%H:%M:%S')}] Получены данные: {data}")

        return jsonify({
            'status': 'success',
            'received_at': datetime.now().isoformat(),
            'data': data
        }), 200

    except Exception as e:
        print(f"Ошибка при приёме данных: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 400

@app.route('/health', methods=['GET'])
def health_check():
    """Проверка работоспособности сервера"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()}), 200

if __name__ == '__main__':
    print("Запуск сервера мониторинга датчиков...")
    print("Сервер доступен по адресу: http://localhost:5000")
    print("API endpoints:")
    print("  GET  /          — веб‑интерфейс с данными")
    print("  GET  /api/data — API для получения текущих данных (JSON)")
    print("  POST /data     — приём данных от Arduino")
    print("  GET  /health  — проверка работоспособности")
    app.run(host='0.0.0.0', port=5000, debug=False)
