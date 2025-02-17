import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaQuestionCircle, FaShoppingCart, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { useUser } from '../../../../../context/UserContext';
import { BuyGift } from "../../../../../interaction/BuyGift";
import './Button.css';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { queryGiftBag } from "../../../../../data/query"

const Button = () => {
    const navigate = useNavigate();
    const { userInfo, setUserInfo } = useUser();
    const [showShopModal, setShowShopModal] = useState(false);
    const [showUserModal, setShowUserModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showLogout, setShowLogout] = useState(false);
    const {mutate: signAndExecute} = useSignAndExecuteTransaction();
    const account = useCurrentAccount();
    const userAddress = account?.address;

    // 退出按钮触发
    useEffect(() => {
        if (showLogout) {
            navigate('/');
        }
    }, [showLogout]);

    // 购买礼物函数
    const handleBuyGift  = async (name: string, description: string, image_url: string, data: any, giftBag: any, price: number) => {
        const tx = await BuyGift(
            name,
            description,
            image_url,
            data,
            giftBag,
            price
        );
        signAndExecute({
          transaction: tx
        }, {
          onSuccess: () => {
            alert("Buy Gift Success!");
            console.log("Buy Gift Success!");
          },
          onError: (error) => {
            console.log(error);
          }
        });
    };

    return (
        <div className='action-button'>
            <div className="button-group">
                <button
                    type="button"
                    className="ac-button"
                    onClick={() => { setShowShopModal(true) }}
                >
                    <FaShoppingCart /> Store
                </button>
                <button
                    type="button"
                    className="ac-button"
                    onClick={() => { setShowUserModal(true) }}
                >
                    <FaUser /> Profile
                </button>
            </div>
            <div className="button-group">
                <button
                    type="button"
                    className="ac-button"
                >
                    <FaQuestionCircle /> Help
                </button>
                <button
                    type="button"
                    className="ac-button"
                    onClick={() => { setShowLogout(true) }}
                >
                    <FaSignOutAlt /> Exit
                </button>
            </div>

            {/* 商店弹窗 */}
            {showShopModal && (
                <div className="shop-modal-overlay">
                    <div className="shop-modal-content">
                        <h2>Store</h2>
                        <div className="shop-items">
                            {/* 商品列表 */}
                            <div className="shop-item">
                                <img src="roses.jpg" alt="Roses" />
                                <p>Roses<br/>0.5 SUI</p>
                                <button onClick={async () => handleBuyGift(
                                    "roses",
                                    "A romantic bouquet of roses!",
                                    "https://aggregator.walrus-testnet.walrus.space/v1/blobs/giFVw26yqGNSOZ-wS8qOO5uX9cSPFsGySLMjGmdQ7WM",
                                    10,
                                    await queryGiftBag(userAddress as string),
                                    0.5
                                ) }>Buy</button>
                            </div>
                            <div className="shop-item">
                                <img src="love_letter.jpg" alt="Loveletter" />
                                <p>Loveletter<br/>0.5 SUI</p>
                                <button onClick={async () => handleBuyGift(
                                    "loveletter",
                                    "A love letter full of love!",
                                    "https://aggregator.walrus-testnet.walrus.space/v1/blobs/Ou99Ya88iG1E1Gi4QEL2LYhitjrBGNdgbBHGP-rYoPo",
                                    15,
                                    await queryGiftBag(userAddress as string),
                                    0.5
                                )}>Buy</button>
                            </div>
                            <div className="shop-item">
                                <img src="necklace.jpg" alt="necklace" />
                                <p>necklace<br/>5 SUI</p>
                                <button onClick={async () => handleBuyGift(
                                    "necklace",
                                    "A sapphire necklace!",
                                    "https://aggregator.walrus-testnet.walrus.space/v1/blobs/Zbf5lCCuOBDP-deV5hIuB3sRLuQ38DdCyzn2B0_hLJU",
                                    45,
                                    await queryGiftBag(userAddress as string),
                                    5
                                )}>Buy</button>
                            </div>
                            <div className="shop-item">
                                <img src="tickets.jpg" alt="tickets" />
                                <p>tickets<br/>1 SUI</p>
                                <button onClick={async () => handleBuyGift(
                                    "tickets",
                                    "Two movie tickets for Titanic!",
                                    "https://aggregator.walrus-testnet.walrus.space/v1/blobs/nwMAQo70Yns65Nvrzcu-Jvhafqlt--R6vErYPe1-8Us",
                                    25,
                                    await queryGiftBag(userAddress as string),
                                    1
                                )}>Buy</button>
                            </div>
                        </div>
                        <button
                            className="close-button"
                            onClick={() => setShowShopModal(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* 个人信息弹窗 */}
            {showUserModal && (
                <div className="user-modal-overlay">
                    <div className="user-modal-content">
                        <h2>Profile</h2>
                        <div className="user-info">
                            {isEditing ? (
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    setIsEditing(false);
                                }}>
                                    <div>
                                        <label>Name：</label>
                                        <input
                                            type="text"
                                            value={userInfo.name}
                                            onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label>Age：</label>
                                        <input
                                            type="text"
                                            value={userInfo.age}
                                            onChange={(e) => setUserInfo({ ...userInfo, age: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label>Disposition：</label>
                                        <input
                                            type="text"
                                            value={userInfo.personality}
                                            onChange={(e) => setUserInfo({ ...userInfo, personality: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label>Degree：</label>
                                        <input
                                            type="text"
                                            value={userInfo.education}
                                            onChange={(e) => setUserInfo({ ...userInfo, education: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label>Appearance：</label>
                                        <input
                                            type="text"
                                            value={userInfo.appearance}
                                            onChange={(e) => setUserInfo({ ...userInfo, appearance: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label>Background：</label>
                                        <input
                                            type="text"
                                            value={userInfo.familyBackground}
                                            onChange={(e) => setUserInfo({ ...userInfo, familyBackground: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label>Finances：</label>
                                        <input
                                            type="text"
                                            value={userInfo.wealth}
                                            onChange={(e) => setUserInfo({ ...userInfo, wealth: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label>Avatar：</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    setUserInfo({ ...userInfo, avatar: e.target.files[0] });
                                                }
                                            }}
                                        />
                                    </div>
                                    <button type="submit" className='save-button'>Save</button>
                                </form>
                            ) : (
                                <>
                                    {userInfo.avatar && (
                                        <img
                                            src={URL.createObjectURL(userInfo.avatar)}
                                            alt="Avatar"
                                            className="user-avatar"
                                        />
                                    )}
                                    <p><strong>Name：</strong>{userInfo.name || 'NULL'}</p>
                                    <p><strong>Age：</strong>{userInfo.age || 'NULL'}</p>
                                    <p><strong>Disposition：</strong>{userInfo.personality || 'NULL'}</p>
                                    <p><strong>Degree：</strong>{userInfo.education || 'NULL'}</p>
                                    <p><strong>Appearance：</strong>{userInfo.appearance || 'NULL'}</p>
                                    <p><strong>Background：</strong>{userInfo.familyBackground || 'NULL'}</p>
                                    <p><strong>Finances：</strong>{userInfo.wealth || 'NULL'}</p>
                                </>
                            )}
                        </div>
                        <div className="modal-buttons">
                            <button
                                className="edit-button"
                                onClick={() => setIsEditing(!isEditing)}
                            >
                                {isEditing ? 'Cancel' : 'Revise'}
                            </button>
                            <button
                                className="close-button"
                                onClick={() => setShowUserModal(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Button;