import { User } from "@/type";
import styles from "./profile.module.scss"
import type { WalletAccount } from '@mysten/wallet-standard';
function Profile({ state, account }: {state: User[], account: WalletAccount | null }) {
  return (
    <div className={styles.profile}>
      <div>label:{account?.label}</div>
      <div>address:{account?.address}</div>
      {state.map((item: User) => {
        return (
          <div key={item.profile}>
            <div>owner:{item.owner}</div>
            <div>profile:{item.profile}</div>
          </div>
        );
      })}
    </div>
  );
}

export default Profile;
