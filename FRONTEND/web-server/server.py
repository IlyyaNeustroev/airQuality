from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
from datetime import datetime
import socket

app = Flask(__name__)
CORS(app)

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "Не удалось определить"

HTML_TEMPLATE = '''
<!DOCTYPE html>
<html>
<head>
    <title>Умная вентиляция</title>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .sensor-card { border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px; }
        .value { font-size: 1.5em; font-weight: bold; color: #333; }
        .timestamp { color: #666; font-style: italic; }
        h1 { color: #2c3e50; }
        .packet-counter { background-color: #e7f3ff; padding: 12px; border-radius: 8px; margin-bottom: 20px; text-align: center; font-weight: bold; color: #155724; border: 1px solid #b8daff; }
    </style>
</head>
<body>
    <h1>📊 Умная вентиляция</h1>
    <div class="packet-counter">📦 Всего получено пакетов: <span class="value">{{ packet_count }}</span></div>
    <p class="timestamp">Последние данные получены: {{ timestamp }}</p>
    <div class="sensor-card"><h3>🌡️ Температура</h3><p class="value">{{ temp }} °C</p></div>
    <div class="sensor-card"><h3>💧 Влажность</h3><p class="value">{{ hum }} %</p></div>
    <div class="sensor-card"><h3>💨 CO (MQ-7)</h3><p class="value">{{ mq7 }} ppm</p></div>
    <div class="sensor-card"><h3>🌫 Качество воздуха (MQ-135)</h3><p class="value">{{ mq135 }}</p></div>
    <div class="sensor-card"><h3>☀️ KY-028 (аналог)</h3><p class="value">{{ ky028_analog }}</p></div>
    <div class="sensor-card"><h3>💡 KY-028 (цифра)</h3><p class="value">{{ ky028_digital }}</p></div>
</body>
</html>
'''

last_data = {'mq7': 0, 'mq135': 0, 'temp': 0.0, 'hum': 0.0, 'ky028_analog': 0, 'ky028_digital': 0}
packet_count = 0

@app.route('/')
def index():
    return render_template_string(
        HTML_TEMPLATE,
        timestamp=datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        packet_count=packet_count,
        **last_data
    )

@app.route('/api/data', methods=['GET'])
def get_data():
    response_data = last_data.copy()
    response_data['timestamp'] = datetime.now().isoformat()
    response_data['packet_count'] = packet_count
    return jsonify(response_data)

@app.route('/data', methods=['POST'])
def receive_data():
    """Приём данных от Arduino в формате CSV: mq7,mq135,temp,hum,ky028_analog,ky028_digital"""
    global last_data, packet_count

    try:
        # Получаем данные как текстовую строку
        content = request.data.decode('utf-8').strip()
        vals = content.split(',')

        if len(vals) != 6:
            return jsonify({'status': 'error', 'message': 'Expected 6 comma-separated values'}), 400

        packet_count += 1
        
        # Обновляем last_data
        last_data = {
            'mq7': vals[0], 'mq135': vals[1], 'temp': vals[2],
            'hum': vals[3], 'ky028_analog': vals[4], 'ky028_digital': vals[5]
        }
        
        print(f"[{datetime.now().strftime('%H:%M:%S')}] Получены данные (пакет #{packet_count}): {content}")

        return jsonify({
            'status': 'success',
            'received_at': datetime.now().isoformat(),
            'packet_number': packet_count
        }), 200

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)