'use client'

import {useContext} from "react";
import {Register, Resource} from "@/components"
import {ResourceContext} from "@/contexts";

export default function Home() {
    const [resource] = useContext(ResourceContext);

    return (
        <>
            {!resource?.profile ? <Register /> : <Resource />}
        </>
    );
}