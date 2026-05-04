from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
from datetime import datetime
import socket
import psycopg2
from psycopg2.extras import RealDictCursor

app = Flask(__name__)
CORS(app)

# Конфигурация PostgreSQL
DB_CONFIG = {
    'host': 'localhost',
    'database': 'AirQualityMLDB',
    'user': 'postgres',
    'password': '1187',
    'port': 5432
}

def get_db_connection():
    """Создание соединения с PostgreSQL"""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        return conn
    except Exception as e:
        print(f"Ошибка подключения к БД: {e}")
        return None
    
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
        .info-card { background-color: #f8f9fa; padding: 12px; border-radius: 8px; margin: 10px 0; }
    </style>
</head>
<body>
    <h1>📊 Умная вентиляция</h1>
    <div class="packet-counter">📦 Всего получено пакетов: <span class="value">{{ packet_count }}</span></div>
    <p class="timestamp">Последние данные получены: {{ timestamp }}</p>
    
    <div class="info-card">
        <h3>🏠 Информация о комнате</h3>
        <p><strong>Номер комнаты:</strong> {{ room_id }}</p>
        <p><strong>Дата:</strong> {{ date }}</p>
        <p><strong>Время:</strong> {{ time }}</p>
        <p><strong>Сезон:</strong> {{ season_name }} ({{ season }})</p>
        <p><strong>День недели:</strong> {{ weekday_name }} ({{ weekday }})</p>
    </div>

    <div class="sensor-card"><h3>🌡️ Температура</h3><p class="value">{{ temp }} °C</p></div>
    <div class="sensor-card"><h3>💧 Влажность</h3><p class="value">{{ hum }} %</p></div>
    <div class="sensor-card"><h3>💨 CO (MQ-7)</h3><p class="value">{{ mq7 }} ppm</p></div>
    <div class="sensor-card"><h3>🌫 CO2 (MQ-135)</h3><p class="value">{{ mq135 }}</p></div>
    <div class="sensor-card"><h3>☀️ KY-028 (аналог)</h3><p class="value">{{ ky028_analog }}</p></div>
    <div class="sensor-card"><h3>💡 KY-028 (цифра)</h3><p class="value">{{ ky028_digital }}</p></div>
    <div class="sensor-card"><h3>🌡️ БМР280 температура</h3><p class="value">{{ bmp_temp }} °C</p></div>
    <div class="sensor-card"><h3>🌀 БМР280 давление</h3><p class="value">{{ pressure }} hPa</p></div>
    <div class="sensor-card"><h3>🪂 БМР280 высота</h3><p class="value">{{ altitude }} м</p></div>
    <div class="sensor-card"><h3>🌡️ AHT21 температура</h3><p class="value">{{ aht21_temp }} °C</p></div>
    <div class="sensor-card"><h3>💦 AHT21 влажность</h3><p class="value">{{ aht21_hum }} %</p></div>
    <div class="sensor-card"><h3>ENS160 IAQ</h3><p class="value">{{ ens_iaq }}</p></div>
    <div class="sensor-card"><h3>TVOC (ENSS)</h3><p class="value">{{ ens_tvoc }} ppb</p></div>
    <div class="sensor-card"><h3>CO₂ (ENSS)</h3><p class="value">{{ ens_co2 }} ppm</p></div>
</body>
</html>
'''


last_data = {
    'mq7': 0, 'mq135': 0,
    'temp': 0.0, 'hum': 0.0,
    'ky028_analog': 0, 'ky028_digital': 0,
    'bmp_temp': 0.0, 'pressure': 0.0, 'altitude': 0.0,
    'aht21_temp': 0.0, 'aht21_hum': 0.0,
    'ens_iaq': 0, 'ens_tvoc': 0, 'ens_co2': 0,
    # Новые поля
    'room_id': 0,
    'date': '',
    'time': '',
    'season': 0,
    'weekday': 0
}

# Словари для отображения числовых значений в названия
SEASON_NAMES = {1: 'Зима', 2: 'Весна', 3: 'Лето', 4: 'Осень'}
WEEKDAY_NAMES = {1: 'Понедельник', 2: 'Вторник', 3: 'Среда', 4: 'Четверг', 
                 5: 'Пятница', 6: 'Суббота', 7: 'Воскресенье'}

packet_count = 0


@app.route('/')
def index():
    season_name = SEASON_NAMES.get(last_data['season'], 'Неизвестно')
    weekday_name = WEEKDAY_NAMES.get(last_data['weekday'], 'Неизвестно')
    
    return render_template_string(
        HTML_TEMPLATE,
        timestamp=datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        packet_count=packet_count,
        season_name=season_name,
        weekday_name=weekday_name,
        **last_data
    )


@app.route('/api/data', methods=['GET'])
def get_data():
    response_data = last_data.copy()
    response_data['timestamp'] = datetime.now().isoformat()
    response_data['packet_count'] = packet_count
    return jsonify(response_data)

def get_season_by_month(month):
    """
    Определяет сезон по номеру месяца:
    12, 1, 2: зима (1)
    3, 4, 5: весна (2)
    6, 7, 8: лето (3)
    9, 10, 11: осень (4)
    """
    if month in [12, 1, 2]:
        return 1  # зима
    elif month in [3, 4, 5]:
        return 2  # весна
    elif month in [6, 7, 8]:
        return 3  # лето
    else:
        return 4  # осень


@app.route('/data', methods=['POST'])
def receive_data():
    """Приём JSON‑данных от ESP32 с учетом всех датчиков"""
    global last_data, packet_count

    try:
        # Получаем JSON‑тело запроса
        content_type = request.headers.get('Content-Type', '')
        if 'application/json' not in content_type:
            return jsonify({'status': 'error', 'message': 'Expected Content-Type: application/json'}), 400

        # request.get_json() автоматически парсит JSON
        data = request.get_json(force=True)

        if data is None:
            return jsonify({'status': 'error', 'message': 'Empty or invalid JSON body'}), 400

        # Обновляем только те поля, что есть в JSON
        known_keys = set(last_data.keys())
        for k, v in data.items():
            if k in known_keys:
                last_data[k] = v

        # Вычисляем сезон и день недели по дате из данных
        if 'date' in data:
            try:
                # Парсим дату из формата YYYY-MM-DD
                date_str = data['date']
                date_obj = datetime.strptime(date_str, '%Y-%m-%d')

                month = date_obj.month

                # Определяем сезон (1–4)
                season = get_season_by_month(month)
                last_data['season'] = season

                # Определяем день недели (1–7, где 1 — понедельник, 7 — воскресенье)
                weekday = date_obj.isoweekday()  # isoweekday() возвращает 1–7 (понедельник–воскресенье)
                last_data['weekday'] = weekday

            except (ValueError, KeyError) as e:
                print(f"Ошибка парсинга даты {data.get('date')}: {e}")
                # Если не получилось распарсить дату, используем значения по умолчанию
                last_data['season'] = last_data.get('season', 0)
                last_data['weekday'] = last_data.get('weekday', 0)
        else:
            # Если дата не пришла, используем текущие значения или значения по умолчанию
            last_data['season'] = last_data.get('season', 0)
            last_data['weekday'] = last_data.get('weekday', 0)


        packet_count += 1

        #сохраняем данные в БД
        save_to_database(last_data)

        print(f"[{datetime.now().strftime('%H:%M:%S')}] "
              f"Пакет #{packet_count}: {data}")

        return jsonify({
            'status': 'success',
            'received_at': datetime.now().isoformat(),
            'packet_number': packet_count
        }), 200

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'status': 'error', 'message': str(e)}), 400

def save_to_database(data):
    """Сохраняет данные в таблицу PostgreSQL"""
    conn = get_db_connection()
    if not conn:
        print("Не удалось подключиться к БД для сохранения данных")
        return

    try:
        cursor = conn.cursor()

        # Определяем дату и время для записи в БД
        if 'date' in data and 'time' in data:
            record_date = data['date']
            record_time = data['time']
        else:
            now = datetime.now()
            record_date = now.strftime('%d.%m.%Y')
            record_time = now.strftime('%H:%M:%S')

        # Функция для безопасной конвертации значений
        def safe_convert(value, target_type, default=0):
            if value is None or str(value).lower() in ('null', 'none', ''):
                return default  
            try:
                if target_type == 'int':
                    return int(value) 
                elif target_type == 'float':
                    return float(value)
                return value
            except (ValueError, TypeError):
                return default

        # Подготавливаем данные для вставки с безопасной конвертацией
        insert_data = {
            'room_id': safe_convert(data.get('room_id'), 'int', -1), #если в БД -1 - то ошибка на стороне ESP01
            'date': record_date,
            'time': record_time,
            'season': safe_convert(data.get('season'), 'int', -1), #если в БД -1 - то ошибка на стороне ESP01 (не удалось определить время с ru.pool.ntp.org)
            'weekday': safe_convert(data.get('weekday'), 'int', -1), #если в БД -1 - то ошибка на стороне ESP01 --//--
            'temp': safe_convert(data.get('temp'), 'float', -1),
            'hum': safe_convert(data.get('hum'), 'float', -1),
            'mq7': safe_convert(data.get('mq7'), 'float', -1),
            'mq135': safe_convert(data.get('mq135'), 'float', -1),
            'ky028_analog': safe_convert(data.get('ky028_analog'), 'int', -1),
            'ky028_digital': safe_convert(data.get('ky028_digital'), 'int', -1),
            'bmp_temp': safe_convert(data.get('bmp_temp'), 'float', -1),
            'pressure': safe_convert(data.get('pressure'), 'float', -1),
            'altitude': safe_convert(data.get('altitude'), 'float', -1),
            'aht21_temp': safe_convert(data.get('aht21_temp'), 'float', -1),
            'aht21_hum': safe_convert(data.get('aht21_hum'), 'float', -1),
            'ens_iaq': safe_convert(data.get('ens_iaq'), 'int', -1),
            'ens_tvoc': safe_convert(data.get('ens_tvoc'), 'int', -1),
            'ens_co2': safe_convert(data.get('ens_co2'), 'int', -1),
            'packet_count': packet_count
        }

        query = """
        INSERT INTO sensor.data (
            room_id, date, time, season, weekday,
            temp, hum, mq7, mq135, ky028_analog, ky028_digital,
            bmp_temp, pressure, altitude, aht21_temp, aht21_hum,
            ens_iaq, ens_tvoc, ens_co2, packet_count
        ) VALUES (
            %(room_id)s, %(date)s, %(time)s, %(season)s, %(weekday)s,
            %(temp)s, %(hum)s, %(mq7)s, %(mq135)s, %(ky028_analog)s, %(ky028_digital)s,
            %(bmp_temp)s, %(pressure)s, %(altitude)s, %(aht21_temp)s, %(aht21_hum)s,
            %(ens_iaq)s, %(ens_tvoc)s, %(ens_co2)s, %(packet_count)s
        )
        """

        cursor.execute(query, insert_data)
        conn.commit()
        cursor.close()
        conn.close()

    except Exception as e:
        print(f"Ошибка при сохранении в БД: {e}")
        if conn:
            conn.rollback()
            conn.close()




@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)