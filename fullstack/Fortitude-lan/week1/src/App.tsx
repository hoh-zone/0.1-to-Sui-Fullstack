import { ConnectButton } from "@mysten/dapp-kit";
import { FormCom, ProfileDetail } from "@/components";
import logo1 from "@/assets/img/logo1.png";
import logo2 from "@/assets/img/logo2.png";
import { useEffect, useState } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Toaster } from "@/components/ui/toaster";
import { State } from "@/type";
import { queryInfo, queryState } from "@/lib/contracts";
import { User } from "@/type";

function App() {
  const [state, setState] = useState<State | null>(null);
  const [hasProfile, setHasProfile] = useState(true);
  const currentUser = useCurrentAccount();
  useEffect(() => {
    const fetchState = async () => {
      const state = await queryState();
      setState(state);
      console.log(state);

    };
    fetchState();
    if (state) {
      state.users.forEach((user: User) => {
        if (user.owner === currentUser?.address) {
          setHasProfile(true);
        }
      });
    }
  }, [currentUser]);
  return (
    <>
      <Toaster />
      <div className="flex justify-between p-4 px-10 h-[80px]">
        <h1>
          <img src={currentUser ? logo2 : logo1} alt="" className="h-[100%] " />
        </h1>
        <ConnectButton connectText="Connect Wallet" />
      </div>
      {currentUser && hasProfile ? <ProfileDetail users={state?.users}/> : <FormCom />}

      {/* <Flex
        position="sticky"
        px="4"
        py="2"
        justify="between"
        style={{
          borderBottom: "1px solid var(--gray-a2)",
        }}
      >
        <h1 className="text-3xl text-green font-bold hover:text-orange-700 ">Hello world!</h1>
        <Box>
          <Heading>dApp Starter Template</Heading>
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
          style={{ background: "var(--gray-a2)", minHeight: 500 }}
        >
          <WalletStatus />
        </Container>
      </Container> */}
    </>
  );
}

export default App;
