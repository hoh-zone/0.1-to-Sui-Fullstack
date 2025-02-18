import {useCurrentAccount, useSignAndExecuteTransaction} from "@mysten/dapp-kit";
import {useState} from "react";
import {networkConfig} from "@/networkConfig.ts";
import {SUI_CLOCK_OBJECT_ID} from "@mysten/sui/utils";
import {Transaction} from "@mysten/sui/transactions";

const UploadRecord = () => {
    const {mutate: signAndExecute} = useSignAndExecuteTransaction();
    const currentUser = useCurrentAccount();
    const [pic, setPic] = useState('');
    const [contractId, setContractId] = useState('');
    const handleSignContract = async () => {
        debugger

        if (!currentUser) {
            console.error("User not logged in");
            return;
        }
        try {
            const tx = new Transaction();
            /*
            上传打卡记录
    public entry fun upload_record(
        contract_id: ID,
        contracts: &mut AdoptContracts,
        pic: String,
        clock: &Clock,
        ctx: &mut TxContext,
    )
 */
            tx.moveCall({
                package: networkConfig.testnet.packageID,
                module: "apply_for_adoption",
                function: "upload_record",
                arguments: [
                    tx.pure.id(contractId),
                    tx.object(networkConfig.testnet.adoptContracts),
                    tx.pure.string(pic),
                    tx.object(SUI_CLOCK_OBJECT_ID)
                ]
            })
            signAndExecute({
                transaction: tx
            }, {
                onSuccess: async (tx) => {
                    debugger
                    tx.signature

                },
                onError: (error) => {
                    debugger
                    console.log(error);
                }
            });
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="flex flex-col items-center justify-center border-2 border-gray-200 p-4 rounded-md">
            <div className="w-full max-w-md space-y-6">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold tracking-tighter">Sign Contract</h1>
                    <p className="text-muted-foreground">
                        Enter contract info
                    </p>
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="contractId"
                               className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            contractId
                        </label>
                        <input
                            id="contractId"
                            type="text"
                            placeholder="Enter contractId"
                            value={contractId}
                            onChange={(e) => setContractId(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="pic"
                               className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            pic
                        </label>
                        <input
                            id="pic"
                            type="text"
                            placeholder="Enter pic"
                            value={pic}
                            onChange={(e) => setPic(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                    <button
                        onClick={handleSignContract}
                        className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                    >
                        Sign Contract
                    </button>
                </div>
            </div>
        </div>
    );
}
export default UploadRecord;
