// src/components/dashboard/FloorsStatus.tsx
import { Card, Progress, Typography } from "antd";
import { useEffect, useState } from "react";
import { fetchRealtimeData } from "../../api";

// Типы для данных этажей (подстрой под твой API)
interface Floor {
  name: string;
  value: number; // например, загрузка/заполненность (1–5)
}

interface RealtimeResponse {
  floors_status?: Floor[];
}

// Функция для преобразования значения в процент
const valueToPercent = (value: number, min: number, max: number): number => {
  // Ограничиваем значение границами диапазона
  const clampedValue = Math.max(min, Math.min(max, value));
  return ((clampedValue - min) / (max - min)) * 100;
};

export default function FloorsStatus() {
  const [data, setData] = useState<RealtimeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchRealtimeData();
        setData(result);
        setError(null);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Неизвестная ошибка загрузки";
        setError(message);
        console.error("Ошибка загрузки статуса этажей:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <Card
        title={<span style={{ color: "#00eaff" }}>Статус помещений</span>}
        style={{ background: "#081c2a", color: "#fff" }}
      >
        <Typography style={{ color: "#999" }}>Загрузка статуса помещений...</Typography>
      </Card>
    );
  }

  if (error) {
    return (
      <Card
        title={<span style={{ color: "#00eaff" }}>Статус помещений</span>}
        style={{ background: "#081c2a", color: "#fff" }}
      >
        <Typography style={{ color: "#ff5555" }}>Ошибка: {error}</Typography>
      </Card>
    );
  }

  const floors = data?.floors_status || [];

  return (
    <Card
      title={<span style={{ color: "#00eaff" }}>Статус помещений</span>}
      style={{ background: "#081c2a", color: "#fff" }}
    >
      {floors.length === 0 ? (
        <Typography style={{ color: "#999" }}>Нет данных по помещениям</Typography>
      ) : (
        floors.map((f) => (
          <div key={f.name} style={{ marginBottom: 12 }}>
            <div>{f.name}</div>
            <div style={{ display: "flex", flexDirection: "row", gap: "10px", alignItems: "center" }}>
              <Progress
                percent={valueToPercent(f.value, 1, 5)}
                showInfo={false}
                strokeColor={
                  f.value <= 2 ? '#4fe631' :    // красный для низких значений (1–2)
                  f.value <= 4 ? '#e40602' :    // жёлтый для средних (3–4)
                  '#52c41a'                       // зелёный для высокого (5)
                }
              />
              <div style={{ color: "#fff", fontWeight: "bold", width: "30px" }}>
                {f.value}/5
              </div>
            </div>
          </div>
        ))
      )}
    </Card>
  );
}
