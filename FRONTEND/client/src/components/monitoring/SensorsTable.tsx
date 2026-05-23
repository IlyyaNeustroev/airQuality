import { Table, Tag } from "antd";

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    render: (v: string) => <div style={{ color: "white" }}>{v}</div>,
  },
  {
    title: "Помещение",
    dataIndex: "room",
    render: (v: string) => <div style={{ color: "white" }}>{v}</div>,
  },
  {
    title: "CO2",
    dataIndex: "co2",
    render: (v: string) => <div style={{ color: "white" }}>{v}</div>,
  },
  {
    title: "Темп",
    dataIndex: "temp",
    render: (v: string) => <div style={{ color: "white" }}>{v}</div>,
  },
  {
    title: "Влажность",
    dataIndex: "hum",
    render: (v: string) => <div style={{ color: "white" }}>{v}</div>,
  },
  {
    title: "AQI",
    dataIndex: "aqi",
    render: (v: number) => (
      <Tag color={v > 80 ? "red" : v > 60 ? "orange" : "green"}>{v}</Tag>
    ),
  },
];

const data = [
  { id: "S-01", room: "Зал", co2: 412, temp: 22, hum: 54, aqi: 94 },
  { id: "S-02", room: "Гостиная", co2: 580, temp: 23, hum: 62, aqi: 78 },
];

const SensorsTable = () => {
  return <Table columns={columns} dataSource={data} rowKey="id" />;
};

export default SensorsTable;
