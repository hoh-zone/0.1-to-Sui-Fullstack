// src/page/Login/Components/Logo/Logo.tsx

import { useNavigate } from "react-router-dom";
import './Logo.css';

const Logo = () => {
    const navigate = useNavigate();
    return(
        <div>
            <img className="logo" src='../../../public/logo.png' alt='logo' onClick={() => navigate("/")}/>
        </div>
    )
};

export default Logo;