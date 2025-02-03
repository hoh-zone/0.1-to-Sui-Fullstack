import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { MIST_PER_SUI } from "@mysten/sui/utils";
import { Card, Flex } from "antd";

const balance = (balance: string) => {
  return Number.parseInt(balance) / Number(MIST_PER_SUI);
};

export function Balance() {
  const account = useCurrentAccount();
  const { data, isPending, error } = useSuiClientQuery(
    "getBalance",
    { owner: account?.address as string },
    { enabled: !!account },
  );

  if (!account) {
    return;
  }

  if (error) {
    return <Flex>Error: {error.message}</Flex>;
  }

  if (isPending || !data) {
    return <Flex>Loading...</Flex>;
  }
  MIST_PER_SUI;

  return (
    <Card size="small" title="Balance">
      <p>Total: {balance(data.totalBalance)} SUI</p>
    </Card>
  );
}
