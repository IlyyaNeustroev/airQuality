import { Card, Space, Button } from "antd";

const GlobalControls = () => {
  return (
    <Card size="small" className="custom-card">
      <Space>
        <Button type="default">Авто все</Button>
        <Button type="primary">Вкл все</Button>
        <Button danger>Выкл все</Button>
      </Space>
    </Card>
  );
};

export default GlobalControls;
