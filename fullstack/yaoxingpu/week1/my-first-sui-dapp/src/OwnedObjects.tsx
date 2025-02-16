import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { Flex, Heading, Text, Table } from "@radix-ui/themes";

export function OwnedObjects() {
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
    <Flex direction="column" my="2">
      {data.data.length === 0 ? (
        <Text>No objects owned by the connected wallet</Text>
      ) : (
        <Heading size="4">对象列表</Heading>
      )}
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Object ID</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>digest</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>version</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {data.data.map((object) => (
            <Table.Row key={object.data?.objectId}>
              <Table.RowHeaderCell>{object.data?.objectId}</Table.RowHeaderCell>
              <Table.Cell>{object.data?.digest}</Table.Cell>
              <Table.Cell>{object.data?.version}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      {/* {data.data.map((object) => (
        <Flex key={object.data?.objectId}>
          <Text>Object ID: {object.data?.objectId}</Text>
        </Flex>
      ))} */}
    </Flex>
  );
}
