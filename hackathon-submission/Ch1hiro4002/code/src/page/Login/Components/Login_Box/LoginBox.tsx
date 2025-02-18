import { ConnectButton } from "@mysten/dapp-kit";
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { useState, useRef, useEffect } from "react";
import { FaCopy } from 'react-icons/fa'; 
import './LoginBox.css'; 

const LoginBox = () => {
    const switchCtn = useRef<HTMLDivElement>(null);
    const switchC1 = useRef<HTMLDivElement>(null);
    const switchC2 = useRef<HTMLDivElement>(null);
    const aContainer = useRef<HTMLDivElement>(null);
    const bContainer = useRef<HTMLDivElement>(null);
    const switchCircle = useRef<NodeListOf<Element>>();


    const [walletInfo, setWalletInfo] = useState({ address: '', privateKey: '' });
    const [showModal, setShowModal] = useState(false);

    const createWallet = () => {
        const keypair = new Ed25519Keypair();
        const address = keypair.getPublicKey().toSuiAddress();
        const privateKey = keypair.getSecretKey();

        setWalletInfo({ address, privateKey });
        setShowModal(true);

    };

    const copyPrivateKey = () => {
        navigator.clipboard.writeText(walletInfo.privateKey)
            .then(() => alert('Private key copied to clipboard!'))
            .catch(() => alert('Copying failed, please copy the mnemonic phrase manually.'));
    };

    const copyAddress = () => {
        navigator.clipboard.writeText(walletInfo.address)
            .then(() => alert('The address has been copied to the clipboard!'))
            .catch(() => alert('Copy failed, please copy the address manually.'));
    };

    useEffect(() => {
        switchCircle.current = document.querySelectorAll(".switch__circle");
        const allButtons = document.querySelectorAll(".submit");
        const switchBtn = document.querySelectorAll(".switch-btn");

        const getButtons = (e: Event) => e.preventDefault();
        const changeForm = () => {
            switchCtn.current?.classList.add("is-gx");
            setTimeout(() => {
                switchCtn.current?.classList.remove("is-gx");
            }, 1500);

            switchCtn.current?.classList.toggle("is-txr");
            switchCircle.current?.forEach(circle => {
                circle.classList.toggle("is-txr");
            });

            switchC1.current?.classList.toggle("is-hidden");
            switchC2.current?.classList.toggle("is-hidden");
            aContainer.current?.classList.toggle("is-txl");
            bContainer.current?.classList.toggle("is-txl");
            bContainer.current?.classList.toggle("is-z");
        };

        allButtons.forEach(btn => btn.addEventListener("click", getButtons));
        switchBtn.forEach(btn => btn.addEventListener("click", changeForm));

        return () => {
            allButtons.forEach(btn => btn.removeEventListener("click", getButtons));
            switchBtn.forEach(btn => btn.removeEventListener("click", changeForm));
        };
    }, []);

    return (
        <div className="login-box">
            <div className="container a-container" id="a-container" ref={aContainer}>
                <form className="form" id="a-form">
                    <h2 className="title a-title">Create Wallet</h2>
                    <button type="button" className="button" onClick={createWallet}>Create Wallet</button>
                </form>
            </div>

            <div className="container b-container" id="b-container" ref={bContainer}>
                <form className="form" id="b-form">
                    <h2 className="title b-title">Connect Wallet</h2>
                    <p>Click the button to start your dating journey !<br/></p>
                    <ConnectButton />
                </form>
            </div>

            <div className="switch" id="switch-cnt" ref={switchCtn}>
                <div className="switch__circle"></div>
                <div className="switch__circle switch__circle-t"></div>
                <div className="switch__container" id="switch-c1" ref={switchC1}>
                    <h2 className="switch__title title" style={{letterSpacing: 0}}>Welcome Back !</h2>
                    <p className="switch__description description">You already have the wallet, go and connect it !</p>
                    <button className="switch__button button switch-btn">Connect Wallet</button>
                </div>
                <div className="switch__container is-hidden" id="switch-c2" ref={switchC2}>
                    <h2 className="switch__title title" style={{letterSpacing: 0}}>Hello Friend !</h2>
                    <p className="switch__description description">If you don’t have a wallet yet, create one !</p>
                    <button className="switch__button button switch-btn">Create Wallet</button>
                </div>
            </div>
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content-a">
                        <h3>Wallet created successfully!</h3>
                        <p>
                            Address：{walletInfo.address}
                            <button onClick={() => { copyAddress() }} className="icon-button">
                                <FaCopy />
                            </button>
                        </p>
                        <p>
                            PrivateKey：{walletInfo.privateKey.replace(/./g,'*')}
                            <button onClick={() => { copyPrivateKey() }} className="icon-button">
                                <FaCopy />
                            </button>
                        </p>
                        <p style={{ color: 'red' }}>
                        Please keep your private key properly and do not disclose it!</p>
                        <button onClick={() => { setShowModal(false) }}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginBox;