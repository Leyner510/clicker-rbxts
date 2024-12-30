import React, { useEffect, useState } from "@rbxts/react";
import { IProduct } from "./product-menu";
import { Button } from "../buttons/button";
import { ClientEvents } from "shared/Events";

interface INPCMenuProps {
    isVisible: boolean;
    products: IProduct[];
}

export function NPCMenu({ isVisible, products }: INPCMenuProps) {
    const [isMenuVisible, setIsMenuVisible] = useState(isVisible);

    useEffect(() => {
        setIsMenuVisible(isVisible);
    }, [isVisible]);

    const handleBuyPotionLevel = (level: number, cost: number, clickBonus: number, clicksRemaining: number) => {
        ClientEvents.buyPotionLevel.fire(level, cost, clickBonus, clicksRemaining);
        setIsMenuVisible(false);
    };

    return (
        <frame
            BackgroundTransparency={1}
            Size={UDim2.fromScale(1, 1)}
            Position={UDim2.fromScale(0, 0)}
            AnchorPoint={new Vector2(0, 0)}
            Visible={isMenuVisible}
        >
            <frame
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={0.5}
                Size={UDim2.fromScale(0.5, 0.5)}
                Position={UDim2.fromScale(0.5, 0.5)}
                AnchorPoint={new Vector2(0.5, 0.5)}
            >
                <uicorner CornerRadius={new UDim(0, 16)} />
                <textlabel
                    Text="NPC Menu"
                    FontFace={Font.fromName("Bangers")}
                    TextColor3={Color3.fromRGB(0, 0, 0)}
                    Size={UDim2.fromScale(1, 0.1)}
                    TextScaled={true}
                    BackgroundTransparency={1}
                    Position={UDim2.fromScale(0.5, 0.1)}
                    AnchorPoint={new Vector2(0.5, 0)}
                />
                {products.map((product, index) => (
                    <Button
                        key={product.id}
                        text={product.name}
                        onClick={() => handleBuyPotionLevel(product.id, 10 * product.id, product.id * 100, product.id * 10)}
                        textSize={16}
                        backgroundColor={Color3.fromRGB(227, 10, 10)}
                        size={UDim2.fromScale(0.8, 0.1)}
                        position={UDim2.fromScale(0.5, 0.2 + index * 0.15)}
                        anchorPoint={new Vector2(0.5, 0.5)

                        }
                    />
                ))}
            </frame>
        </frame>
    );
}