import sys
import os
import json  # ✅ Для JSON в БД!

# Настройка путей
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
ml_dir = os.path.join(project_root, 'ML')
sys.path.insert(0, ml_dir)

# Проверка ML файлов
print(f"Корень проекта: {project_root}")
print(f"ML папка: {ml_dir}")
print(f"Модель: {os.path.exists(os.path.join(ml_dir, 'air_quality_model.pkl'))}")
print(f"Scaler: {os.path.exists(os.path.join(ml_dir, 'scaler.pkl'))}")

try:
    from air_quality_ml import AirQualityPredictor
    predictor = AirQualityPredictor(
        model_path=os.path.join(ml_dir, 'air_quality_model.pkl'),
        scaler_path=os.path.join(ml_dir, 'scaler.pkl')
    )
    print("✅ ML модель загружена!")
except Exception as e:
    print(f"❌ Ошибка ML: {e}")
    predictor = None

from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
from datetime import datetime
import socket
import psycopg2
from psycopg2.extras import RealDictCursor

app = Flask(__name__)
CORS(app)

# Конфигурация БД
DB_CONFIG = {
    'host': 'localhost', 'database': 'AirQualityMLDB',
    'user': 'postgres', 'password': '1187', 'port': 5432
}

def get_db_connection():
    try:
        return psycopg2.connect(**DB_CONFIG)
    except Exception as e:
        print(f"Ошибка БД: {e}")
        return None

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except:
        return "Неизвестно"

# HTML шаблон (БЕЗ ИЗМЕНЕНИЙ)
HTML_TEMPLATE = '''
<!DOCTYPE html>
<html><head><title>Умная вентиляция</title><meta charset="utf-8">
<style>
body{font-family:Arial,sans-serif;margin:20px;background:#f5f5f5;}
.sensor-card{border:1px solid #ddd;padding:15px;margin:10px 0;border-radius:8px;background:white;box-shadow:0 2px 5px rgba(0,0,0,0.1);}
.value{font-size:1.5em;font-weight:bold;color:#333;}
.timestamp{color:#666;font-style:italic;}
h1{color:#2c3e50;text-align:center;}
.packet-counter{background:#e7f3ff;padding:15px;border-radius:10px;margin:20px 0;text-align:center;font-weight:bold;font-size:1.2em;border:2px solid #2196F3;}
.info-card{background:#e3f2fd;padding:15px;border-radius:10px;margin:20px 0;border-left:5px solid #2196F3;}
.iaq-card{background:linear-gradient(135deg, #4CAF50, #8BC34A);color:white;padding:20px;border-radius:15px;margin:20px 0;text-align:center;box-shadow:0 4px 15px rgba(76,175,80,0.3);}
.iaq-bad{background:linear-gradient(135deg, #FF9800, #F57C00);box-shadow:0 4px 15px rgba(255,152,0,0.3);}
.iaq-worst{background:linear-gradient(135deg, #F44336, #D32F2F);box-shadow:0 4px 15px rgba(244,67,54,0.3);}
</style>
</head><body>
<h1>📊 Умная вентиляция</h1>
<div class="packet-counter">📦 Пакетов: <span class="value">{{ packet_count }}</span> | Последние данные: {{ timestamp }}</div>

<div class="info-card">
<h3>🏠 Комната</h3>
<p>№: {{ room_id }} | {{ date }} {{ time }} | {{ season_name }}({{ season }}) | {{ weekday_name }}({{ weekday }})</p>
</div>

<!-- ✅ IAQ КАРТОЧКА -->
<div class="iaq-card {% if iaq_class == 0 %}iaq-good{% elif iaq_class >= 4 %}iaq-worst{% elif iaq_class >= 3 %}iaq-bad{% endif %}">
<h2>🌬️ IAQ: <span class="value">{{ iaq_class }}</span>/5</h2>
<p><strong>{{ recommendation }}</strong></p>
{% if iaq_proba %}
<p>Уверенность: {{ "{:.0%}".format((iaq_proba|max)|float) }}</p>
{% endif %}
</div>

<div class="sensor-card"><h4>🌡️ Темп:</h4><p class="value">{{ temp }}°C</p></div>
<div class="sensor-card"><h4>💧 Влаж:</h4><p class="value">{{ hum }}%</p></div>
<div class="sensor-card"><h4>💨 CO MQ7:</h4><p class="value">{{ mq7 }}</p></div>
<div class="sensor-card"><h4>🌫 MQ135:</h4><p class="value">{{ mq135 }}</p></div>
<div class="sensor-card"><h4>☀️ KY028 A:</h4><p class="value">{{ ky028_analog }}</p></div>
<div class="sensor-card"><h4>💡 KY028 D:</h4><p class="value">{{ ky028_digital }}</p></div>
<div class="sensor-card"><h4>🌡️ BMP T:</h4><p class="value">{{ bmp_temp }}°C</p></div>
<div class="sensor-card"><h4>🌀 Давл:</h4><p class="value">{{ pressure }}</p></div>
<div class="sensor-card"><h4>🪂 Выс:</h4><p class="value">{{ altitude }}</p></div>
<div class="sensor-card"><h4>🌡️ AHT21 T:</h4><p class="value">{{ aht21_temp }}°C</p></div>
<div class="sensor-card"><h4>💦 AHT21 H:</h4><p class="value">{{ aht21_hum }}%</p></div>
<div class="sensor-card"><h4>ENS IAQ:</h4><p class="value">{{ ens_iaq }}</p></div>
<div class="sensor-card"><h4>TVOC:</h4><p class="value">{{ ens_tvoc }}</p></div>
<div class="sensor-card"><h4>CO₂:</h4><p class="value">{{ ens_co2 }}</p></div>

<!-- График последних 24ч IAQ -->
<div style="margin:20px 0;padding:20px;background:white;border-radius:10px;">
<h3>📈 IAQ за 24ч</h3>
<canvas id="iaqChart" width="400" height="200"></canvas>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
const ctx = document.getElementById('iaqChart').getContext('2d');
new Chart(ctx, {
  type: 'line', data: {
    labels: {{ recent_iaq_labels|tojson }},
    datasets: [{label: 'IAQ класс', data: {{ recent_iaq_data|tojson }}, 
                borderColor: '#2196F3', backgroundColor: 'rgba(33,150,244,0.1)', fill: true,
                tension: 0.4}]
  }, options: {
    scales: {y: {min: 0, max: 5, ticks: {stepSize: 1}}},
    plugins: {title: {display: true, text: 'Последние измерения'}}
  }
});
</script>
</div>
</body></html>
'''

last_data = {
    'mq7': 0, 'mq135': 0, 'temp': 0.0, 'hum': 0.0, 'ky028_analog': 0, 'ky028_digital': 0,
    'bmp_temp': 0.0, 'pressure': 0.0, 'altitude': 0.0, 'aht21_temp': 0.0, 'aht21_hum': 0.0,
    'ens_iaq': 0, 'ens_tvoc': 0, 'ens_co2': 0, 'room_id': 0, 'date': '', 'time': '', 'season': 0, 'weekday': 0,
    'iaq_class': -1, 'recommendation': 'Нет данных'
}

SEASON_NAMES = {1: 'Зима', 2: 'Весна', 3: 'Лето', 4: 'Осень'}
WEEKDAY_NAMES = {1: 'Пн', 2: 'Вт', 3: 'Ср', 4: 'Чт', 5: 'Пт', 6: 'Сб', 7: 'Вс'}
packet_count = 0

@app.route('/')
def index():
    # Имена сезонов/дней
    season_name = SEASON_NAMES.get(last_data['season'], '?')
    weekday_name = WEEKDAY_NAMES.get(last_data['weekday'], '?')
    
    # Подготовка данных для шаблона (без конфликтов)
    page_data = dict(last_data)  # Копия
    page_data.update({
        'iaq_class': last_data.get('iaq_class', -1),
        'recommendation': last_data.get('recommendation', 'Нет данных'),
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'packet_count': packet_count,
        'season_name': season_name,
        'weekday_name': weekday_name
    })
    
    # График из БД
    recent_labels, recent_data = get_recent_iaq(10)
    page_data['recent_iaq_labels'] = recent_labels
    page_data['recent_iaq_data'] = recent_data
    
    return render_template_string(HTML_TEMPLATE, **page_data)

@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify({**last_data, 'timestamp': datetime.now().isoformat(), 'packet_count': packet_count})

def get_season_by_month(month):
    if month in [12,1,2]: return 1
    elif month in [3,4,5]: return 2
    elif month in [6,7,8]: return 3
    return 4

def get_recent_iaq(limit=10):
    """Последние 10 IAQ из БД"""
    conn = get_db_connection()
    if not conn: 
        return ['?']*limit, [1]*limit
    
    try:
        cursor = conn.cursor()
        cursor.execute(f"""
            SELECT iaq_class, created_at 
            FROM sensor.data 
            WHERE iaq_class IS NOT NULL 
            ORDER BY id DESC LIMIT {limit}
        """)
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        
        # Сортируем по времени (хронологически)
        rows.sort(key=lambda x: x[1])
        
        labels = [row[1].strftime('%H:%M') for row in rows]
        data = [row[0] if row[0] is not None else 0 for row in rows]
        
        return labels, data
    except Exception as e:
        print(f"Ошибка графика: {e}")
        return ['?']*limit, [1]*limit

@app.route('/data', methods=['POST'])
def receive_data():
    global last_data, packet_count
    try:
        data = request.get_json(force=True)
        if not data: return jsonify({'error': 'Invalid JSON'}), 400

        # Обновление данных
        for k, v in data.items():
            if k in last_data: last_data[k] = v

        # Season/Weekday
        if 'date' in data:
            try:
                date_obj = datetime.strptime(data['date'], '%Y-%m-%d')
                last_data['season'] = get_season_by_month(date_obj.month)
                last_data['weekday'] = date_obj.isoweekday()
            except: pass

        packet_count += 1

        # ML
        if predictor:
            iaq_result = predictor.predict(last_data)
            last_data['iaq_class'] = iaq_result['iaq_class']
            last_data['recommendation'] = iaq_result['recommendation']
            print(f"ML IAQ: {iaq_result['iaq_class']}")
        else:
            iaq_result = {'iaq_class': -1, 'recommendation': 'ML off'}

        save_to_database(last_data, iaq_result)

        print(f"[{datetime.now().strftime('%H:%M:%S')}] Пакет #{packet_count}")
        return jsonify({
            'status': 'success', 'packet_number': packet_count,
            'iaq_class': iaq_result['iaq_class'],
            'recommendation': iaq_result['recommendation']
        }), 200

    except Exception as e:
        import traceback; traceback.print_exc()
        return jsonify({'error': str(e)}), 400

def save_to_database(data, iaq_result):
    conn = get_db_connection()
    if not conn: return

    try:
        cursor = conn.cursor()
        now = datetime.now()
        record_date = data.get('date', now.strftime('%d.%m.%Y'))
        record_time = data.get('time', now.strftime('%H:%M:%S'))

        def safe_convert(value, typ, default=-1):
            if value is None or str(value).lower() in ('null', 'none', ''): return default
            try:
                return int(value) if typ == 'int' else float(value)
            except: return default

        insert_data = {
            'room_id': safe_convert(data.get('room_id'), 'int'),
            'date': record_date, 'time': record_time,
            'season': safe_convert(data.get('season'), 'int'),
            'weekday': safe_convert(data.get('weekday'), 'int'),
            'temp': safe_convert(data.get('temp'), 'float'),
            'hum': safe_convert(data.get('hum'), 'float'),
            'mq7': safe_convert(data.get('mq7'), 'float'),
            'mq135': safe_convert(data.get('mq135'), 'float'),
            'ky028_analog': safe_convert(data.get('ky028_analog'), 'int'),
            'ky028_digital': safe_convert(data.get('ky028_digital'), 'int'),
            'bmp_temp': safe_convert(data.get('bmp_temp'), 'float'),
            'pressure': safe_convert(data.get('pressure'), 'float'),
            'altitude': safe_convert(data.get('altitude'), 'float'),
            'aht21_temp': safe_convert(data.get('aht21_temp'), 'float'),
            'aht21_hum': safe_convert(data.get('aht21_hum'), 'float'),
            'ens_iaq': safe_convert(data.get('ens_iaq'), 'int'),
            'ens_tvoc': safe_convert(data.get('ens_tvoc'), 'int'),
            'ens_co2': safe_convert(data.get('ens_co2'), 'int'),
            'packet_count': packet_count,
            'iaq_class': iaq_result['iaq_class'],
            'iaq_proba': json.dumps(iaq_result['probabilities'])  # ✅ JSON!
        }

        query = """
        INSERT INTO sensor.data (
            room_id, date, time, season, weekday, temp, hum, mq7, mq135,
            ky028_analog, ky028_digital, bmp_temp, pressure, altitude,
            aht21_temp, aht21_hum, ens_iaq, ens_tvoc, ens_co2,
            packet_count, iaq_class, iaq_proba
        ) VALUES (
            %(room_id)s, %(date)s, %(time)s, %(season)s, %(weekday)s,
            %(temp)s, %(hum)s, %(mq7)s, %(mq135)s, %(ky028_analog)s, %(ky028_digital)s,
            %(bmp_temp)s, %(pressure)s, %(altitude)s, %(aht21_temp)s, %(aht21_hum)s,
            %(ens_iaq)s, %(ens_tvoc)s, %(ens_co2)s, %(packet_count)s,
            %(iaq_class)s, %(iaq_proba)s
        )
        """

        cursor.execute(query, insert_data)
        conn.commit()
        print(f"✅ Сохранено IAQ={iaq_result['iaq_class']}")

    except Exception as e:
        print(f"Ошибка БД: {e}")
        if conn: conn.rollback()
    finally:
        if 'cursor' in locals(): cursor.close()
        conn.close()

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)