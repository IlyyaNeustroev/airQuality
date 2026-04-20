#include <DHT.h>

// Пины подключения
#define MQ7_PIN A0
#define MQ135_PIN A1
#define KY028_ANALOG A2
#define KY028_DIGITAL 3
#define DHT_PIN 2

// Тип датчика DHT
#define DHT_TYPE DHT11

// Интервал отправки данных (5 минут = 300 000 мс)
const unsigned long SEND_INTERVAL = 10000;
unsigned long lastSendTime = 0;

DHT dht(DHT_PIN, DHT_TYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();
  pinMode(KY028_DIGITAL, INPUT);
  lastSendTime = millis();
  Serial.println("Система мониторинга запущена. Отправка данных каждые 5 минут.");
}

void loop() {
  unsigned long currentTime = millis();

  if (currentTime - lastSendTime >= SEND_INTERVAL) {
    lastSendTime = currentTime;
    readAndSendData();
  }
  delay(1000); // Задержка 1 с между проверками
}

void readAndSendData() {
  // Чтение данных с MQ‑7
  int mq7Value = analogRead(MQ7_PIN);

  // Чтение данных с MQ‑135
  int mq135Value = analogRead(MQ135_PIN);

  // Чтение данных с DHT11 (KY‑015)
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();

  // Чтение данных с KY‑028
  int ky028Analog = analogRead(KY028_ANALOG);
  int ky028Digital = digitalRead(KY028_DIGITAL);

  // Вывод данных в порт
  Serial.println("=== ДАННЫЕ С ДАТЧИКОВ (обновлены) ===");
  Serial.print("MQ-7 (CO): ");
  Serial.println(mq7Value);
  Serial.print("MQ-135 (воздух): ");
  Serial.println(mq135Value);
  Serial.print("Температура (DHT11): ");
  Serial.print(temperature);
  Serial.println(" °C");
  Serial.print("Влажность (DHT11): ");
  Serial.print(humidity);
  Serial.println(" %");
  Serial.print("KY-028 (аналог): ");
  Serial.println(ky028Analog);
  Serial.print("KY-028 (цифра): ");
  Serial.println(ky028Digital);
  Serial.println("=======================================");
}
