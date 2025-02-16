"use client";

import { useState } from "react";
import { Cat, Dog } from "lucide-react"

import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group"

export default function Filter({
    searchCallback
}: {
    searchCallback: (searchType: string) => void
}) {
    const [searchType, setSearchType] = useState("");
    return <div>
        <ToggleGroup type="single" defaultValue={""} value={searchType} onValueChange={(value) => {
            setSearchType(value);
            searchCallback(value);
        }}>
            <ToggleGroupItem value="dog" aria-label="Toggle dog">
                <Dog className="h-4 w-4" />狗狗
            </ToggleGroupItem>
            <ToggleGroupItem value="cat" aria-label="Toggle cat">
                <Cat className="h-4 w-4" />猫咪
            </ToggleGroupItem>
        </ToggleGroup>
    </div>
}