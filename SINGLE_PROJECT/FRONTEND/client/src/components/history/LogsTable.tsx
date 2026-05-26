// src/components/history/LogsTable.tsx
import { Table, Tag } from "antd";
import { fetchLogs } from "../../api";
import { useEffect, useState } from "react";

interface Log {
  id: string;
  time: string;
  type: "alert" | "action" | "system" | "ml";
  sensor: string;
  room: string;
  message: string;
  value?: string;
}

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
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs({
      from: "2026-05-20",
      to: "2026-05-26",
      type: "all",
      level: "all",
      limit: 1000
    })
      .then(response => {
        setLogs(response.logs);
        setLoading(false);
      })
      .catch(error => {
        console.error("Ошибка загрузки логов:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Загрузка истории событий...</div>;

  return (
    <Table
      columns={columns}
      dataSource={logs}
      rowKey="id"
      pagination={{
        pageSize: 30,
        showSizeChanger: true,
        showQuickJumper: true,
      }}
    />
  );
};

export default LogsTable;