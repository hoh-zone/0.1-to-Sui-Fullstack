import { Button, Modal, Form, Input, Radio, Checkbox, FormProps, message } from "antd";
import {
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  useContext,
} from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { AppStoreContext } from "@/components/AppStoreProvider";
import type { PetCardProps } from "./PetCard";

type LayoutType = Parameters<typeof Form>[0]["layout"];

type FieldType = {
  health?: string;
  experience?: string;
  selfStatus?: string;
  bugget?: string;
};

async function createApply(params: any) {
  const response = await fetch(`/api/petApply`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
  if (!response.ok) {
    throw new Error("提交申请失败");
  }
  const result = await response.json();
  return result.data;
}

const AdoptApplyModal = (
  {
    animalInfo,
  }: {
    animalInfo: PetCardProps | null;
  },
  ref: Ref<{
    setOpen: Function;
  }>
) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  useImperativeHandle(ref, () => ({
    setOpen,
  }));
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState<LayoutType>("vertical");
  const { user } = useContext(AppStoreContext) as any;
  const [messageApi, contextHolder] = message.useMessage();

  console.log("user = ", user);
  const account = useCurrentAccount();

  const onSubmit: FormProps<FieldType>["onFinish"] = (values) => {
    // console.log("Success:", values);
    // console.log("user = ", user);
    setLoading(true)
    createApply({
      data: {
        ...values,
        userId: user.email,
        pet: { connect: animalInfo && animalInfo.documentId },
        health: (values.health as unknown as string[])?.join(","),
        state: 'InReview',
        userWallet: account?.address
      },
      statue: 'published'
    })
      .then(() => {
        messageApi.open({
          type: "success",
          content: "提交申请成功",
        })
        form.resetFields();
        setOpen(false);
      })
      .catch((error) => {
        messageApi.open({
          type: "error",
          content: "提交申请失败：" + error.message,
        })
      })
      .finally(() => {
        setLoading(false)
      });
  };

  const healthOptions = [
    { label: "健康", value: "健康" },
    { label: "存在残疾", value: "存在残疾" },
    { label: "患有慢性病", value: "患有慢性病" },
  ];
  const experienceOptions = [
    { label: "现在有，想再领养一只", value: "现在有，想再领养一只" },
    { label: "过去有，已经过世", value: "过去有，已经过世" },
    { label: "过去有，后来走丢了", value: "过去有，后来走丢了" },
    { label: "没有养过", value: "没有养过" },
    { label: "宠物送人/放生了", value: "宠物送人/放生了" },
  ];
  const statusOptions = [
    { label: "在校学生", value: "在校学生" },
    { label: "在职人员", value: "在职人员" },
    { label: "离职人员", value: "离职人员" },
    { label: "退休人员", value: "退休人员" },
  ];
  const buggetOptions = [
    { label: "500元-700元", value: "500-700" },
    { label: "700元-1000元", value: "700-1000" },
    { label: "1000元-1500元", value: "1000-1500" },
    { label: "1500元以上", value: "1500以上" },
  ];

  return (
    <Modal
      title={<p>填写申请表</p>}
      open={open}
      footer={null}
      width="700px"
      maskClosable={false}
      onCancel={() => setOpen(false)}
    >
      {contextHolder}
      <div className="p-2">
        <Form
          layout={formLayout}
          form={form}
          initialValues={{ layout: formLayout }}
          style={{ maxWidth: formLayout === "inline" ? "none" : 600 }}
          onFinish={onSubmit}
        >
          <div className="pb-4">
            <Form.Item
              label="您能接受领养动物的健康状况为(多选)"
              name="health"
              rules={[{ required: true, message: "请填写必填项" }]}
            >
              <Checkbox.Group options={healthOptions} defaultValue={[]} />
            </Form.Item>
          </div>
          <div className="pb-4">
            <Form.Item
              label="过去是否有养宠经验"
              name="experience"
              rules={[{ required: true, message: "请填写必填项" }]}
            >
              <Radio.Group options={experienceOptions} />
            </Form.Item>
          </div>
          <div className="pb-4">
            <Form.Item
              label="您目前的身份"
              name="selfStatus"
              rules={[{ required: true, message: "请填写必填项" }]}
            >
              <Radio.Group options={statusOptions} />
            </Form.Item>
          </div>
          <div className="pb-4">
            <Form.Item
              label="您的养宠预算为(元/月 不计算疫苗零食玩具绝育等额外费用)"
              name="bugget"
              rules={[{ required: true, message: "请填写必填项" }]}
            >
              <Radio.Group options={buggetOptions} />
            </Form.Item>
          </div>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              提交
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default forwardRef(AdoptApplyModal);
