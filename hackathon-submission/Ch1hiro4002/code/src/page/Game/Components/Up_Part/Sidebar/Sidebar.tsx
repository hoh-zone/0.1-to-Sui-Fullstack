import { useState } from 'react';
import { useUser } from '../../../../../context/UserContext';
import './Sidebar.css';

const Sidebar = () => {
    const [isOpened, setIsOpened] = useState(false);
    const { userInfo } = useUser();

    return (
        <div className={`sidebar ${isOpened ? '' : 'collapsed'}`}>
            {isOpened ? (
                <>
                    {/* 侧边栏顶部图片 */}
                    <div className="sidebar-header">
                        {userInfo.avatar && (
                            <img
                                src={URL.createObjectURL(userInfo.avatar)}
                                alt="Profile"
                                className="profile-image"
                            />
                        )}
                    </div>

                    {/* 个人信息 */}
                    <div className="sidebar-content">
                        <h3>{userInfo.name || '用户名'}</h3>
                        <p>年龄：{userInfo.age || '未填写'}</p>
                        <p>性格：{userInfo.personality || '未填写'}</p>
                        <p>学历：{userInfo.education || '未填写'}</p>
                        <p>外貌特征：{userInfo.appearance || '未填写'}</p>
                        <p>家庭背景：{userInfo.familyBackground || '未填写'}</p>
                        <p>经济情况：{userInfo.wealth || '未填写'}</p>
                    </div>
                </>
            ) : (
                <div className="collapsed-text">个人信息</div>
            )}

            {/* 隐藏/显示按钮 */}
            <button
                className="toggle-button"
                onClick={() => setIsOpened(!isOpened)}
            >
                {isOpened ? '<' : '>'}
            </button>
        </div>
    );
};

export default Sidebar;