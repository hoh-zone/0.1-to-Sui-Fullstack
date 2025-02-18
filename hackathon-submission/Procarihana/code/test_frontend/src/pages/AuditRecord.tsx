import {useCurrentAccount, useSignAndExecuteTransaction} from "@mysten/dapp-kit";
import {useState} from "react";
import {networkConfig} from "@/networkConfig.ts";
import {SUI_SYSTEM_STATE_OBJECT_ID} from "@mysten/sui/utils";
import {Transaction} from "@mysten/sui/transactions";

const AduitRecord = () => {
    const {mutate: signAndExecute} = useSignAndExecuteTransaction();
    const currentUser = useCurrentAccount();
    const [auditRemark, setAuditRemark] = useState('');
    const [auditResult, setAuditResult] = useState(false);
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
        // 平台-审核上传的回访记录
    public entry fun audit_record(contract_id: ID,
                                  contracts: &mut AdoptContracts,
                                  // 审核结果：true-通过；false-不通过
                                  audit_result: bool,
                                  // 审核备注
                                  audit_remark: String,
                                  system_state: &mut SuiSystemState,
                                  ctx: &mut TxContext)
    )
 */
            tx.moveCall({
                package: networkConfig.testnet.packageID,
                module: "apply_for_adoption",
                function: "audit_record",
                arguments: [
                    tx.pure.id(contractId),
                    tx.object(networkConfig.testnet.adoptContracts),
                    tx.pure.bool(auditResult),
                    tx.pure.string(auditRemark),
                    tx.object(SUI_SYSTEM_STATE_OBJECT_ID)
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
                        <label htmlFor="auditResult"
                               className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            auditResult
                        </label>
                        <input
                            id="auditResult"
                            type="checkbox"
                            checked={auditResult} // Assuming auditResult is a boolean state
                            onChange={(e) => setAuditResult(e.target.checked)} // Update state with checked value
                            className="h-4 w-4"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="auditRemark"
                               className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            auditRemark
                        </label>
                        <input
                            id="auditRemark"
                            type="text"
                            placeholder="Enter auditRemark"
                            value={auditRemark}
                            onChange={(e) => setAuditRemark(e.target.value)}
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
export default AduitRecord;
