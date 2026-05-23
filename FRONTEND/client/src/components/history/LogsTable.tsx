import { Table, Tag } from "antd";

interface Log {
  id: string;
  time: string;
  type: string;
  sensor: string;
  room: string;
  message: string;
  value?: string;
}

const data: Log[] = [
  {
    id: "1",
    time: "14:23:11",
    type: "alert",
    sensor: "S-04",
    room: "Приёмная",
    message: "Влажность превысила порог",
    value: "68%",
  },
  {
    id: "2",
    time: "13:55:02",
    type: "alert",
    sensor: "S-06",
    room: "Конференц-зал",
    message: "CO2 превышен",
    value: "898 ppm",
  },
  {
    id: "3",
    time: "13:40:00",
    type: "action",
    sensor: "SYS",
    room: "Конференц-зал",
    message: "Включена вентиляция",
  },
];

const getTypeTag = (type: string) => {
  switch (type) {
    case "alert":
      return <Tag color="red">Тревога</Tag>;
    case "action":
      return <Tag color="blue">Действие</Tag>;
    case "system":
      return <Tag color="cyan">Система</Tag>;
    case "ml":
      return <Tag color="purple">ML</Tag>;
    default:
      return <Tag>{type}</Tag>;
  }
};

const columns = [
  {
    title: "Время",
    dataIndex: "time",
    render: (v: string) => <div style={{ color: "white" }}>{v}</div>,
  },
  {
    title: "Тип",
    dataIndex: "type",
    render: (v: string) => getTypeTag(v),
  },
  {
    title: "Датчик",
    dataIndex: "sensor",
    render: (v: string) => <div style={{ color: "white" }}>{v}</div>,
  },
  {
    title: "Помещение",
    dataIndex: "room",
    render: (v: string) => <div style={{ color: "white" }}>{v}</div>,
  },
  {
    title: "Событие",
    dataIndex: "message",
    render: (v: string) => <div style={{ color: "white" }}>{v}</div>,
  },
  {
    title: "Значение",
    dataIndex: "value",
    render: (v: string) =>
      v ? <span style={{ color: "#ffaa00" }}>{v}</span> : "—",
  },
];

const LogsTable = () => {
  return (
    <Table columns={columns} dataSource={data} rowKey="id" pagination={false} />
  );
};

export default LogsTable;
