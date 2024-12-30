import React, { useEffect, useState } from "@rbxts/react";
import { Layer } from "./layer";
import { Menu } from "./manager-gui";
import { NPCMenu } from "./npc-menu";
import { ClientEvents } from "shared/Events";
import { Players } from "@rbxts/services";
import { IProduct } from "./product-menu";

export function App() {
    const [isNPCMenuVisible, setIsNPCMenuVisible] = useState(false);
    const [products, setProducts] = useState<IProduct[]>([
        { id: 1, name: "Зелье 1", imageUrl: "rbxassetid://13983568527", onClick: () => { } },
        { id: 2, name: "Зелье 2", imageUrl: "rbxassetid://9412229136", onClick: () => { } },
        { id: 3, name: "Зелье 3", imageUrl: "rbxassetid://9412224148", onClick: () => { } },
    ]);

    useEffect(() => {
        const connection = ClientEvents.showNPCMenu.connect((player) => {
            if (player === Players.LocalPlayer) {
                setIsNPCMenuVisible(true);
            }
        });

        return () => {
            connection.Disconnect();
        };
    }, []);

    return (
        <Layer>
            <Menu />
            {isNPCMenuVisible && <NPCMenu isVisible={isNPCMenuVisible} products={products} />}
        </Layer>
    );
}