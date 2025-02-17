// src/Components/Login/Login.ts

import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Logo from '../../assets/Logo/Logo';
import LoginBox from './Components/Login_Box/LoginBox';
import { queryGiftBag } from "../../data/query";
import { CreateBag } from "../../interaction/CreateBag.ts"

const Login = () => {
    const account = useCurrentAccount();
    const userAddress = account?.address;

    const navigate = useNavigate();
    const {mutate: signAndExecute} = useSignAndExecuteTransaction();

    // 创建 GiftBag 函数
    const handCreateBag = () => {
        const tx = CreateBag();
        signAndExecute({
            transaction: tx
        }, {
            onSuccess: () => {
            console.log("Create GiftBag Success!");
            },
            onError: (error) => {
            console.log(error);
            }
        });

    };


    useEffect(() => {
        const checkGiftBag = async () => {
            if (userAddress) {
                const giftBag = await queryGiftBag(userAddress); 
                if (giftBag) {
                    navigate('/game');
                } else {
                    handCreateBag();
                }
            }
        };

        checkGiftBag();

    }, [userAddress, navigate]);

    return (
        <div>
            <Logo />
            {!userAddress && <LoginBox />}
        </div>
    );
};

export default Login;