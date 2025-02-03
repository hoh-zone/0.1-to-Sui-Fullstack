import { Balance } from "./Balance";
import { getFullnodeUrl } from "@mysten/sui/client";
import { Card, Flex } from "antd";
import { useAppModel } from "../../models/app_model";

export default function Account() {
  const { account, objects } = useAppModel();
  return (
    <Flex vertical gap={16} style={{ width: "80%", margin: "0 auto" }}>
      <Card size="small" title="Network">
        <p>Env: devnet</p>
        <p>Url: {getFullnodeUrl("devnet")}</p>
      </Card>
      <Card size="small" title="Wallet">
        <p>Status: connected</p>
        <p>Address: {account?.address}</p>
      </Card>
      <Balance />
      <Card size="small" title="Objects">
        {objects.length === 0 && (
          <p>No objects owned by the connected wallet</p>
        )}
        {objects.map((object) => (
          <Flex key={object.fields.id.id}>
            <p>Object ID: {object.fields.id.id}</p>
          </Flex>
        ))}
      </Card>
    </Flex>
  );
}
