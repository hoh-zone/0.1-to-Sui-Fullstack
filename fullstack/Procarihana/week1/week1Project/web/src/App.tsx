import './App.css'
import {ConnectButton, useSignAndExecuteTransaction} from "@mysten/dapp-kit"
import "@mysten/dapp-kit/dist/index.css"
import React, {useEffect, useState} from "react";
import {queryState, createProfileTx} from "@/lib/contracts";


function App() {
    // useState 用来管理组件的内部状态
    const [name, setName] = React.useState<string>("")
    const [description, setDescription] = useState("");
    // 创建数据
    const {mutate: signAndExcute} = useSignAndExecuteTransaction();
    // 页面刚启动的时候，获取state 是否由创建，如果没有，就创建profile
    useEffect(() => {
        const fetchState = async () => {
            const state = queryState()
            console.log(state)
        }
        fetchState();
    }, [])

    // 创建数据
    const handleCreateProfile = async () => {
        const tx = await createProfileTx(name, description);
        signAndExcute({
                // transaction 报错，是因为现在有 mysten/dapp-kit.transaction 和 sui.transaction 两套
                // 可以忽略报错，或者把两套的 transaction 升级到同一个版本
                transaction: tx,
                options: {
                    showSuccess: true,
                    showError: true,
                },
            },
            {
                onSuccess: () => {
                    console.log("Profile created");
                },
                onError: (error) => {
                    console.log(error)
                }
            })
        return tx;
    }

    return (
        <div>
            <div className="container mx-auto">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold">Logo</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <ConnectButton/>
                </div>
            </div>
            <div>
                <div className="container mx-auto py-4">
                    <div className="flex flex-col gap-4 max-w-md mx-auto">
                        <input
                            type="text"
                            placeholder="Enter your name..."
                            className="px-4 py-2 rounded-md border border-border bg-background text-foreground"
                            // 读入输入的值
                            value={name}
                            // 值改变的时候就会存储到 function上面
                            onChange={(e) => setName(e.target.value)}
                        />
                        <textarea
                            placeholder="Enter bio..."
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="px-4 py-2 rounded-md border border-border bg-background text-foreground resize-none"
                        />
                        <button
                            onClick={handleCreateProfile}
                            className="px-4 py-2 rounded-md  bg-primary text-primary-foreground hover:bg-primary/90
                        transition-colors">
                            create profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App
