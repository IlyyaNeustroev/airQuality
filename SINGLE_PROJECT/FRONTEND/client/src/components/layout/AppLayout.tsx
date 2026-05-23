import { Layout } from "antd";
import Sidebar from "./Sidebar";
import HeaderBar from "./HeaderBar";

const { Content } = Layout;

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Layout style={{ minHeight: "100vh", background: "#06141f" }}>
      <Sidebar />
      <Layout>
        <HeaderBar />
        <Content style={{ padding: 20 }}>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
