import { Button, Modal, Checkbox, message, Upload, Form, Input } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import {
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type { DataType as Record } from "./Records";
import {
  useSignAndExecuteTransaction,
  useSuiClient,
  useCurrentAccount,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import {SUI_CLOCK_OBJECT_ID} from "@mysten/sui/utils";
import { SUI_MIST, PACKAGE_ID, CONTRACTS_CONTAINER } from "@/config/constants";

type FieldType = {
  submitText?: string;
  imgs: string;
};

const { TextArea } = Input;

const SubmitRecordModal = (
  {
    record,
    onSuccess,
  }: {
    record?: Record | null;
    onSuccess?: () => void;
  },
  ref: Ref<{
    setOpen: Function;
  }>
) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const account = useCurrentAccount();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  useImperativeHandle(ref, () => ({
    setOpen,
  }));
  const suiClient = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction({
    execute: async ({ bytes, signature }) =>
      await suiClient.executeTransactionBlock({
        transactionBlock: bytes,
        signature,
        options: {
          // Raw effects are required so the effects can be reported back to the wallet
          showRawEffects: true,
          showEffects: true,
          showEvents: true,
        },
      }),
  });

  const [form] = Form.useForm();
  const onSubmit = () => {
    if (!account) {
      messageApi.open({
        type: "warning",
        content: "请先连接钱包",
      });
      return;
    }
    form.validateFields().then(async () => {
      try {
        const txb = new Transaction();

        txb.setGasBudget(100000000);
        await new Promise(async (resolve, reject) => {
          txb.moveCall({
            target: `${PACKAGE_ID}::apply_for_adoption::upload_record`,
            arguments: [
              txb.pure.id(record?.contract?.contractAddress),
              txb.object(CONTRACTS_CONTAINER), // contracts
              txb.pure.string(fileList.map(item => {
                const { response } = item as any
                if (response.data && response.data.length > 0) {
                  return response.data[0].url
                }
                return ''
              }).join(",")),
              txb.object(SUI_CLOCK_OBJECT_ID)
            ],
            typeArguments: [],
          });

          // Show loading state
          setLoading(true);

          signAndExecute(
            {
              transaction: txb,
            },
            {
              onSuccess: async (data) => {
                console.log("transaction digest: " + JSON.stringify(data));
                if (
                  (data.effects && data.effects.status.status) === "success"
                ) {
                  const response = await fetch(`/api/records?id=${record?.documentId}`, {
                    method: "PUT",
                    body: JSON.stringify({
                      data: {
                        imgs: form.getFieldValue("imgs"),
                        submitText: form.getFieldValue("submitText"),
                        submitDate: new Date().toISOString(),
                        result: "InReview",
                      },
                    }),
                  });
                  if (!response.ok) {
                    reject(new Error("提交回访记录失败"));        
                  }
                  messageApi.open({
                    type: "success",
                    content: "提交成功",
                  });
                  setOpen(false);
                  onSuccess?.();
                  resolve('');
                } else {
                  reject(new Error("交易失败, digest: " + data.digest));
                }
              },
              onError: (err) => {
                console.error("交易失败: " + err);
                reject(err);
              },
            }
          );
        });
      } catch (e: any) {
        messageApi.open({
          type: "error",
          content: e.message,
        });
      } finally {
        setLoading(false);
      }
    });
  };
  useEffect(() => {
    if (open) {
      form.resetFields();
      setFileList([]);
    }
  }, [open]);

  const handleChange: UploadProps["onChange"] = (info) => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.map((file) => {
      if (file.response) {
        if (file.response.data && file.response.data.length > 0) {
          file.url = file.response.data[0].url;
        }
      }
      return file;
    });
    const imgs: string[] = [];
    info.fileList.forEach((file) => {
      if (file.response?.data) {
        file.response?.data.forEach((item: any) => {
          imgs.push(item.id);
        });
      }
    });
    form.setFieldValue("imgs", imgs);

    setFileList(newFileList);
  };

  return (
    <Modal
      title={<p>提交回访记录</p>}
      confirmLoading={loading}
      open={open}
      maskClosable={false}
      onCancel={() => setOpen(false)}
      onOk={onSubmit}
      okText="提交"
      cancelText="取消"
      width={650}
      className="mt-5"
    >
      {contextHolder}
      <Form
        name="basic"
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 18 }}
        style={{ maxWidth: 600 }}
        initialValues={{}}
        autoComplete="off"
        className="mt-3"
        form={form}
      >
        <Form.Item<FieldType> label="图片附件" name="imgs" rules={[]}>
          <Upload
            action="/api/upload"
            listType="picture"
            defaultFileList={fileList}
            onChange={handleChange}
            multiple
          >
            <Button type="primary" icon={<UploadOutlined />}>
              Upload
            </Button>
          </Upload>
        </Form.Item>
        <Form.Item<FieldType>
          label="描述"
          name="submitText"
          rules={[{ required: true, message: "请输入描述信息" }]}
        >
          <TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default forwardRef(SubmitRecordModal);
