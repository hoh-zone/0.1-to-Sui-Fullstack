// src/page/Game/Game.tsx

import  Sidebar  from "./Components/Up_Part/Sidebar/Sidebar";
import Button from './Components/Down_Part/Button/Button';
import Backpack from './Components/Down_Part/Backpack/Backpack';
import './Game.css'


const Game = () => {

    return(
        <div className="game-container">
            <div className="up-container">
                <div className="Sidebar-container">
                    <Sidebar />
                </div>
            </div>
            <div className="down-container">
                <Button />
                <Backpack />
            </div>
        </div>
    )
}

export default Game;