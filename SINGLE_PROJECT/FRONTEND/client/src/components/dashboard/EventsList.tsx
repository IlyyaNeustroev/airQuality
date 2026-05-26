// src/components/dashboard/EventsList.tsx
import { Card, List, Tag, Typography } from "antd";
import { useEffect, useState } from "react";
import { fetchRealtimeData } from "../../api";

// подстрой типы под реальный ответ API
interface Event {
  text: string;
  time: string;
  type?: "alert" | "action" | "system";
}

interface RealtimeResponse {
  events?: Event[];
}

export default function EventsList() {
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
        console.error("Ошибка загрузки событий:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <Card
        title={<span style={{ color: "#00eaff" }}>Последние события</span>}
        style={{ background: "#081c2a" }}
      >
        <Typography style={{ color: "#999" }}>Загрузка событий...</Typography>
      </Card>
    );
  }

  if (error) {
    return (
      <Card
        title={<span style={{ color: "#00eaff" }}>Последние события</span>}
        style={{ background: "#081c2a" }}
      >
        <Typography style={{ color: "#ff5555" }}>Ошибка: {error}</Typography>
      </Card>
    );
  }

  const events = data?.events || [];

  return (
    <Card
      title={<span style={{ color: "#00eaff" }}>Последние события</span>}
      style={{ background: "#081c2a" }}
    >
      {events.length === 0 ? (
        <Typography style={{ color: "#999" }}>Нет событий</Typography>
      ) : (
        <List
          dataSource={events}
          renderItem={(item) => (
            <List.Item>
              <div style={{ color: "white" }}>{item.text}</div>
              <Tag>{item.time}</Tag>
            </List.Item>
          )}
        />
      )}
    </Card>
  );
}