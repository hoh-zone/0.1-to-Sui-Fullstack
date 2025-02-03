import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClientQuery,
} from "@mysten/dapp-kit";
import {
  Button,
  Card,
  Form,
  FormProps,
  Input,
  message,
  Spin,
  Typography,
} from "antd";
import { networkConfig } from "../../networkConfig";
import { useMemo } from "react";
import { Transaction } from "@mysten/sui/transactions";
import { useAppModel } from "../../models/app_model";

type FieldType = {
  name?: string;
  description?: string;
};

function CreateProfile({ onCreate }: { onCreate?: (digest?: string) => void }) {
  const { mutate } = useSignAndExecuteTransaction();
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    const { task1PackageId, task1StateId } = networkConfig.devnet;
    const tx = new Transaction();
    tx.moveCall({
      target: `${task1PackageId}::week_one::create_profile`,
      arguments: [
        tx.pure.string(values.name!),
        tx.pure.string(values.description!),
        tx.object(task1StateId),
      ],
    });
    mutate(
      { transaction: tx },
      {
        onSuccess: (result) => {
          console.log("executed transaction", result.digest);
          onCreate?.(result.digest);
        },
        onError: (error) => {
          message.error(error.message);
          console.log(error.message);
        },
      },
    );
  };
  return (
    <Form size="large" layout="vertical" onFinish={onFinish} autoComplete="off">
      <Form.Item<FieldType>
        label="Name"
        name="name"
        rules={[{ required: true, message: "Please input name!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="Description"
        name="description"
        rules={[{ required: true, message: "Please input description!" }]}
      >
        <Input.TextArea />
      </Form.Item>

      <Form.Item label={null}>
        <Button type="primary" htmlType="submit">
          Create
        </Button>
      </Form.Item>
    </Form>
  );
}

function ProfileInfo() {
  const { objects } = useAppModel();
  const profile = objects.find(
    (i) =>
      i.type === `${networkConfig.devnet.task1PackageId}::week_one::Profile`,
  );
  return (
    <>
      <Typography.Paragraph>name: {profile?.fields.name}</Typography.Paragraph>
      <Typography.Paragraph>
        description: {profile?.fields.description}
      </Typography.Paragraph>
    </>
  );
}

export default function Task1() {
  const account = useCurrentAccount();
  const { data, isPending, refetch } = useSuiClientQuery("getObject", {
    id: networkConfig.testnet.task1StateId,
    options: {
      showContent: true,
    },
  });

  const isCreated = useMemo(() => {
    const content = data?.data?.content as any;
    const users = content?.fields?.users || [];
    return users.includes(account?.address);
  }, [data, account]);

  return (
    <Card title="Profle" style={{ width: "50%", margin: "0 auto" }}>
      {isPending ? (
        <Spin spinning />
      ) : (
        <>
          {isCreated ? (
            <ProfileInfo />
          ) : (
            <CreateProfile onCreate={() => refetch()} />
          )}
        </>
      )}
    </Card>
  );
}
