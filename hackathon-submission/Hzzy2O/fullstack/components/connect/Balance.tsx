import { formatBalance } from '@/utils';
import { getSuiBalance } from '@/contracts/query';
import type { WalletAccount } from '@mysten/wallet-standard';
import { useEffect, useState } from 'react';
import { useInterval } from '@/hooks/useInterval';

type BalanceProps = {
  currentAccount: WalletAccount
}

function TokenBrandedSui() {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24"><path fill="#4ba2ff" d="M16.129 10.508a5.44 5.44 0 0 1 1.148 3.356a5.47 5.47 0 0 1-1.18 3.399l-.064.079l-.015-.106a5 5 0 0 0-.053-.26c-.37-1.656-1.567-3.08-3.547-4.234c-1.334-.773-2.102-1.705-2.303-2.763a4.1 4.1 0 0 1 .159-1.97c.15-.494.385-.96.694-1.376l.773-.963a.333.333 0 0 1 .518 0zm1.217-.963L12.19 3.092a.243.243 0 0 0-.38 0L6.652 9.55l-.016.016a7.1 7.1 0 0 0-1.519 4.404C5.118 17.85 8.2 21 12 21s6.881-3.15 6.881-7.03a7.1 7.1 0 0 0-1.519-4.404zm-9.46.942l.461-.577l.016.106l.037.254c.302 1.604 1.366 2.938 3.15 3.97c1.55.905 2.45 1.943 2.71 3.081c.106.476.127.942.08 1.35v.026l-.022.01c-.72.36-1.513.547-2.318.546c-2.912 0-5.278-2.414-5.278-5.389c0-1.275.434-2.45 1.165-3.377"></path></svg>);
}

export default function Balance({currentAccount}: BalanceProps) {
  const [balance, setBalance] = useState('')

  const fetchBalance = async () => {
    if (currentAccount?.address) {
      try {
        const profile = await getSuiBalance(currentAccount.address);
        setBalance(profile);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [currentAccount]);

  useInterval(fetchBalance, 10000);

  return <div className="text-sm bg-black rounded-sm px-1 flex items-center">
    <TokenBrandedSui />
    <span className='mx-1 text-center font-bold'>{ balance ? formatBalance(balance) || 0 : '-'}</span>
  </div>
}
