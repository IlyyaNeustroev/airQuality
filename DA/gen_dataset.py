import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import random

# 1. Константы и параметры
start_date = datetime(2026, 4, 27, 0, 0, 0)
end_date = datetime(2027, 4, 27, 23, 0, 0)  # примерно 1 год
delta = timedelta(minutes=30)              # 1 запись в 30 минут

NUM_ROOMS = 10                             # 10 помещений
df_rows = []

# 2. Помощник: функция индекса качества воздуха с модификацией
def compute_iaq(
    mq7_adc, mq135_adc,
    t_indoor, rh_indoor,
    ky028_hot, ky028_temp,
    tvoc, co2_est,        # eCO2 (ppm)
    t_outdoor, rh_outdoor,
    season,               # 1=зима, 2=весна, 3=лето, 4=осень
    weekday,              # 0=пон, 1=вт, ..., 6=вск
    hour,                 # 0–23
    room_id               # 1–NUM_ROOMS
):
    # --- нормализуем ADC MQ7 и MQ135 (примерные диапазоны)
    # MQ7 (CO) шумит в районе 100–160, 0 значит "чисто"
    co_norm = np.clip((mq7_adc - 100) / 60, 0, 1)

    # MQ135 (NH3 / частично CO2) 0–160, 0 значит "чисто"
    nh3_norm = np.clip(mq135_adc / 160, 0, 1)

    # eCO2 (ENS160) в ppm: 400–5000 ; 1000 считаем нормой
    co2_norm = np.clip((co2_est - 400) / (5000 - 400), 0, 1)

    # TVOC: 0–1000 ppb, 200 считаем нормой
    tvoc_norm = np.clip(tvoc / 1000, 0, 1)

    # температура и влажность в помещении
    t_norm = np.clip(abs(t_indoor - 22) / 10, 0, 1)  # 22 — комфорт
    rh_norm = np.clip((rh_indoor - 40) / 20, -1, 1)  # 40–60% комфорт
    comfort_norm = max(t_norm, abs(rh_norm))

    # outdoor эффект: давление/высота не сильно влияют, делаем слабый эффект
    pressure_norm = np.clip((1020 - 997) / (1020 - 950), 0, 1)

    # --- взвешиваем компоненты по сезону, дню, времени, помещению
    # веса базовые (без модуляций из 1)
    w_co = 0.25
    w_tvoc = 0.25
    w_co2 = 0.25
    w_comfort = 0.15
    w_outdoor = 0.1

    # сезон (3=лето: больше людей, но ниже влажность в ТЦ)
    if season == 3:  # лето
        w_co += 0.05  # больше газов от людей
        w_comfort -= 0.05  # людям жарче, но комфорт в приоритете

    # день недели: 6 (воскресенье) — больше людей в ТЦ
    if weekday == 6:
        w_co += 0.04
        w_co2 += 0.04

    # среда: 2, в некоторых помещениях завозят продукты → больше CO/CO2
    if weekday == 2 and room_id in {3, 5, 7}:
        w_co += 0.08
        w_co2 += 0.06

    # время дня: 12–14 — обед, макс посещаемость
    if 12 <= hour <= 14:
        w_co += 0.06
        w_co2 += 0.06

    # номер помещения: например, room 1 — сильно зависит от улицы
    if room_id == 1:
        w_outdoor += 0.08
    # room 5 — сильно зависит от температуры улицы
    if room_id == 5:
        t_outdoor_norm = np.clip((t_outdoor - 5) / 20, 0, 1)
        w_co += t_outdoor_norm * 0.1

    # --- нормализуем веса
    total_w = w_co + w_tvoc + w_co2 + w_comfort + w_outdoor
    w_co /= total_w
    w_tvoc /= total_w
    w_co2 /= total_w
    w_comfort /= total_w
    w_outdoor /= total_w

    # --- индекс как взвешенный максимум (семейство IAQI, где ограничивающий фактор доминирует)
    max_co = w_co * co_norm
    max_tvoc = w_tvoc * tvoc_norm
    max_co2 = w_co2 * co2_norm
    max_comfort = w_comfort * comfort_norm
    max_outdoor = w_outdoor * pressure_norm

    # характер IAQ индекса: чем выше, тем хуже (0–1)
    iaq_score = np.max([
        max_co,
        max_tvoc,
        max_co2,
        max_comfort,
        max_outdoor
    ])

    # --- 0–5 метка (класс качества воздуха)
    if iaq_score < 0.1:
        iaq_class = 0   # отлично
    elif iaq_score < 0.2:
        iaq_class = 1   # хорошо
    elif iaq_score < 0.4:
        iaq_class = 2   # удовлетворительно
    elif iaq_score < 0.6:
        iaq_class = 3   # плохо
    elif iaq_score < 0.8:
        iaq_class = 4   # очень плохо
    else:
        iaq_class = 5   # авария, срочно покинуть помещение

    # бонусный реликт-лейбл 0–2 (можно игнорировать, или использовать как альтернативу)
    if iaq_score < 0.3:
        iaq_label = 0   # хорошее
    elif iaq_score < 0.6:
        iaq_label = 1   # удовлетворительное
    else:
        iaq_label = 2   # плохое

    return int(round(iaq_score * 100)), int(iaq_label), int(iaq_class)


# 3. Генератор датасета
current = start_date
while current <= end_date:
    year, month, day = current.year, current.month, current.day
    weekday = current.weekday()       # 0=пон, 6=вск
    hour = current.hour
    minute = current.minute

    # сезон (зима=1, весна=2, лето=3, осень=4)
    # упрощённо: по месяцу
    m = month
    season = 1 if m in [12, 1, 2] else \
             2 if m in [3, 4, 5] else \
             3 if m in [6, 7, 8] else 4

    time_str = f"{hour:02}:{minute:02}:00"

    # для каждого помещения
    for room_id in range(1, NUM_ROOMS + 1):
        # --- базовые значения (с учётом сезона и дня недели)
        # температура в помещении
        base_t_indoor = 22 + np.random.normal(0, 2)
        if season == 1:  # зима
            base_t_indoor += 2  # тепло в ТЦ
        elif season == 3:  # лето
            base_t_indoor += 3  # людям жарче

        t_indoor = base_t_indoor + np.random.normal(0, 1)
        t_indoor = np.clip(t_indoor, 18, 30)

        # относительная влажность
        rh_indoor = 45 + np.random.normal(0, 10)
        rh_indoor = np.clip(rh_indoor, 30, 80)

        # MQ7 (CO) — чем больше людей, тем выше
        mq7_base = 100 + 20 * np.random.random()
        if season == 3 or weekday == 6 or 12 <= hour <= 14:
            mq7_base += 20 * np.random.random()
        if room_id in {3, 5, 7} and weekday == 2:
            mq7_base += 30 * np.random.random()
        mq7_adc = int(mq7_base + np.random.normal(0, 5))
        mq7_adc = max(100, int(mq7_adc))

        # MQ135 (NH3/CO2)
        mq135_base = 110 + 10 * np.random.random()
        if season == 3 or weekday == 6 or 12 <= hour <= 14:
            mq7_adc += 20 * np.random.random()
        if room_id in {3, 5, 7} and weekday == 2:
            mq7_base += 30 * np.random.random()
        mq135_adc = int(mq135_base + np.random.normal(0, 4))
        mq135_adc = max(100, int(mq135_adc))

        # KY‑028 (аналоговая температура + бинарный порог)
        ky028_temp = int(20 + 50 * np.random.random())  # 20–70
        ky028_hot = 1 if ky028_temp > 45 else 0

        # ENS160: TVOC, eCO2 (ppm)
        tvoc_base = 50 + 50 * np.random.random()
        co2_est = 400 + 1000 * np.random.random()

        if season == 3 or weekday == 6 or 12 <= hour <= 14:
            tvoc_base += 200 * np.random.random()
            co2_est += 500 * np.random.random()
        if room_id in {3, 5, 7} and weekday == 2:
            tvoc_base += 200 * np.random.random()
            co2_est += 400 * np.random.random()

        tvoc = int(tvoc_base)
        co2_est = int(co2_est)

        # AHT‑21: температура и влажность повторяем или слегка шумим
        t_aht = t_indoor + np.random.normal(0, 0.5)
        rh_aht = rh_indoor + np.random.normal(0, 2)
        t_aht = np.clip(t_aht, 18, 30)
        rh_aht = np.clip(rh_aht, 30, 80)

        # Уличные данные (BMP280)
        t_outdoor_base = 2 + 15 * np.sin(2 * np.pi * (month - 1) / 12)  # сезонный эффект
        t_outdoor = t_outdoor_base + np.random.normal(0, 3)
        pressure = 997 + np.random.normal(0, 5)
        altitude = 81.6 + np.random.normal(0, 1)

        t_outdoor = np.clip(t_outdoor, -20, 35)
        pressure = np.clip(pressure, 950, 1020)

        # --- индекс качества воздуха по формуле (теперь с iaq_class)
        iaq_score, iaq_label, iaq_class = compute_iaq(
            mq7_adc=mq7_adc,
            mq135_adc=mq135_adc,
            t_indoor=t_indoor,
            rh_indoor=rh_indoor,
            ky028_hot=ky028_hot,
            ky028_temp=ky028_temp,
            tvoc=tvoc,
            co2_est=co2_est,
            t_outdoor=t_outdoor,
            rh_outdoor=50,  # можно уточнить, если есть
            season=season,
            weekday=weekday,
            hour=hour,
            room_id=room_id
        )

        # строка в формате, как в вашем CSV, с добавленной целевой iaq_class
        row = [
            f"{day:02}.{month:02}.{year}",
            weekday + 1,                    # 1–7, пон‑вск
            season,
            time_str,
            room_id,
            mq7_adc,
            mq135_adc,
            round(t_indoor, 1),
            round(rh_indoor, 1),
            ky028_temp,
            ky028_hot,
            iaq_score,          # IAQ индекс 0–100
            tvoc,
            co2_est,            # ppm (eCO2)
            round(t_aht, 1),
            round(rh_aht, 1),
            round(t_outdoor, 1),
            round(pressure, 1),
            round(altitude, 1),
            iaq_class           # целевая переменная 0–5
        ]

        df_rows.append(row)

    current += delta

# 4. Сохраняем CSV
columns = [
    "date", "weekday", "season", "time", "room_id",
    "mq7_adc", "mq135_adc", "t_indoor", "rh_indoor",
    "ky028_temp", "ky028_hot",
    "iaq_index", "tvoc", "co2_ppm",
    "t_aht", "rh_aht",
    "t_outdoor", "pressure", "altitude",
    "iaq_class"              # целевая переменная для ML (0–5 класса)
]
df = pd.DataFrame(df_rows, columns=columns)

df.to_csv("air_quality_tmall_dataset.csv", index=False, float_format="%.1f")

print("Dataset generated and saved to air_quality_tmall_dataset.csv")