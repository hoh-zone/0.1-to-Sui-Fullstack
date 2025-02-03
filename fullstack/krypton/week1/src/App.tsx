import { ConnectButton, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Box, Card, TextArea,Button, Flex, Heading, Text } from "@radix-ui/themes";
import { useState } from "react";
import { createProfileTx, queryState } from "./move/index";
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
          backgroundColor: "white",
        }}
      >
        <Box>
          <Heading size="6" style={{ color: "var(--accent-11)" }}>Profile Creator</Heading>
        </Box>

        <Box>
          <ConnectButton />
        </Box>
      </Flex>
      
      <Flex
        justify={"center"}
        align={"center"}
        minHeight="100vh"
        style={{
          background: "linear-gradient(135deg, var(--blue-3) 0%, var(--mint-3) 100%)",
          padding: "2rem"
        }}
      >
        <Box width="500px">
          <Card size="3" style={{
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            borderRadius: "12px",
            backgroundColor: "white"
          }}>
              <Flex gap="6" justify="center" align="center" direction="column">
                <Text as="div" size="5" weight="bold" style={{ color: "var(--gray-12)", marginBottom: "1rem" }}>
                  Create Your Profile
                </Text>
                <TextArea
                  style={{ width: "100%", marginBottom: "1rem" }}
                  size="3"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e)=> setName(e.target.value)}
                />
                <TextArea
                  style={{ width: "100%", marginBottom: "2rem" }}
                  size="3"
                  placeholder="Tell us about yourself"
                  value={description}
                  onChange={(e)=> setDescription(e.target.value)}
                />
                <Button
                  style={{ 
                    width: "100%",
                    backgroundColor: "var(--accent-9)",
                    transition: "all 0.2s ease",
                    cursor: "pointer"
                  }}
                  size="3"
                  type="submit"
                  onClick={handleCreateProfile}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--accent-10)"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--accent-9)"}
                >
                  Create Profile
                </Button>
              </Flex>
            </Card>
          </Box>
        </Flex>
    </>
  );
}

export default App;
