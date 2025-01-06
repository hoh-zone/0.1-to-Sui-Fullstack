// Transaction Digest: 2yivEsJDZb5UwoTr9uxqPrKCSdVXcU8GCi1PS9kJhw7o
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import type { WalletAccount } from '@mysten/wallet-standard';
import { Divider, Flex } from "antd";
import styles from "./App.module.scss";
import { useEffect, useState } from "react";
import { networkConfig, suiClient } from "./networkConfig";
import Profile from "./components/app/Profile";
import ProfileForm from "./components/app/ProfileForm";
import { User } from "@/type/index";

function App() {
  /**
   * 显示逻辑
   * 钱包未登录：显示form表单
   * 钱包登录：如果已经填写了profile就显示出来；如果没有填写，显示form表单
   */
  // 判断钱包登录
  const account: WalletAccount | null = useCurrentAccount();
  // 如果登录，查询是否填写了profile
  const [hasProfile, setHasProfile] = useState(false);
  const [state, setState] = useState<User[]>([]);
  // 查询合约中的共享struct State
  const queryState = async () => {
    const events = await suiClient.queryEvents({
      query: {
        MoveEventType: `${networkConfig.testnet.packageID}::week_one_alt::ProfileCreated`,
      },
    });
    const userArr: User[] = [];
    events.data.forEach((item) => {
      const user = item.parsedJson as User;
      if (user.owner == account?.address) {
        userArr.push(user);
        setHasProfile(true);
      }
    });
    setState(userArr);
  };
  useEffect(() => {
    // 查询 合约State有没有当前地址下的 proflie
    if(account === null) {
      return
    }
    queryState();
  }, [account]);
  return (
    <div className={styles.container}>
      <Flex justify="space-between" align="center">
        <h3>DApp</h3>
        <ConnectButton />
      </Flex>
      <Divider className={styles.divider} />
      {account && hasProfile ? <Profile state={state} account={account} /> : <ProfileForm />}
    </div>
  );
}

export default App;
