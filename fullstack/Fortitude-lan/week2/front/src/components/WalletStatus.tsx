import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { Container, Flex, Heading, Text } from "@radix-ui/themes";
import { OwnedObjects } from "@/components/OwnedObjects";

export function WalletStatus() {
  const account = useCurrentAccount();
  const { data, isPending, error } = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: account?.address as string,
    },
    {
      enabled: !!account,
    },
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
  return (
    <>
      {account ? (
        <>
          <h1 className="pb-4 text-custom-blue text-xl font-semibold">
            Wallet connected
          </h1>
          <div className="pb-2 text-cyan-50 font-mono">
            Address: {account.address}
          </div>
        </>
      ) : (
        <Text>Wallet not connected</Text>
      )}

      <Flex direction="column" my="2">
        {data.data.length === 0 ? (
          <Text>No objects owned by the connected wallet</Text>
        ) : (
          <h3 className="pb-4 text-custom-blue  text-xl  font-semibold">
            Objects owned by the connected wallet
          </h3>
        )}
        {data.data.map((object) => (
          <Flex key={object.data?.objectId}>
            <Text className="pb-2 text-cyan-50 font-mono">Object ID: {object.data?.objectId}</Text>
          </Flex>
        ))}
      </Flex>
    </>
  );
}
