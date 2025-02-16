import { ConnectButton } from "@mysten/dapp-kit";
import { Flex, Layout, Menu, Spin } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAppModel } from "../models/app_model";

const items = [
  { key: "/", label: "Home" },
  { key: "/account", label: "Account" },
  { key: "/task1", label: "Task1" },
];

export default function Root() {
  const navigate = useNavigate();
  const location = useLocation();
  const { account, loading } = useAppModel();
  return (
    <Layout>
      <Layout.Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
          padding: "10px 16px",
        }}
      >
        <h1 style={{ paddingRight: 16 }}>HOH-SUI</h1>
        <Menu
          theme="dark"
          mode="horizontal"
          items={items}
          selectedKeys={[location.pathname]}
          style={{ flex: 1, minWidth: 0 }}
          onSelect={({ key }) => navigate(key)}
        />
        <ConnectButton />
      </Layout.Header>
      <Layout.Content style={{ padding: 24, height: "calc(100vh - 64px)" }}>
        {loading ? (
          <Flex align="center" justify="center">
            <Spin spinning />
          </Flex>
        ) : account ? (
          <Outlet />
        ) : (
          <Flex align="center" justify="center">
            Wallet not connected
          </Flex>
        )}
      </Layout.Content>
    </Layout>
  );
}
