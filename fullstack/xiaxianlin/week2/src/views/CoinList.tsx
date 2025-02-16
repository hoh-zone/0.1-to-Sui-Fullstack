import { Button, Card, Modal, Table } from "antd";
import CoinForm from "../components/CoinForm";
import { PlusOutlined } from "@ant-design/icons";
import { useTaskModel } from "../model";
import { useBoolean, useRequest } from "ahooks";
import { queryFolderCoins } from "../utils";
import { useConfigModel } from "@/models/config-model";

export function CoinList() {
  const { client } = useConfigModel();
  const { folder, coinMetadataMap } = useTaskModel();
  const [visible, { setTrue, setFalse }] = useBoolean(false);

  const { data, loading, refresh } = useRequest(
    async () => {
      const infos = await queryFolderCoins(client, folder!);
      return infos.map((info) => ({ ...info, metadata: coinMetadataMap?.[`0x2::coin::Coin<${info.coinId}>`] }));
    },
    {
      ready: !!folder,
      refreshDeps: [folder?.id.id],
    },
  );

  return (
    <>
      <Card
        title="Coin List"
        className="h-full"
        extra={
          folder ? (
            <Button size="small" icon={<PlusOutlined />} type="primary" onClick={setTrue}>
              add
            </Button>
          ) : undefined
        }
      >
        <Table
          loading={loading}
          rowKey="coinId"
          bordered
          size="small"
          dataSource={data}
          pagination={false}
          columns={[
            { title: "Name", key: "name", render: (row) => row.metadata.name || "-" },
            { title: "Symbol", key: "symbol", render: (row) => row.metadata.symbol || "-" },
            { title: "Amount", key: "amount", render: (row) => row.value || "-" },
          ]}
        />
      </Card>
      <Modal centered title="Add Coin To Folder" open={visible} onCancel={setFalse} footer={null}>
        <CoinForm
          onCreate={() => {
            setFalse();
            refresh();
          }}
        />
      </Modal>
    </>
  );
}
