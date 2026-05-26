// src/components/dashboard/FloorsStatus.tsx
import { Card, Progress } from "antd";
import { fetchRealtimeData } from "../../api";

export default async function FloorsStatus() {
  try {
    const data = await fetchRealtimeData();

    return (
      <Card
        title={<span style={{ color: "#00eaff" }}>Статус этажей</span>}
        style={{ background: "#081c2a", color: "#fff" }}
      >
        {data.floors_status.map((f) => (
          <div key={f.name} style={{ marginBottom: 12 }}>
            <div>{f.name}</div>
            <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
              <Progress percent={f.value} showInfo={false} />
              <div>{f.value}</div>
            </div>
          </div>
        ))}
      </Card>
    );
  } catch (error) {
    console.error("Ошибка загрузки статуса этажей:", error);
    return <Card>Загрузка...</Card>;
  }
}