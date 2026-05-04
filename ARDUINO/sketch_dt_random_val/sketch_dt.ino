#include <WiFi.h>
#include "ArduinoJson.h"


// === Настройки сети ===
const char* WIFI_SSID     = "ArduinoWiFi";   
const char* WIFI_PASS     = "12345678";
const char* SERVER_IP     = "192.168.0.27";   // локальный web‑сервер
const uint16_t SERVER_PORT = 5000;
const char* SERVER_PATH   = "/data";

// === room_id (зашивается в ESP32)
const char* ROOM_ID       = "1";   //ID комнаты


WiFiClient client;


// === PRNG seed ===
unsigned long seed;

void setup_random() {
  seed = millis() + analogRead(0);
  randomSeed(seed);
}


// === Функция получения форматированного времени ===
String get_utc_time() {
  time_t now;
  struct tm timeinfo;

  if (!getLocalTime(&timeinfo)) {
    return "0000-00-00 00:00:00";
  }

  char timeStr[20];
  strftime(timeStr, sizeof(timeStr), "%Y-%m-%d %H:%M:%S", &timeinfo);
  return String(timeStr);
}


// === Функция, которая генерит правдоподобные данные как в датасете) ===
void fake_sensors() {
  // Генерация "реалистичных" значений
  int mq7Value       = random(10, 500);      // 10...500
  int mq135Value     = random(10, 500);      // 10...500
  float temperature  = random(100, 500) / 10.0;  // 10.0...50.0
  float humidity     = random(100, 500) / 10.0;  // 10.0...50.0
  int ky028Analog    = random(10, 500);      // 10...500
  int ky028Digital   = random(0, 2);         // 0 или 1

  // BMP280 — имитация (как если бы датчик был жив)
  float bmpTemp = temperature + random(-30, 30) / 10.0;   // климатически реалистичный диапазон
  float pressure = random(99000, 103000) / 100.0;         // 990...1030 hPa
  float altitude = random(-100, 1000) / 10.0;              // -10...100 м

  // ENS160+AHT21 — симуляция (близкие к другим датчикам)
  float aht21_temp = temperature + random(-20, 20) / 10.0;
  float aht21_hum  = humidity + random(-20, 20) / 10.0;
  int ens_iaq      = random(20, 70);
  int ens_tvoc     = random(40, 150);
  int ens_co2      = random(400, 1200);

  // Время и дата
  String timestamp = get_utc_time();        // "2025-05-03 15:30:45"
  String dateOnly = timestamp.substring(0, 10);   // "2025-05-03"
  String timeOnly = timestamp.substring(11, 19);  // "15:30:45"

  // Формируем JSON‑пакет
  const size_t capacity = JSON_OBJECT_SIZE(18);  // 18 полей (датчики + дата/время)
  DynamicJsonDocument doc(capacity);

  // Реальные показания (сгенерированные)
  doc["mq7"]            = mq7Value;
  doc["mq135"]          = mq135Value;
  doc["temp"]           = temperature;
  doc["hum"]            = humidity;
  doc["ky028_analog"]   = ky028Analog;
  doc["ky028_digital"]  = ky028Digital;
  doc["bmp_temp"]       = bmpTemp;
  doc["pressure"]       = pressure;
  doc["altitude"]       = altitude;
  doc["aht21_temp"]     = aht21_temp;
  doc["aht21_hum"]      = aht21_hum;
  doc["ens_iaq"]        = ens_iaq;
  doc["ens_tvoc"]       = ens_tvoc;
  doc["ens_co2"]        = ens_co2;

  // Дополнительные поля
  doc["date"]           = dateOnly;          // "YYYY-MM-DD"
  doc["time"]           = timeOnly;          // "HH:MM:SS"
  doc["room_id"]        = ROOM_ID;           // зашитый room_id
  doc["weekday"]        = "none";                 // заглушка, будет вычисляться Flask
  doc["season"]         = "none";            // заглушка, будет вычисляться Flask

  // Сериализуем JSON
  String jsonStr;
  serializeJson(doc, jsonStr);

  // === Отправка JSON на сервер ===
  if (!client.connect(SERVER_IP, SERVER_PORT)) {
    Serial.println("❌ Не удалось подключиться к серверу");
    return;
  }

  // HTTP POST JSON
  String httpReq = "POST " + String(SERVER_PATH) + " HTTP/1.1\r\n" +
                   "Host: " + String(SERVER_IP) + "\r\n" +
                   "Content-Type: application/json\r\n" +
                   "Content-Length: " + String(jsonStr.length()) + "\r\n" +
                   "Connection: close\r\n\r\n" +
                   jsonStr;

  client.print(httpReq);

  unsigned long startTime = millis();
  while (client.connected() && millis() - startTime < 5000) {
    while (client.available()) {
      char c = client.read();
      Serial.print(c);
    }
  }

  client.stop();
  Serial.println("✅ Отправлено\n");
}


// === Чтение реальных датчиков ===
/*

#include <Wire.h>
#include "DHT.h"
#include <Adafruit_BMP280.h>

// Пины датчиков
#define MQ7_PIN      35   // MQ‑7 AOUT → D35
#define MQ135_PIN    34   // MQ‑135 AOUT → D34
#define KY028_AN_PIN 32   // KY‑028 AOUT → D32
#define KY028_D_PIN  27   // KY‑028 DOUT → D27
#define DHT_PIN      33   // DHT‑11 DATA → D33
#define BMP_SDA_PIN  12   // BMP‑280 SDA  → D12
#define BMP_SCL_PIN  13   // BMP‑280 SCL  → D13

DHT dht(DHT_PIN, DHT11);
Adafruit_BMP280 bmp(&Wire);  // сделаем Wire с указанием пинов ниже

WiFiClient client;

// === Симуляция ENS160+AHT21 (нет физического датчика) ===
float aht21_temp = 0.0;
float aht21_hum   = 0.0;
int   ens_iaq     = 0;
int   ens_tvoc    = 0;
int   ens_co2     = 0;

void simulate_ens_aht() {
  float t = random(180, 300) / 10.0;      // 18.0...30.0
  float h = random(300, 750) / 10.0;      // 30.0...75.0
  int iaq = constrain(random(20, 70), 20, 100);
  int tvoc = constrain(random(40, 150), 0, 5000);
  int co2 = constrain(random(400, 1200), 400, 5000);

  aht21_temp = t;
  aht21_hum  = h;
  ens_iaq    = iaq;
  ens_tvoc   = tvoc;
  ens_co2    = co2;
}

// === Чтение датчиков и отправка JSON ===
void read_sensors() {

  // MQ‑7 и MQ‑135
  int mq7Value   = analogRead(MQ7_PIN);
  int mq135Value = analogRead(MQ135_PIN);

  // KY‑028
  int ky028Analog  = analogRead(KY028_AN_PIN);
  int ky028Digital = digitalRead(KY028_D_PIN);

  // DHT‑11
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();

  // BMP‑280 (настроим Wire с нужными пинами)
  Wire.begin(BMP_SDA_PIN, BMP_SCL_PIN);        // D12, D13
  if (!bmp.begin()) {
    Serial.println("❌ BMP280 не найден!");
    // можно выставить fake‑значения, если BMP280 не подключён
  } else {
    Serial.println("✅ BMP280 подключён");
  }

  float bmpTemp = bmp.readTemperature();
  float pressure = bmp.readPressure() / 100.0;   // hPa
  float altitude = bmp.readAltitude(1013.25);

  // ENS160 + AHT21 — симуляция
  simulate_ens_aht();

  // Формируем JSON‑пакет
  // (аналогично, с учётом всех полей, включая date/time/room_id и т.п.)

  // ... код отправки на SERVER_PATH...

}
*/


// === Setup ===
void setup() {
  Serial.begin(115200);

  // Wi‑Fi
  Serial.print("🚀 Подключение к Wi‑Fi: ");
  Serial.println(WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("✅ IP адрес ESP32: ");
  Serial.println(WiFi.localIP());

  // Настройка NTP‑времени
  configTime(0, 0, "ru.pool.ntp.org");   // можно поменять на свой NTP‑сервер

  struct tm timeinfo;
  while (!getLocalTime(&timeinfo)) {
    Serial.print(".");
    delay(500);
  }
  Serial.println(" | Текущее время: " + get_utc_time());

  // Настройка генератора случайных чисел
  setup_random();

  Serial.println("✅ Режим генерации данных активирован");
}


// === Loop ===
void loop() {
  delay(300000);   // каждые 5 минут
  Serial.println("📤 Генерация данных...");
  fake_sensors();
  // Раскомментировать, когда датчики заработают:
  // read_sensors();
}
