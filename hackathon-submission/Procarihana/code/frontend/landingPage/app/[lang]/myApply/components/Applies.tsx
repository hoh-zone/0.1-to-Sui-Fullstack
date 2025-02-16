"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { Table, Tag, Button } from "antd";
import { RedoOutlined } from "@ant-design/icons";
import type { TableProps } from "antd";
import qs from "qs";
import { AppStoreContext } from "@/components/AppStoreProvider";
import PetDetailModal from "../../adoptionList/components/PetDetailModal";

interface DataType {
  id: string;
  petName: string;
  date: string;
  state: string;
  createdAt: string;
  pet: any
}

async function fetchApplies({ userId }: { userId: string }) {
  const query = qs.stringify(
    {
      filters: {
        userId: {
          $eq: userId,
        },
      },
      populate: "pet",
      pagination: {
        page: 1,
        pageSize: 100,
      },
    },
    {
      encodeValuesOnly: true, // prettify URL
    }
  );
  const response = await fetch(`/api/petApply?${query}`);
  if (!response.ok) {
    throw new Error("Failed to fetch contracts");
  }
  const result = await response.json();
  return result.data?.data?.map((item: any) => ({
    ...item,
    petName: item.pet.petName,
  }));
}

// const data: DataType[] = [
//   {
//     id: "1",
//     petName: "小黑",
//     date: "2025-02-11 19:00",
//     state: "审核中",
//   },
// ];
const Applies = () => {
  const { user }: any = useContext(AppStoreContext);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DataType[]>([]);
  const detailModal = useRef<{ setOpen: Function }>(null);
  const [petInfo, setPetInfo] = useState(null);
  
  const getContracts = (user: any) => {
    if (user) {
      setLoading(true);
      return fetchApplies({ userId: user.email })
        .then((res) => {
          setData(res);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "申请编号",
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
      title: "申请日期",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (_, { createdAt }) => {
        return new Date(createdAt).toLocaleString();
      },
    },
    {
      title: "审核状态",
      dataIndex: "state",
      key: "state",
      render: (_, { state }) => {
        let color = "geekblue";
        if (state === "InReview") {
          color = "cyan";
        } else if (state === "Pass") {
          color = "green";
        } else if (state === "Reject") {
          color = "volcano";
        }
        const stateMap = {
          InReview: "审核中",
          Pass: "通过",
          Reject: "拒绝",
        };
        return (
          <>
            <Tag color={color}>
              {stateMap[state as keyof typeof stateMap] || ""}
            </Tag>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    getContracts(user);
  }, [user]);

  return (
    <div>
      <Button
        icon={<RedoOutlined />}
        onClick={() => getContracts(user)}
        className="mb-3"
      />
      <Table<DataType>
        columns={columns}
        dataSource={data}
        pagination={{ position: ["none"] }}
        loading={loading}
      />
      <PetDetailModal
        ref={detailModal}
        animalInfo={petInfo}
        hasButton={false}
      ></PetDetailModal>
    </div>
  );
};

export default Applies;
