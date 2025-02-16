import { ConnectButton, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Box, Flex, Heading, Card, Text, TextArea, Button } from "@radix-ui/themes";
import { useState } from "react";
import { createProfileTx, queryState } from "./contracts/index";
import { WalletStatus } from "./WalletStatus";
import { useEffect } from "react";

function App() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const {mutate: signAndExecute} = useSignAndExecuteTransaction();

  useEffect(()=> {
    const fetchState = async () => {
      const state = await queryState();
      console.log(state);
    }
    fetchState();
  }, [])

  const handleCreateProfile = async () => {
    console.log(name, description);
    const tx = await createProfileTx(name, description);
    signAndExecute({
      transaction: tx,
    },{
      onSuccess: () => {
        console.log("success");
      },
      onError: (error) => {
        console.log("error", error);
      },
    })
  };

  return (
    <>
      <Flex
        position="sticky"
        px="4"
        py="2"
        justify="between"
        style={{
          borderBottom: "1px solid var(--gray-a2)",
        }}
      >
        <Box>
          <Heading>dApp</Heading>
        </Box>

        <Box>
          <ConnectButton />
        </Box>
      </Flex>

      <Flex
        justify={"center"}
        align={"center"}
        height={"40%"}
        style={{
          marginTop: "5%",
        }}
      >
        <Box width="500px">
          <Card size="3">
            <Flex gap="6" justify="center" align="center" direction="column">
                <Text as="div" size="4" weight="bold">
                  Create Profile
                </Text>
                <TextArea
                  style={{ width: "400px" }}
                  size="3"
                  placeholder="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)} 
                />
                <TextArea
                  style={{ width: "400px" }}
                  size="3"
                  placeholder="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)} 
                />
                <Button
                  style={{ width: "400px" }}
                  size="3"
                  type="submit"
                  onClick={handleCreateProfile} 
                >
                  Create
                </Button>
            </Flex>
          </Card>
        </Box>
      </Flex>
    </>
  );
}

export default App;
