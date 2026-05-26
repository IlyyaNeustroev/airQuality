// src/components/dashboard/EventsList.tsx
import { Card, List, Tag } from "antd";
import { fetchRealtimeData } from "../../api";

export default async function EventsList() {
  try {
    const data = await fetchRealtimeData();

    return (
      <Card
        title={<span style={{ color: "#00eaff" }}>Последние события</span>}
        style={{ background: "#081c2a" }}
      >
        <List
          dataSource={data.events || []}
          renderItem={(item) => (
            <List.Item>
              <div style={{ color: "white" }}>{item.text}</div>
              <Tag>{item.time}</Tag>
            </List.Item>
          )}
        />
      </Card>
    );
  } catch (error) {
    console.error("Ошибка загрузки событий:", error);
    return <Card>Загрузка...</Card>;
  }
}