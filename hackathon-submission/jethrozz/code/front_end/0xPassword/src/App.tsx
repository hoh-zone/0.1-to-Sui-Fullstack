//import { ConnectButton } from "@mysten/dapp-kit";
import { Box, Container, Flex, Heading } from "@radix-ui/themes";
import { OwnedObjects } from "./OwnedObjects";

function App() {
  return (
    <>
      <Flex
        position="sticky"
        px="4"
        py="2"
        width={"400px"}
        justify="between"
        style={{
          borderBottom: "1px solid var(--gray-a2)",
        }}
      >
        <Box>
          <Heading>Password Manager</Heading>
        </Box>

      </Flex>
      <Container>
        <Container
          mt="5"
          pt="2"
          px="4"
          style={{ background: "var(--gray-a2)", minHeight: 500 }}
        >
          <OwnedObjects />
        </Container>
      </Container>
    </>
  );
}

export default App;
