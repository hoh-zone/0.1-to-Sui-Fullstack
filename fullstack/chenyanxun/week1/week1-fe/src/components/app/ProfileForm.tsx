import { networkConfig } from "@/networkConfig";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { Button, Flex, Form, Input, Typography } from "antd";
const { Title, Paragraph } = Typography;

function ProfileForm() {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const submit = (value: { name: string; description: string }) => {
    const tx = new Transaction();
    tx.moveCall({
      package: networkConfig.testnet.packageID,
      module: "week_one_alt",
      function: "create_profile",
      arguments: [
        tx.pure.string(value.name),
        tx.pure.string(value.description),
        tx.object(networkConfig.testnet.stateObjectID),
      ],
    });
    signAndExecute(
      {
        transaction: tx
      },
      {
        onSuccess: (res) => {
          console.log("===success", res)
        },
        onError: (err) => {
          console.log("==error", err)
        }
      }
    )
  };
  return (
    <Flex vertical justify="flex-start" align="center">
      <Title level={1}>Create Profile</Title>
      <Paragraph>Enter your details to create your on-chain profile</Paragraph>
      <Form
        style={{ width: "30%" }}
        size="large"
        layout="vertical"
        autoComplete="off"
        onFinish={submit}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Enter yout name" }]}
        >
          <Input placeholder="Enter yout name" />
        </Form.Item>

        <Form.Item
          label="Bio"
          name="description"
          rules={[{ required: true, message: "Tell us about yourself" }]}
        >
          <Input.TextArea
            autoSize={{ minRows: 4, maxRows: 4 }}
            placeholder="Tell us about yourself"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" block htmlType="submit">
            Create Profile
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
}

export default ProfileForm;
