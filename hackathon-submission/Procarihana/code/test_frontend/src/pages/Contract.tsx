import {useCurrentAccount, useSignAndExecuteTransaction} from "@mysten/dapp-kit";
import {useEffect, useState} from "react";
import {createAdoptContract} from "@/lib/contracts";
import {suiClient} from "@/networkConfig.ts";
import { toast } from "@/components/ui/use-toast";

const Contract = () => {
    const {mutate: signAndExecute} = useSignAndExecuteTransaction();
    const currentUser = useCurrentAccount();

    const [xId, setXId] = useState('');
    const [animalId, setAnimalId] = useState('');
    const [amount, setAmount] = useState(0);
    const [recordTimes, setRecordTimes] = useState(0);
    const [donateAmount, setDonateAmount] = useState(0);

    const handleCreateContract = async () => {
        debugger
        if (!currentUser) {
            console.error("User not logged in");
            return;
        }
        try {
            const tx = await createAdoptContract(xId, animalId, amount, currentUser.address, recordTimes, donateAmount);
            signAndExecute({
                transaction: tx
            }, {
                onSuccess: async (tx) => {
                    debugger
                    tx.signature
                    toast({
                        title: "创建合约成功",
                        description: "成功",
                    });
                    // await suiClient.waitForTransaction({
                    //     digest: tx.digest
                    // });
                },
                onError: (error) => {
                    debugger
                    toast({
                        title: "Failed to create contract",
                        description: error,
                        variant: "destructive",
                    });
                    console.log(error);
                }
            });
        } catch (error) {
            toast({
                title: "Failed to create contract",
                description: error,
                variant: "destructive",
            });
        }
    };


    return (
        <div className="flex flex-col items-center justify-center border-2 border-gray-200 p-4 rounded-md">
            <div className="w-full max-w-md space-y-6">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold tracking-tighter">Create Contract</h1>
                    <p className="text-muted-foreground">
                        Enter contract info
                    </p>
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="xId"
                               className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            xId
                        </label>
                        <input
                            id="xId"
                            type="text"
                            placeholder="Enter xId"
                            value={xId}
                            onChange={(e) => setXId(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="animalId"
                               className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            animalId
                        </label>
                        <input
                            id="animalId"
                            placeholder="Entry animalId"
                            value={animalId}
                            onChange={(e) => setAnimalId(e.target.value)}
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="animalId"
                               className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            amount
                        </label>
                        <input
                            id="amount"
                            type="number"
                            placeholder="Entry amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.valueAsNumber)}
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="recordTimes"
                               className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            recordTimes
                        </label>
                        <input
                            id="recordTimes"
                            type="number"
                            placeholder="Entry recordTimes"
                            value={recordTimes}
                            onChange={(e) => setRecordTimes(e.target.valueAsNumber)}
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="donateAmount"
                               className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            donateAmount
                        </label>
                        <input
                            id="donateAmount"
                            type="number"
                            placeholder="Entry donateAmount"
                            value={donateAmount}
                            onChange={(e) => setDonateAmount(e.target.valueAsNumber)}
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                        />
                    </div>
                    <button
                        onClick={handleCreateContract}
                        className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                    >
                        Create Contract
                    </button>
                </div>
            </div>
        </div>
    );
}
export default Contract;
