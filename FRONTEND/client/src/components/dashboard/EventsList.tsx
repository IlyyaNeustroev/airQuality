import { Card, List, Tag } from "antd";

const data = [
  { time: "14:23", text: "Высокая влажность", type: "warning" },
  { time: "13:55", text: "VOC превышен", type: "error" },
  { time: "12:10", text: "Датчик восстановлен", type: "success" },
];

const EventsList = () => {
  return (
    <Card
      title={<span style={{ color: "#00eaff" }}>Последние события</span>}
      style={{ background: "#081c2a" }}
    >
      <List
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <div style={{ color: "white" }}> {item.text} </div>
            <Tag>{item.time}</Tag>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default EventsList;
