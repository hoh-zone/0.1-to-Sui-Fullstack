import { ConnectButton } from "@mysten/dapp-kit";
import { Box, Container, Flex, Heading } from "@radix-ui/themes";
import CreateProfile from "./function/createProfile.tsx";
import CreateAccountBook from "./function/createAccountBook.tsx";
import AddContent from "./function/createContent.tsx";

function App() {
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
          <Heading>星瀚链记</Heading>
        </Box>

        <Box>
          <ConnectButton />
        </Box>
      </Flex>
      <Container>
        <Container
          mt="5"
          pt="2"
          px="4"
          style={{ background: "black", minHeight: "auto" ,marginTop:"10%"}}
        >
            <CreateProfile onSuccess={()=>{alert("Successfully created!")}} />
            <CreateAccountBook onSuccess={()=>{alert("Successfully created!")}}/>
          <div style={{marginTop:"3%",marginBottom:"20%"}}><AddContent onSuccess={()=>{alert("Successfully get!")}}/></div>


        </Container>
      </Container>
    </>
    );
}

export default App;
