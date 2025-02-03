import ProfileForm from "@/routes/task/components/ProfileForm";
import { useTaskModel } from "@/routes/task/model";
import { PlusOutlined } from "@ant-design/icons";
import { useBoolean } from "ahooks";
import { Button, Card, Empty, Form, Modal } from "antd";

export function Profile() {
  const { profile, refresh } = useTaskModel();
  const [visible, { setTrue, setFalse }] = useBoolean(false);

  return (
    <>
      <Card title="Profile" className="h-full">
        {profile ? (
          <Form>
            <Form.Item label="name">{profile.name}</Form.Item>
            <Form.Item label="description">{profile.description}</Form.Item>
          </Form>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="You have no profile">
            <Button size="small" icon={<PlusOutlined />} type="primary" onClick={setTrue}>
              Create
            </Button>
          </Empty>
        )}
      </Card>
      <Modal centered title="Create Profile" open={visible} onCancel={setFalse} footer={null}>
        <ProfileForm
          onCreate={() => {
            setFalse();
            refresh();
          }}
        />
      </Modal>
    </>
  );
}
