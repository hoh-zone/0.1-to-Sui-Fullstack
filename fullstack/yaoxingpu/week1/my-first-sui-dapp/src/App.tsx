import {
  ConnectButton,
  ConnectModal,
  useCurrentAccount,
  useWallets,
} from "@mysten/dapp-kit";
import { Box, Container, Flex, Heading } from "@radix-ui/themes";
import { WalletStatus } from "./WalletStatus";
import { useState } from "react";

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
          <Heading>dApp Starter Template</Heading>
        </Box>

        <Flex justify={"center"} align={"center"} gap="2">
          {/* <YourApp /> */}
          <MyComponent />
          <ConnectButton connectText="连接钱包" />
        </Flex>
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
      </Container>
    </>
  );
}

function YourApp() {
  const currentAccount = useCurrentAccount();
  const [open, setOpen] = useState(false);

  return (
    <ConnectModal
      trigger={
        <button disabled={!!currentAccount}>
          {currentAccount ? "Connected" : "Connect"}
        </button>
      }
      open={open}
      onOpenChange={(isOpen) => setOpen(isOpen)}
    />
  );
}

function MyComponent() {
  const wallets = useWallets();
  return (
    <div>
      {wallets.length === 0 && <div>No wallets installed</div>}
      <ul>
        {wallets.map((wallet) => (
          <li
            key={wallet.name}
            style={{ display: "flex", alignItems: "center" }}
          >
            <img src={wallet.icon} style={{ borderRadius: "50%" }} />
            {/* {wallet.name} */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
