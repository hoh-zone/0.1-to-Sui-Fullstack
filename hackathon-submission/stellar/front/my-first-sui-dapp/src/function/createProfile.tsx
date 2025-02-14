import React, { useState } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { networkConfig } from "../config/networkConfig";

const CreateProfile: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
    const currentAccount = useCurrentAccount();
    const { mutateAsync: signAndExecute, isError } = useSignAndExecuteTransaction();
    const PackageId = networkConfig.testnet.packageID;
    const [loading, setLoading] = useState(false);
    const [userName, setUserName] = useState(''); // 新增状态变量

    const create = async () => {
        if (!currentAccount?.address) {
            console.error("No connected account found.");
            return;
        }

        try {
            setLoading(true);

            const tx = new Transaction();
            tx.setGasBudget(10000000);

            tx.moveCall({
                package: PackageId,
                module: "stellar",
                function: "create_profile",
                arguments: [
                    tx.pure.string(userName), // 使用状态变量
                    tx.object(networkConfig.testnet.stateID),
                    tx.object(networkConfig.testnet.booksID),
                ],
            });

            const result = await signAndExecute({ transaction: tx });

            if (result && !isError) {
                onSuccess();
            }
        } catch (error) {
            console.error("Error creating profile:", error);
        } finally {
            setLoading(false); // 确保加载状态在请求完成后被重置
        }
    };

    return (
        <div>
            <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)} // 绑定输入事件
                placeholder="Enter your username"
                className="input-text"
            />
            <button
                onClick={create}
                className="button-text"
                disabled={!userName || loading} // 禁用按钮直到输入了用户名且不在加载状态
            >
                Create Profile
            </button>
        </div>
    );
};

export default CreateProfile;