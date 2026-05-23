import { Card, Progress } from "antd";

const floors = [
  { name: "Этаж 4", value: 92 },
  { name: "Этаж 3", value: 78 },
  { name: "Этаж 2", value: 86 },
  { name: "Этаж 1", value: 95 },
  { name: "Цоколь", value: 65 },
];

const FloorsStatus = () => {
  return (
    <Card
      title={<span style={{ color: "#00eaff" }}>Статус этажей</span>}
      style={{ background: "#081c2a", color: "#fff" }}
    >
      {floors.map((f) => (
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
};

export default FloorsStatus;
