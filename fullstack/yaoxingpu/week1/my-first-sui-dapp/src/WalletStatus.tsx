/*
 * @Author: yaoxingpu yaoxpu@163.com
 * @Date: 2025-01-03 23:26:49
 * @LastEditors: yaoxingpu yaoxpu@163.com
 * @LastEditTime: 2025-01-04 00:40:38
 * @FilePath: /my-first-sui-dapp/src/WalletStatus.tsx
 * @Description:
 *
 */
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Container, Flex, Heading, Text } from "@radix-ui/themes";
import { OwnedObjects } from "./OwnedObjects";

export function WalletStatus() {
  const account = useCurrentAccount();

  return (
    <Container my="2">
      <Heading mb="2">钱包状态</Heading>

      {account ? (
        <Flex direction="column">
          <Text color="blue">已连接</Text>
          <Text>地址: {account.address}</Text>
        </Flex>
      ) : (
        <Text color="gray">暂未连接</Text>
      )}
      <OwnedObjects />
    </Container>
  );
}
