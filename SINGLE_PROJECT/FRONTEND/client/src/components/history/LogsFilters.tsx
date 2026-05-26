// src/components/history/LogsFilters.tsx
import { Space, Tag } from "antd";
import { useState } from "react";

const LogsFilters = () => {
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [levelFilter, setLevelFilter] = useState<string | null>(null);

  // Эти значения можно пробрасывать в LogsTable и использовать в fetchLogs
  // Например: LogsTable принимает filter={typeFilter, levelFilter} и там вызывает fetchLogs(...)

  return (
    <Space wrap>
      <span style={{ color: "#00eaff" }}>Тип:</span>

      <Tag
        color={typeFilter === null ? "cyan" : "default"}
        onClick={() => setTypeFilter(null)}
      >
        Все
      </Tag>
      <Tag
        color={typeFilter === "alert" ? "red" : "default"}
        onClick={() => setTypeFilter("alert")}
      >
        Тревога
      </Tag>
      <Tag
        color={typeFilter === "action" ? "blue" : "default"}
        onClick={() => setTypeFilter("action")}
      >
        Действие
      </Tag>
      <Tag
        color={typeFilter === "system" ? "cyan" : "default"}
        onClick={() => setTypeFilter("system")}
      >
        Система
      </Tag>
      <Tag
        color={typeFilter === "ml" ? "purple" : "default"}
        onClick={() => setTypeFilter("ml")}
      >
        ML-модель
      </Tag>

      <span style={{ marginLeft: 16, color: "#00eaff" }}>Уровень:</span>

      <Tag
        color={levelFilter === null ? "cyan" : "default"}
        onClick={() => setLevelFilter(null)}
      >
        Все
      </Tag>
      <Tag
        color={levelFilter === "Critical" ? "red" : "default"}
        onClick={() => setLevelFilter("Critical")}
      >
        Critical
      </Tag>
      <Tag
        color={levelFilter === "Warning" ? "orange" : "default"}
        onClick={() => setLevelFilter("Warning")}
      >
        Warning
      </Tag>
      <Tag
        color={levelFilter === "Info" ? "green" : "default"}
        onClick={() => setLevelFilter("Info")}
      >
        Info
      </Tag>
    </Space>
  );
};

export default LogsFilters;