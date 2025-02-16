import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Button, Form, FormProps, Input, message, Select } from "antd";
import { Transaction } from "@mysten/sui/transactions";
import { useTaskModel } from "@/routes/task/model";
import { TASK_PACKAGE_ID } from "../constantas";
import { parseCoinId } from "../utils/parse";

type FieldType = {
  coinId: string;
  amount: number;
};

export default function CoinForm({ onCreate }: { onCreate?: (digest?: string) => void }) {
  const [form] = Form.useForm();
  const { folder, coins = [] } = useTaskModel();
  const { mutate, isPending } = useSignAndExecuteTransaction({
    onSuccess: () => {
      onCreate?.();
      message.success(`add success.`);
      form.resetFields();
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const onFinish: FormProps<FieldType>["onFinish"] = ({ coinId, amount }) => {
    const tx = new Transaction();
    const coin = coins.find((c) => c.id.id === coinId);
    const [depositCoin] = tx.splitCoins(tx.object(coinId), [tx.pure.u64(amount)]);
    tx.moveCall({
      target: `${TASK_PACKAGE_ID}::week_two::add_coin_to_folder`,
      arguments: [tx.object(folder?.id.id!), tx.object(depositCoin)],
      typeArguments: [parseCoinId(coin?.type!)],
    });
    mutate({ transaction: tx });
  };

  return (
    <Form
      form={form}
      className="mt-4"
      onFinish={onFinish}
      autoComplete="off"
      disabled={isPending}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 20 }}
      labelAlign="left"
    >
      <Form.Item label="Folder">{folder?.name}</Form.Item>
      <Form.Item<FieldType> label="Coin" name="coinId" className="mt-4" rules={[{ required: true }]}>
        <Select>
          {coins.map((coin) => (
            <Select.Option key={coin.id.id} vlaue={coin.id.id}>
              {coin.metadata.name}({Number(coin.balance).toLocaleString()})
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item<FieldType> label="Amount" name="amount" className="mt-4" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label={null} className="flex justify-center mb-1">
        <Button type="primary" htmlType="submit" loading={isPending}>
          Add
        </Button>
      </Form.Item>
    </Form>
  );
}
