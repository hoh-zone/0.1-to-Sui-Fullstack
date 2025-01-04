import React from 'react';
import { ConnectButton } from '@mysten/dapp-kit';
import { Box } from '@radix-ui/themes';
import { useState } from 'react';
import { useCurrentWallet } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
//import { useCu } from '@mysten/sui-react';
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { ImageNFT, TestClient } from './CommonPage';

// import { Client } from "@mysten/sui-core";

interface Info {
    status: string;
    blobId: string;
    endEpoch: number;
    suiRefType: string;
    suiRef: string;
    suiBaseUrl: string;
}

interface Profile {
    name: string;
    description: string;
    // url: string;
}

const Header: React.FC = () => {
    const account = useCurrentAccount();
    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
    const [showModal, setShowModal] = useState(false); // 控制弹窗显示状态
    const [summary, setSummary] = useState(''); // 摘要
    const [epoch, setEpoch] = useState(''); // Epoch
    const { currentWallet, connectionStatus } = useCurrentWallet();
    const [file, setFile] = useState<File | null>(null); // 上传的文件
    const [info, setInfo] = useState<Info | null>(null); // 存储信息
    
    const isWalletConnected = () => {
        if (connectionStatus == 'disconnected') { //=赋值   ==相等   ===严格相等
            return false;
        }
        return true;
    };
    const isShowModal = () => {
        if (isWalletConnected()) {
            setShowModal(true);
        } else {
            alert('Please connect your wallet first');
        }
    }

    const handleSubmit = async (summary:string, epoch:string) => {
        if(summary==''||epoch==''){
            console.log(summary,epoch);
            alert('Please fill in all fields');
            setShowModal(false);
        }else{
            const tx = new Transaction();
            // const account = useCurrentAccount();
            // tx.setSender(account.address);
            tx.moveCall({
                target: "0xe551ce116a4515e0317939e0dfe6debf117c1378bd8f248bf61e432b540760fc::week_one_alt::create_profile",
                arguments: [tx.pure.string(summary), tx.pure.string(epoch), tx.object("0xb7879ae978e0407c7e4c94a0e90410fc1051a3c2476566638567fbc208e5d624")],
            });
            const result = await signAndExecuteTransaction({ transaction: tx, chain: "sui:testnet" },
                {
                  // onSuccess: (result: any) => { // 移除或注释掉
                  //   console.log("Transaction successful:", result);
                  //   setDigest(result.digest);
                  // },
                  onError: (error: any) => { // 为 error 参数指定类型
                    console.error("Transaction failed:", error);
                    // setMessage(error.message || "Transaction failed");
                  },
                });
            // alert(result);
            // console.log(result);
            const state = await TestClient.getObject({
                id: "0xb7879ae978e0407c7e4c94a0e90410fc1051a3c2476566638567fbc208e5d624",
                options: { showContent: true },
              });
              console.log(state);
        }
    };

    const handleCancel = () => {
        setShowModal(false);
    };
    
    return (
        <Box className="allHeader">
            <header className="header">
                <Box className="logo">LHFA</Box>
                <Box className="upload_buttons" style={{ display: 'flex', alignItems: 'center' }}>
                    <button
                        onClick={() => isShowModal()} // 点击按钮显示弹窗
                        style={{
                            padding: '10px 20px',
                            fontSize: '15px',
                            backgroundColor: '#007BFF',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            marginRight: '20px',
                        }}
                    >
                        Upload your issue
                    </button>
                </Box>
                <Box className="connect_buttons">
                    <ConnectButton />
                </Box>
            </header>
            {/* 弹窗 */}
            {showModal && (
                <Box
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                    }}
                >
                    <Box
                        style={{
                            backgroundColor: 'black',
                            padding: '20px',
                            borderRadius: '10px',
                            width: '400px',
                            textAlign: 'center',
                        }}
                    >
                        <h2>数据输入</h2>
                        <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '10px', textAlign: 'left' }}>姓名</td>
                                    <td>
                                        <input
                                            placeholder="请输入姓名"
                                            id="summary"
                                            type="text"
                                            value={summary}
                                            onChange={(e) => setSummary(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '5px',
                                                border: '1px solid #ccc',
                                                borderRadius: '5px',
                                            }}
                                        />
                                    </td>
                                </tr>
                                {/* <tr>
                                    <td style={{ padding: '10px', textAlign: 'left' }}>上传文件</td>
                                    <td>
                                        <input
                                            id="file"
                                            type="file"
                                            onChange={(e) => {
                                                const selectedFile = e.target.files?.[0];
                                                if (selectedFile) {
                                                    setFile(selectedFile);
                                                }
                                            }}
                                            style={{
                                                width: '100%',
                                            }}
                                        />
                                    </td>
                                </tr> */}
                                <tr>
                                    <td style={{ padding: '10px', textAlign: 'left' }}>描述</td>
                                    <td>
                                        <input
                                            id="epoch"
                                            type="text"
                                            value={epoch}
                                            onChange={(e) => setEpoch(e.target.value)} 
                                            /* 在React中，即使将input的type设置为number，onChange事件仍然会返回一个字符串类型的值 */
                                            style={{
                                                width: '100%',
                                                padding: '5px',
                                                border: '1px solid #ccc',
                                                borderRadius: '5px',
                                            }}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <Box style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                            <button
                                onClick={() => handleSubmit(summary, epoch)} // 提交表单
                                style={{
                                    padding: '10px 20px',
                                    fontSize: '14px',
                                    backgroundColor: '#007BFF',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                }}
                            >
                                Submit
                            </button>
                            <button
                                onClick={handleCancel} // 取消按钮
                                style={{
                                    padding: '10px 20px',
                                    fontSize: '14px',
                                    backgroundColor: '#007BFF',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                }}
                            >
                                Cancel
                            </button>
                        </Box>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default Header;
