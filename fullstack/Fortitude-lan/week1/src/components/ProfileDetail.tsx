"use client";
import React, { useEffect, useState } from "react";

import { createProfileTx, queryInfo, queryState } from "@/lib/contracts";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";

import { Box, Container, Flex, Heading } from "@radix-ui/themes";
import { useToast } from "@/hooks/use-toast";
import { WalletStatus } from "@/WalletStatus";
import { User } from "@/type";

export function ProfileDetail({ users }: any) {
  const [list, setlist] = useState([]);
  useEffect(() => {
    const fetchInfo = async () => {
      // 确保 users 数组存在且有内容
      if (users?.length) {
        // 创建一个数组来存储所有异步请求
        const promises = users.map(async (obj: User) => {
          const info = await queryInfo(obj.profile);
          return {
            ...obj, // 旧的 user 数据
            ...info, // 新获取的 info 数据
          };
        });
        const allInfo: any = await Promise.all(promises);
        setlist(allInfo);
      }
    };
    fetchInfo();
  }, [users]);

  return (
    <div className="w-[90%] mx-auto rounded-none md:rounded-2xl p-4 md:p-8 my-2 shadow-input bg-transparent dark:bg-black">
      <h2 className=" text-center font-bold text-xl text-neutral-50 dark:text-neutral-200">
        Profile List
      </h2>
      <ul>
        {list?.length &&
          list.map((obj: any, idx) => (
            <li key={idx} className="p-2 border-b-2 border-custom-blue">
              <div>owner: {obj.owner}</div>
              <div>profile: {obj.profile}</div>
              <div>name: {obj.name}</div>
              <div>desc: {obj.description}</div>
            </li>
          ))}
      </ul>
      <Container>
        <Container
          mt="5"
          pt="2"
          px="4"
          style={{ background: "var(--gray-a2)", minHeight: 500 }}
        >
          <WalletStatus />
        </Container>
      </Container>
    </div>
  );
}
