import { Space, Tag } from "antd";

const LogsFilters = () => {
  return (
    <Space wrap>
      <span style={{ color: "#00eaff" }}>Тип:</span>

      <Tag color="cyan">Все</Tag>
      <Tag>Тревога</Tag>
      <Tag>Действие</Tag>
      <Tag>Система</Tag>
      <Tag>ML-модель</Tag>

      <span style={{ marginLeft: 16, color: "#00eaff" }}>Уровень:</span>

      <Tag color="cyan">Все</Tag>
      <Tag>Critical</Tag>
      <Tag>Warning</Tag>
      <Tag>Info</Tag>
    </Space>
  );
};

export default LogsFilters;
