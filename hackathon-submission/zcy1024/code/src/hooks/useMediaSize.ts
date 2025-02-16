'use client'

import {useEffect, useState} from "react";

export default function useMediaSize() {
    const [width, setWidth] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);
    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth)
            setHeight(window.innerHeight)
        };
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return [width, height];
}