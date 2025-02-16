import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClientQuery } from "@mysten/dapp-kit";
import { Container, Heading } from "@radix-ui/themes";
import * as Form from "@radix-ui/react-form";
import { addProfileTx } from "./contract";
import { client, networkConfig } from "./networkConfig";
import { useEffect, useState } from "react";
import ProfileCard from './components/ProfileCard'
import FileManage from './components/FileManage'
import { getCoinMetadata, formatBalance } from "./utils/format";

export function Profile() {
  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction()
  const [name, setName] = useState("");
  const [profileId, setProfileId] = useState("");
  const [coins, setCoins] = useState<any>([]);

  const { data, isPending } = useSuiClientQuery(
		'queryEvents',
		{ 
      query: {
        MoveEventType: `${networkConfig.testnet.packageId}::profile::ProfileCreated`,
      } 
    },
	);

  
  async function getprofile(profile: any) {
    try {
      const { data } = await client.getObject({ id: profile, options: { showContent: true }})
      if (data?.content) {
        const { name } = (data.content as any)?.fields
        setName(name)
        setProfileId(profile)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const fetchAllCoins = async () => {
    if (!account) return;

    try {
      const allObjects = await client.getOwnedObjects({
        owner: account.address,
        options: {
          showType: true,
          showContent: true,
        },
        filter: {
          MatchAll: [
            { StructType: '0x2::coin::Coin' },
            { AddressOwner: account.address }
          ]
        }
      });

      const coinsData = await Promise.all(
        allObjects.data.map(async (obj) => {
          const coinObject = obj.data;
          if (!coinObject) return null;
          
          const coinType = (coinObject.type as string).replace('0x2::coin::Coin<', '').replace('>', '');
          const balance = (coinObject.content as any).fields.balance;

          try {
            const metaData = await getCoinMetadata(coinType);
            if (!metaData) return null
            const bal = metaData 
              ? formatBalance(balance, metaData.decimals)
              : balance;
            
            return {
              ...(metaData || {}),
              balance: bal,
              coinType,
              originBalance: balance,
              objectId: obj.data?.objectId,
              verified: !!metaData
            };
          } catch (error) {
            return {
              balance,
              coinType,
              originBalance: balance,
              objectId: obj.data?.objectId,
              verified: false
            };
          }
        })
      );
      console.log(coinsData)

      setCoins(coinsData.filter(Boolean));
    } catch (error) {
      console.error('Error fetching coins:', error);
    }
  };

  useEffect(() => {
    if (data && account) {
      const accountData = data.data.find((item) => (item.parsedJson as any).owner === account.address)
      if (accountData?.parsedJson) {
        getprofile((accountData.parsedJson as any).profile)
      }
      fetchAllCoins()
    }
  }, [data, account])

  if (isPending) {
		return <div>Loading...</div>;
	}

  if(name) {
    return <>
      <ProfileCard name={name} />
      <FileManage profileId={profileId} coins={coins} />
    </>
  }

  return (
    <Container my="2">
      <Heading mb="2">create profile</Heading>

      <Form.Root 
        className="FormRoot"
        onSubmit={(event) => {
          const data = Object.fromEntries(new FormData(event.currentTarget))
          signAndExecuteTransaction({
            transaction: addProfileTx(data.name as string),
            chain: 'sui:testnet'
          }, {
            onSuccess: () => {
              window.alert("success")
              setName(data.name as string)
            },
            onError: (err) => {
              console.log(err)
            }
          })
          event.preventDefault();
        }}
      >
        <Form.Field className="FormField" name="name">
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
            }}
          >
            <Form.Label className="FormLabel">name</Form.Label>
            <Form.Message className="FormMessage" match="valueMissing">
              Please enter your name
            </Form.Message>
          </div>
          <Form.Control asChild>
            <input className="Input" type="text" required />
          </Form.Control>
        </Form.Field>
        <Form.Submit asChild>
          <button className="Button" style={{ marginTop: 10 }}>
            submit
          </button>
        </Form.Submit>
      </Form.Root>
    </Container>
  );
}
