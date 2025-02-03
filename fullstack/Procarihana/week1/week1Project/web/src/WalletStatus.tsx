import {useCurrentAccount} from "@mysten/dapp-kit";
import {Container, Flex, Heading, Text} from "@radix-ui/themes";
import {OwnedObjects} from "@/OwnedObjects.tsx";

export function WalletStatus() {
    const currentAccount = useCurrentAccount();
    return (
        <Container my="2">
            <Heading mb="2">Wallet status</Heading>
            {currentAccount ? (
                <Flex direction="column">
                    <Text> Wallet connected </Text>
                    <Text>Address: {currentAccount.address}</Text>
                </Flex>
            ) : (
                <Text>Wallet not conneccted</Text>
            )}
            <OwnedObjects/>
        </Container>
    )
}