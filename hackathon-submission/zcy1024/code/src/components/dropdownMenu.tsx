'use client'

import {ReactNode} from "react";

export type MenuItemType = {
    label: string,
    handleClick: () => Promise<void> | void
}

export default function DropdownMenu({props, children}: {props: MenuItemType[], children: ReactNode}) {
    return (
        <div className="relative group z-10">
            {children}
            <div className="flex flex-col gap-3 items-center absolute w-full mt-3 text-[#A0A0A0] invisible opacity-0 group-hover:visible group-hover:opacity-100 duration-500">
                {
                    props.map((item, index) => <div className="cursor-pointer" key={index} onClick={item.handleClick}>{item.label}</div>)
                }
            </div>
        </div>
    )
}