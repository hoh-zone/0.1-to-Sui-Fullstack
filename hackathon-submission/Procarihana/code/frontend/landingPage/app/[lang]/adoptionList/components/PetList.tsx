"use client";
import { useState, useEffect, useRef, useContext } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import qs from "qs";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { message, Modal } from "antd";
import Filter from "./Filter";
import PetCard, { PetCardProps } from "./PetCard";
import petsJson from "@/raw-datas/1.json";
import PetDetailModal from "./PetDetailModal";
import AdoptApplyModal from "./AdoptApplyModal";
import { AppStoreContext } from "@/components/AppStoreProvider";
import { redirect } from "next/navigation";

const { confirm } = Modal;

async function fetchPets({ pageParam = 1, petType = '' }) {
  const query = qs.stringify(
    {
      pagination: {
        page: pageParam,
        pageSize: 8,
      },
      filter: {
        petType,
      },
      sort: 'createdAt:desc'
    },
    {
      encodeValuesOnly: true, // prettify URL
    }
  );
  const response = await fetch(`/api/pets?${query}`);
  if (!response.ok) {
    throw new Error("Failed to fetch pets");
  }
  const result = await response.json();
  return result.data;
}
export function PetList() {
  const detailModal = useRef<{ setOpen: Function }>(null);
  const adoptApplyModal = useRef<{ setOpen: Function }>(null);
  const { ref, inView } = useInView();
  const account = useCurrentAccount();
  const [messageApi, contextHolder] = message.useMessage();
  const storeData: any = useContext(AppStoreContext);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["pets"],
    queryFn: fetchPets,
    getNextPageParam: (lastPage) => {
      console.log("lastPage = ", lastPage);
      return lastPage.meta.pagination.page >= lastPage.meta.pagination.pageCount
        ? null
        : lastPage.meta.pagination.page + 1;
    },
    initialPageParam: 1,
  });
  // console.log("data = ", data)
  const pets = data?.pages.map((page) => page.data).flat() || [];
  // console.log("pets = ", pets)
//   const pets = petsJson.data.records;

  useEffect(() => {
      if (inView && hasNextPage) {
          fetchNextPage()
      }
  }, [inView, fetchNextPage, hasNextPage])

  const onSearch = (searchTerm: string) => {
    console.log(searchTerm);
  };

  const [curPet, setCurPet] = useState(null);
  const onPetClick = (pet: PetCardProps) => {
    // console.log("click pet = ", pet);
    detailModal.current?.setOpen(true);
    setCurPet(pet);
  };
  const onAdopt = () => {
    // console.log("onAdopt");
    if (!storeData.user) {
      confirm({
        title: "提示",
        icon: <ExclamationCircleFilled />,
        content: "请先登录",
        okText: '去登录',
        cancelText: "取消",
        onOk() {
          redirect("/zh/login");
        },
        onCancel() {},
      });
      return;
    }
    if (!account) {
      messageApi.open({
        type: "warning",
        content: "请先连接钱包",
      });
      return;
    }
    adoptApplyModal.current?.setOpen(true);
  };

  return (
    <>
      {contextHolder}
      <div className="flex flex-col justify-center items-center w-5/6">
        {/* <div className="flex justify-start items-center mb-4 w-full">
          <Filter searchCallback={onSearch}></Filter>
        </div> */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 overflow-hidden relative transition-all w-full">
          {pets.map((item: any) => {
            return (
              <div key={item.documentId} className="mb-4 z-0 w-full">
                <PetCard
                  animalInfo={item as unknown as PetCardProps}
                  onClick={onPetClick}
                ></PetCard>
              </div>
            );
          })}
        </div>
        <div ref={ref} className="h-10 flex items-center justify-center">
          {isFetchingNextPage
            ? "Loading more..."
            : hasNextPage
            ? "Load More"
            : "No more pets to load"}
        </div>
        <PetDetailModal
          ref={detailModal}
          animalInfo={curPet}
          onAdopt={onAdopt}
        ></PetDetailModal>
        <AdoptApplyModal
          ref={adoptApplyModal}
          animalInfo={curPet}
        ></AdoptApplyModal>
      </div>
    </>
  );
}
