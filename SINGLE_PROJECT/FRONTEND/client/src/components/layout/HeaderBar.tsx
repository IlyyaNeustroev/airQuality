import { Layout, Tag } from "antd";

const { Header } = Layout;

const HeaderBar = () => {
  return (
    <Header
      style={{
        background: "#06141f",
        display: "flex",
        justifyContent: "space-between",
        color: "#00eaff",
      }}
    >
      <div>AEROCONTROL v2.4.1</div>
      <div>
        <Tag color="green">ВСЕ СИСТЕМЫ В НОРМЕ</Tag>
      </div>
    </Header>
  );
};

export default HeaderBar;
