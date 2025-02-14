import React, { useState, useEffect } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { networkConfig, suiClient } from "../config/networkConfig";

const AddContent: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
    const currentAccount = useCurrentAccount();
    const { mutateAsync: signAndExecute, isError } = useSignAndExecuteTransaction();
    const PackageId = networkConfig.testnet.packageID;
    const [options, setOptions] = useState([]); // 用于存储可选项
    const [selectedObjectId, setSelectedObjectId] = useState(null);
    const [money, setMoney] = useState(''); // 用户输入的花销
    const [description, setDescription] = useState(''); // 用户输入的用途描述
    const [accountDetails, setAccountDetails] = useState([]); // 存储账单详情

    const fetchUserAccountBooks = async () => {
        if (!currentAccount?.address) {
            console.error("No connected account found.");
            return;
        }

        try {
            const books_id = await suiClient.getObject({
                id: networkConfig.testnet.booksID,
                options: { showContent: true }
            });

            const books_id_fields = books_id.data.content.fields.books.fields.id['id'];
            const books_fields = await suiClient.getDynamicFields({ parentId: books_id_fields });
            const foundItem = books_fields.data.find(item => item.name.value === currentAccount.address);
            const user_account_books_id = foundItem ? foundItem.objectId : null;

            const user_account_books_id_fields = await suiClient.getObject({
                id: user_account_books_id,
                options: { showContent: true }
            });

            const availableOptions = user_account_books_id_fields.data.content.fields.value.map((item, index) => ({
                key: index,
                value: item
            }));

            setOptions(availableOptions);
        } catch (error) {
            console.error("Error fetching account books:", error);
        }
    };

    const getAccountDetails = async () => {
        if (!selectedObjectId) {
            alert('请选择账本');
            return;
        }

        try {
            const account_details = await suiClient.getObject({
                id: selectedObjectId,
                options: { showContent: true },
            }) as any;

            const contents = account_details.data.content.fields.content;
            console.log(contents);
            setAccountDetails(contents);
        } catch (error) {
            console.error("Error getting account details:", error);
        }
    };

    const handleSelectChange = (event: any) => setSelectedObjectId(event.target.value);
    const handleMoneyChange = (event: any) => setMoney(event.target.value);
    const handleDescriptionChange = (event: any) => setDescription(event.target.value);

    const handleSubmit = async () => {
        if (!selectedObjectId || !money || !description) {
            alert('请填写所有字段');
            return;
        }

        const datetime = new Date().toISOString();

        try {
            const tx = new Transaction();
            tx.setGasBudget(10000000);
            tx.moveCall({
                package: PackageId,
                module: "stellar",
                function: "add_content",
                arguments: [
                    tx.object(selectedObjectId),
                    tx.pure.string(datetime),
                    tx.pure.u64(money),
                    tx.pure.string(description),
                ],
            });
            const result = await signAndExecute({ transaction: tx });
            if (result && !isError) onSuccess();
        } catch (error) {
            console.error("Error executing transaction:", error);
        }
    };

    useEffect(() => {
        fetchUserAccountBooks();
    }, []);

    return (
      <div>
        <h3>请选择一个账本:</h3>
        <select value={selectedObjectId} onChange={handleSelectChange}>
          <option value="">--请选择--</option>
          {options.map((option) => (
            <option key={option.key} value={option.value}>
              {option.value}
            </option>
          ))}
        </select>

        <div>
          <label htmlFor="money">花销:</label>
          <input
            type="text"
            id="money"
            value={money}
            onChange={handleMoneyChange}
          />
        </div>

        <div>
          <label htmlFor="description">用途描述:</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={handleDescriptionChange}
          />
        </div>

        <div style={{marginTop:"3%"}}>
          <button
            onClick={handleSubmit}
            className="button-text"
            style={{ marginRight: "5%" }}
          >
            添加记录
          </button>
          <button
            onClick={getAccountDetails}
            className="button-text"
            style={{ marginRight: "5%" }}
          >
            获取账单详情
          </button>
          <button
            onClick={() => fetchUserAccountBooks()}
            className="button-text"
          >
            刷新账本列表
          </button>
        </div>

        {/* 账单详情表格 */}
        {accountDetails.length > 0 && (
          <table>
            <thead>
              <tr>
                <th style={{ border: '1px solid black', padding: '8px' }}>序号</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>时间</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>开销</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>用途描述</th>
              </tr>
            </thead>
            <tbody>
              {accountDetails.map((detail, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{index + 1}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{detail.fields.dateTime}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{detail.fields.money}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{detail.fields.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
};

export default AddContent;