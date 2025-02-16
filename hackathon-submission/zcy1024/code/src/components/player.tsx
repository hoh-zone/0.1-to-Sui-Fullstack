'use client'

import {useEffect, useState} from "react";

type indexType = [number, number];

export default function Player({areaIndex, playerIndex}: {areaIndex: indexType, playerIndex: indexType}) {
    const [show, setShow] = useState<boolean>(false);
    useEffect(() => {
        setShow(areaIndex[0] === playerIndex[0] && areaIndex[1] === playerIndex[1]);
    }, [areaIndex, playerIndex]);

    return (
        <div className={"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-1000 skew-x-[16deg] " + (show ? "opacity-100" : "opacity-0")}>
            <div className="flex gap-[0.6rem] items-end animate-bounce">
                <div className="border -rotate-45 h-8 animate-borderColor"></div>
                <div className="border mb-1 h-10 animate-borderColor"></div>
                <div className="border rotate-45 h-8 animate-borderColor"></div>
            </div>
        </div>
    )
}