import FolderForm from "@/routes/task/components/FolderForm";
import { useTaskModel } from "@/routes/task/model";
import { PlusOutlined } from "@ant-design/icons";
import { useBoolean } from "ahooks";
import { Button, Card, Empty, Form, Modal, Select } from "antd";

export function Folder() {
  const { profile, folder, folders = [], setFolder, refresh } = useTaskModel();
  const [visible, { setTrue, setFalse }] = useBoolean(false);

  return (
    <>
      <Card
        title="Folder"
        className="h-full"
        extra={profile ? <Button size="small" icon={<PlusOutlined />} type="primary" onClick={setTrue} /> : undefined}
      >
        {folders?.length ? (
          <>
            <Select
              value={folder?.id.id}
              className="w-full"
              onSelect={(e) => {
                setFolder(folders.find((i) => i.id.id === e));
              }}
            >
              {folders.map((f) => (
                <Select.Option key={f.id.id} value={f.id.id}>
                  {f.name}
                </Select.Option>
              ))}
            </Select>
            <Form className="mt-3">
              <Form.Item label="name" className="mb-2">
                {folder?.name}
              </Form.Item>
              <Form.Item label="description" className="mb-2">
                {folder?.description}
              </Form.Item>
            </Form>
          </>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="You have no folder" />
        )}
      </Card>
      <Modal centered title="Create Folder" open={visible} onCancel={setFalse} footer={null}>
        <FolderForm
          onCreate={() => {
            setFalse();
            refresh();
          }}
        />
      </Modal>
    </>
  );
}
