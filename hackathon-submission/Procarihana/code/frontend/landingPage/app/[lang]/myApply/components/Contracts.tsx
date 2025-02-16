"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { Table, Tag, Space, Button } from "antd";
import type { TableProps } from "antd";
import { RedoOutlined } from '@ant-design/icons';
import { AppStoreContext } from "@/components/AppStoreProvider";
import qs from "qs";
import PetDetailModal from "../../adoptionList/components/PetDetailModal";
import { PetCardProps } from "../../adoptionList/components/PetCard";
import { SUI_MIST } from '@/config/constants'
import SignContractModal from "./SignContractModal";

export interface DataType {
  id: string;
  documentId: string;
  petName: string;
  date: string;
  deposit: number;
  contractAddress: string;
  userId: string;
  recordTimes: string;
  userWallet: string;
  signDate: string;
  finishDate: string;
  state: string;
  pet: any;
}

// const data: DataType[] = [
//   {
//     id: "1",
//     petName: "小黑",
//     deposit: 1,
//     count: "3",
//     date: "2025-02-11 19:00",
//     state: "进行中",
//   },
// ];

async function fetchContracts({ userId }: { userId: string }) {
  const query = qs.stringify(
    {
      filters: {
        userId: {
          $eq: userId,
        },
      },
      populate: '*',
      pagination: {
        page: 1,
        pageSize: 100,
      },
    },
    {
      encodeValuesOnly: true, // prettify URL
    }
  );
  const response = await fetch(`/api/petContracts?${query}`);
  if (!response.ok) {
    throw new Error("Failed to fetch contracts");
  }
  const result = await response.json();
  return result.data?.data?.map((item: any) => ({
    ...item,
    petName: item.pet.petName,
  }));
}

const Contracts = () => {
  const { user }: any = useContext(AppStoreContext);
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [petInfo, setPetInfo] = useState(null);
  const [curContract, setCurContract] = useState<DataType | null>(null);
  const signModal = useRef<{ setOpen: Function }>(null);
  const detailModal = useRef<{ setOpen: Function }>(null);

  const getContracts = (user: any) => {
    if (user) {
      setLoading(true);
      return fetchContracts({ userId: user.email })
        .then((res) => {
          console.log('res = ', res);
          setData(res);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }

  useEffect(() => {
    getContracts(user)
  }, [user]);

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "合同编号",
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
            <a onClick={() => {
              detailModal.current?.setOpen(true);
              setPetInfo(rowData.pet)
            }}>{rowData.petName}</a>
          </>
        );
      },
    },
    {
      title: "押金(SUI)",
      dataIndex: "deposit",
      key: "deposit",
      render: (_, {deposit}) => {
        return (
          <span>{deposit / SUI_MIST}</span>
        );
      },
    },
    {
      title: "回访总数",
      dataIndex: "recordTimes",
      key: "recordTimes",
    },
    {
      title: "签署日期",
      dataIndex: "signDate",
      key: "signDate",
      render: (_, { signDate }) => {
        return (
          <span>{signDate && new Date(signDate).toLocaleString()}</span>
        );
      }
    },
    {
      title: "完成日期",
      dataIndex: "finishDate",
      key: "finishDate",
      render: (_, { finishDate }) => {
        return (
          <span>{finishDate && new Date(finishDate).toLocaleString()}</span>
        );
      }
    },
    {
      title: "合同状态",
      dataIndex: "state",
      key: "state",
      render: (_, { state }) => {
        const stateMap: { [key: string]: string } = {
          toSign: "待签署",
          complete: "已完成",
          termination: "已终止",
          inProgress: "进行中",
        };
        let color = "geekblue";
        if (state === "toSign") {
          color = "cyan";
        } else if (state === "complete") {
          color = "green";
        } else if (state === "termination") {
          color = "volcano";
        }
        return (
          <>
            <Tag color={color}>{stateMap[state]}</Tag>
          </>
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          { record.state === 'toSign' && <a onClick={() => {
            setCurContract(record);
            signModal.current?.setOpen(true);
          }}>签署合同</a> }
        </Space>
      ),
    },
  ];

  const onSuccess = () => {
    getContracts(user);
  }

  return (
    <div>
      <Button icon={<RedoOutlined />} onClick={() => getContracts(user)} className="mb-3"/>
      
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
      <SignContractModal ref={signModal} contract={curContract} onSuccess={onSuccess}></SignContractModal>
    </div>
  );
};

export default Contracts;
