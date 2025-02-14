import React, { useState } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { networkConfig, suiClient } from "../config/networkConfig";

const CreateAccountBook: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
    const currentAccount = useCurrentAccount();
    const { mutateAsync: signAndExecute, isError } = useSignAndExecuteTransaction();
    const PackageId = networkConfig.testnet.packageID;
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState(''); // 新增状态变量

    const create = async () => {
        if (!currentAccount?.address) {
            console.error("No connected account found.");
            return;
        }

        try {
            setLoading(true);

            const state = await suiClient.getObject({
                id: networkConfig.testnet.stateID,
                options: {
                    showContent: true
                }
            }) as any;
            const state_fields_id = state.data.content.fields.users.fields.id['id'];

            const state_field = await suiClient.getDynamicFields({
                parentId: state_fields_id,
            }) as any;

            const foundItem = state_field.data.find((item: { name: { value: string | undefined; }; }) => item.name.value === currentAccount?.address);
            const profile_id_dynamicFields = foundItem ? foundItem.objectId : null;

            const profield_field = await suiClient.getObject({
                id: profile_id_dynamicFields,
                options: { showContent: true }
            }) as any;

            const profield = profield_field.data.content.fields.value;

            const tx = new Transaction();
            tx.setGasBudget(10000000);

            tx.moveCall({
                package: PackageId,
                module: "stellar",
                function: "Account_Book_create",
                arguments: [
                    tx.object(profield),
                    tx.pure.string(category), // 使用状态变量中的category值
                    tx.object(networkConfig.testnet.booksID),
                ],
            });

            const result = await signAndExecute({ transaction: tx });

            if (result && !isError) {
                onSuccess();
            }
        } catch (error) {
            console.error("Error creating account book:", error);
        } finally {
            setLoading(false); // 确保加载状态在请求完成后被重置
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Enter category"
                value={category}
                onChange={(e) => setCategory(e.target.value)} // 绑定输入事件
                className="input-text"
            />
            <button
                onClick={create}
                className="button-text"
                disabled={!category || loading} // 禁用按钮直到输入了category且不在加载状态
            >
                Create Account Book
            </button>
        </div>
    );
};

export default CreateAccountBook;