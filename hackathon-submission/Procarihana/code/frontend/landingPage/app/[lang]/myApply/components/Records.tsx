"use client";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Table, Tag, Space, message, Button } from "antd";
import type { TableProps } from "antd";
import { RedoOutlined } from "@ant-design/icons";
import { AppStoreContext } from "@/components/AppStoreProvider";
import qs from "qs";
import { SUI_MIST } from "@/config/constants";
import type { DataType as Contract } from "./Contracts";
import PetDetailModal from "../../adoptionList/components/PetDetailModal";
import SubmitRecordModal from "./SubmitRecordModal";
import { useCurrentAccount } from "@mysten/dapp-kit";

export interface DataType {
  id: string;
  documentId: string;
  userId: string;
  contractId: string;
  petName: string;
  content: string;
  submitText: string;
  submitDate: string;
  result: string;
  comment: string;
  pet: any;
  contract: Contract;
  imgs: any[];
}

async function fetchRecords({ userId }: { userId: string }) {
  const query = qs.stringify(
    {
      filters: {
        userId: {
          $eq: userId,
        },
      },
      populate: "*",
      pagination: {
        page: 1,
        pageSize: 100,
      },
    },
    {
      encodeValuesOnly: true, // prettify URL
    }
  );
  const response = await fetch(`/api/records?${query}`);
  if (!response.ok) {
    throw new Error("查询回访记录失败");
  }

  const result = await response.json();
  if (result.error) {
    throw new Error(result.error.message);
  }
  return result.data?.data?.map((item: any) => ({
    ...item,
    petName: item.pet.petName,
  }));
}

const Records = () => {
  const { user } = useContext(AppStoreContext) as any;
  // console.log("records user = ", user);
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [petInfo, setPetInfo] = useState(null);
  const [recordInfo, setRecordInfo] = useState<DataType | null>(null);
  const submitModal = useRef<{ setOpen: Function }>(null);
  const detailModal = useRef<{ setOpen: Function }>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const account = useCurrentAccount()

  const getRecords = (user: any) => {
    if (user) {
      setLoading(true);
      return fetchRecords({ userId: user.email })
        .then((res) => {
          setData(res);
        })
        .catch((e) => {
          messageApi.open({
            type: "error",
            content: e.message,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    getRecords(user);
  }, [user]);

  const onSuccess = () => {
    getRecords(user);
  };

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "回访编号",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "宠物名",
      dataIndex: "petName",
      key: "petName",
      render: (_, rowData) => {
        return (
          <>
            <a
              onClick={() => {
                detailModal.current?.setOpen(true);
                setPetInfo(rowData.pet);
              }}
            >
              {rowData.petName}
            </a>
          </>
        );
      },
    },
    {
      title: "回访要求",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "提交日期",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (_, { submitDate }) => {
        return (
          <span>{submitDate && new Date(submitDate).toLocaleString()}</span>
        );
      },
    },
    {
      title: "审核结果",
      dataIndex: "result",
      key: "result",
      render: (_, { result }) => {
        const stateMap: { [key: string]: string } = {
          Pass: "通过",
          Reject: "未通过",
          Abandon: "已废弃",
          InReview: "审核中",
        };
        let color = "geekblue";
        if (result === "Pass") {
          color = "green";
        } else if (result === "Reject") {
          color = "volcano";
        }
        return <>{result && <Tag color={color}>{stateMap[result]}</Tag>}</>;
      },
    },
    {
      title: "审核备注",
      dataIndex: "comment",
      key: "comment",
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {!record.submitDate && (
            <a
              onClick={() => {
                if(!account) {
                  messageApi.open({
                    type: "warning",
                    content: "请先连接钱包",
                  });
                  return;
                }
                setRecordInfo(record);
                submitModal.current?.setOpen(true);
              }}
            >
              提交记录
            </a>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      {contextHolder}
      <Button
        icon={<RedoOutlined />}
        onClick={() => {getRecords(user)}}
        className="mb-3"
      />
      <Table<DataType>
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={{ position: ["none"] }}
      />
      <PetDetailModal
        ref={detailModal}
        animalInfo={petInfo}
        hasButton={false}
      ></PetDetailModal>
      <SubmitRecordModal ref={submitModal}
        record={recordInfo}
        onSuccess={onSuccess}>
      </SubmitRecordModal>
    </div>
  );
};

export default Records;

