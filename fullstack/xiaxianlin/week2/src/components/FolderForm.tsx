import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Button, Form, FormProps, Input, message } from "antd";
import { Transaction } from "@mysten/sui/transactions";
import { useTaskModel } from "@/routes/task/model";
import { TASK_PACKAGE_ID } from "../constantas";

type FieldType = {
  name: string;
  description: string;
};

export default function FolderForm({ onCreate }: { onCreate?: (digest?: string) => void }) {
  const { profile } = useTaskModel();
  const { mutate, isPending } = useSignAndExecuteTransaction({
    onSuccess: () => {
      onCreate?.();
      message.success(`create success.`);
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${TASK_PACKAGE_ID}::week_two::create_folder`,
      arguments: [tx.pure.string(values.name!), tx.pure.string(values.description!), tx.object(profile?.id.id!)],
    });
    mutate({ transaction: tx });
  };

  return (
    <Form layout="vertical" onFinish={onFinish} autoComplete="off" disabled={isPending}>
      <Form.Item<FieldType> label="name" name="name" className="mt-4" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item<FieldType> label="description" name="description" rules={[{ required: true }]}>
        <Input.TextArea />
      </Form.Item>
      <Form.Item label={null} className="flex justify-center mb-1">
        <Button type="primary" htmlType="submit" loading={isPending}>
          Create
        </Button>
      </Form.Item>
    </Form>
  );
}
