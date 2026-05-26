// src/components/dashboard/FloorsStatus.tsx
import { Card, Progress, Typography } from "antd";
import { useEffect, useState } from "react";
import { fetchRealtimeData } from "../../api";

// типы для данных этажей (подстрой под твой API)
interface Floor {
  name: string;
  value: number; // например, загрузка/заполненность
}

interface RealtimeResponse {
  floors_status?: Floor[];
}

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
        title={<span style={{ color: "#00eaff" }}>Статус этажей</span>}
        style={{ background: "#081c2a", color: "#fff" }}
      >
        <Typography style={{ color: "#999" }}>Загрузка статуса этажей...</Typography>
      </Card>
    );
  }

  if (error) {
    return (
      <Card
        title={<span style={{ color: "#00eaff" }}>Статус этажей</span>}
        style={{ background: "#081c2a", color: "#fff" }}
      >
        <Typography style={{ color: "#ff5555" }}>Ошибка: {error}</Typography>
      </Card>
    );
  }

  const floors = data?.floors_status || [];

  return (
    <Card
      title={<span style={{ color: "#00eaff" }}>Статус этажей</span>}
      style={{ background: "#081c2a", color: "#fff" }}
    >
      {floors.length === 0 ? (
        <Typography style={{ color: "#999" }}>Нет данных по этажам</Typography>
      ) : (
        floors.map((f) => (
          <div key={f.name} style={{ marginBottom: 12 }}>
            <div>{f.name}</div>
            <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
              <Progress percent={f.value} showInfo={false} />
              <div>{f.value}</div>
            </div>
          </div>
        ))
      )}
    </Card>
  );
}