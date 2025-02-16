import { useCurrentAccount } from "@mysten/dapp-kit";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserProfile } from "./lib/contracts";
import { CategorizedObjects, calculateTotalBalance, formatBalance } from "./utils/assetsHelpers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Coins, Package } from "lucide-react";

export function WalletStatus() {
    const account = useCurrentAccount();
    const [userObjects, setUserObjects] = useState<CategorizedObjects | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchUserProfile() {
            if (!account?.address) return;
            
            setIsLoading(true);
            setError(null);
            
            try {
                console.log("Fetching data for address:", account.address);
                const profile = await getUserProfile(account.address);
                console.log("Received profile data:", profile);
                setUserObjects(profile);
            } catch (err) {
                console.error('Error fetching user profile:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch user profile');
            } finally {
                setIsLoading(false);
            }
        }

        fetchUserProfile();
    }, [account?.address]);

    return (
        <div className="container mx-auto py-8">
            <Card className="max-w-6xl mx-auto">
                <CardHeader>
                    <CardTitle>Wallet Status</CardTitle>
                    {account && (
                        <CardDescription className="break-all">
                            Connected Address: {account.address}
                        </CardDescription>
                    )}
                </CardHeader>
                <CardContent>
                    {account ? (
                        <div className="space-y-6">
                            {error ? (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            ) : isLoading ? (
                                <div className="space-y-4">
                                    <Skeleton className="h-[125px] w-full" />
                                    <Skeleton className="h-[125px] w-full" />
                                </div>
                            ) : userObjects ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Coins Section */}
                                    <Card>
                                        <CardHeader className="pb-4">
                                            <div className="flex items-center space-x-2">
                                                <Coins className="h-5 w-5" />
                                                <CardTitle className="text-xl">Coins</CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <ScrollArea className="h-[400px] pr-4">
                                                <div className="space-y-4">
                                                    {Object.keys(userObjects.coins).length === 0 ? (
                                                        <p className="text-muted-foreground">No coins found</p>
                                                    ) : (
                                                        Object.entries(userObjects.coins).map(([coinType, coins]) => {
                                                            const totalBalance = calculateTotalBalance(coins);
                                                            return (
                                                                <Card key={coinType}>
                                                                    <CardContent className="p-4">
                                                                        <div className="flex justify-between items-start">
                                                                            <div>
                                                                                <h4 className="font-medium">
                                                                                    {coinType.split('::').pop()}
                                                                                </h4>
                                                                                <div className="mt-1 space-y-1">
                                                                                    <p className="text-sm text-muted-foreground">
                                                                                        Quantity: {coins.length}
                                                                                    </p>
                                                                                    <p className="text-sm font-medium">
                                                                                        Balance: {formatBalance(totalBalance)}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                            <Badge variant="secondary">
                                                                                Coin
                                                                            </Badge>
                                                                        </div>
                                                                    </CardContent>
                                                                </Card>
                                                            );
                                                        })
                                                    )}
                                                </div>
                                            </ScrollArea>
                                        </CardContent>
                                    </Card>

                                    {/* Objects Section */}
                                    <Card>
                                        <CardHeader className="pb-4">
                                            <div className="flex items-center space-x-2">
                                                <Package className="h-5 w-5" />
                                                <CardTitle className="text-xl">Other Objects</CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <ScrollArea className="h-[400px] pr-4">
                                                <div className="space-y-4">
                                                    {Object.keys(userObjects.objects).length === 0 ? (
                                                        <p className="text-muted-foreground">No objects found</p>
                                                    ) : (
                                                        Object.entries(userObjects.objects).map(([objectType, objects]) => (
                                                            <Card key={objectType}>
                                                                <CardContent className="p-4">
                                                                    <div className="flex justify-between items-start">
                                                                        <div>
                                                                            <h4 className="font-medium">
                                                                                {objectType.split('::').pop()}
                                                                            </h4>
                                                                            <div className="mt-1 space-y-1">
                                                                                <p className="text-sm text-muted-foreground">
                                                                                    Quantity: {objects.length}
                                                                                </p>
                                                                                <p className="text-sm text-muted-foreground">
                                                                                    Package: {objectType.split('::')[0]}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        <Badge>
                                                                            Object
                                                                        </Badge>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        ))
                                                    )}
                                                </div>
                                            </ScrollArea>
                                        </CardContent>
                                    </Card>
                                </div>
                            ) : (
                                <Alert>
                                    <AlertDescription>No data available</AlertDescription>
                                </Alert>
                            )}

                            <Link to="/" className="block">
                                <Button variant="outline" className="w-full">
                                    Back to Home
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <Alert>
                            <AlertDescription>Wallet not connected</AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
