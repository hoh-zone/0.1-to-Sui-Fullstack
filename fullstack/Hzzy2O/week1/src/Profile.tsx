import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClientQuery } from "@mysten/dapp-kit";
import { Container, Heading } from "@radix-ui/themes";
import * as Form from "@radix-ui/react-form";
import { addProfileTx } from "./contract";
import { client, networkConfig } from "./networkConfig";
import { useEffect, useState } from "react";

export function Profile() {
  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction()
  const [name, setName] = useState("");

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
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }
  useEffect(() => {
    if (data && account) {
      const accountData = data.data.find((item) => (item.parsedJson as any).owner === account.address)
      if (accountData?.parsedJson) {
        getprofile((accountData.parsedJson as any).profile)
      }
    }
  }, [data, account])

  if (isPending) {
		return <div>Loading...</div>;
	}

  if(name) {
    return <div>your name is: {name}</div>
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
