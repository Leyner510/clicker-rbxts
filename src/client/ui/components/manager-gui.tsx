import React, { useEffect, useState } from "@rbxts/react";
import { palette } from "../utils/palette";
import { ClientEvents } from "shared/Events";
import { AdditionalMenu } from "../buttons/label";
import { Button } from "../buttons/button";

const COLORS = [palette.purple, palette.blue, palette.green, palette.yellow, palette.red];

interface IProduct {
    id: number;
    name: string;
    imageUrl: string;
    onClick: () => void;
}



export function Menu() {
    const [colorIndex] = useState(0);
    const [isAdditionalMenuVisible, setIsAdditionalMenuVisible] = useState(false);
    const [buttonPosition, setButtonPosition] = useState(new UDim2(0.3, 0, 0.4, 0));
    const [clickCount, setClickCount] = useState(0);
    const [isUpgradeButtonVisible, setIsUpgradeButtonVisible] = useState(false);
    const [upgradeButtonPosition, setUpgradeButtonPosition] = useState(new UDim2(0.6, 0, 0.4, 0));
    const [nextUpgradeClick, setNextUpgradeClick] = useState(math.random(10, 30));

    const handleMenuClick = () => {
        setIsAdditionalMenuVisible(!isAdditionalMenuVisible);
    };

    const handleClickForMoney = () => {
        ClientEvents.click.fire();
        setButtonPosition(generateRandomPosition());
        setClickCount((prevCount) => prevCount + 1);
    };

    const handleClickForUpgrade = () => {
        ClientEvents.buyUpgrade.fire();
        setIsUpgradeButtonVisible(false);
        setNextUpgradeClick(clickCount + math.random(10, 30))
    };
    const handleBuyPotionLevel = (level: number, cost: number, clickBonus: number, clicksRemaining: number) => {
        ClientEvents.buyPotionLevel.fire(level, cost, clickBonus, clicksRemaining);
    };

    const products: IProduct[] = [
        { id: 1, name: "Зелье 1", imageUrl: "rbxassetid://13983568527", onClick: () => handleBuyPotionLevel(1, 10, 3, 30) },
        { id: 2, name: "Зелье 2", imageUrl: "rbxassetid://9412229136", onClick: () => handleBuyPotionLevel(2, 15000, 200, 70) },
        { id: 3, name: "Зелье 3", imageUrl: "rbxassetid://9412224148", onClick: () => handleBuyPotionLevel(3, 100000, 500, 130) },
    ];

    const generateRandomPosition = () => {
        const minX = 0.1;
        const maxX = 0.9;
        const minY = 0.1;
        const maxY = 0.9;

        const randomX = math.random(minX * 100, maxX * 100) / 100;
        const randomY = math.random(minY * 100, maxY * 100) / 100;

        return new UDim2(randomX, 0, randomY, 0);
    };

    useEffect(() => {
        if (clickCount >= nextUpgradeClick) {
            setIsUpgradeButtonVisible(true);
            setUpgradeButtonPosition(generateRandomPosition);
        }
    }, [clickCount, nextUpgradeClick]);

    return (
        <>
            <Button
                text={"Menu"}
                onClick={handleMenuClick}
                textSize={32}
                backgroundColor={COLORS[colorIndex]}
                size={new UDim2(0, 100, 0, 70)}
                position={new UDim2(0.1, 0, 0.9, 0.1)}
                anchorPoint={new Vector2(0.5, 0.5)}
            />
            <AdditionalMenu isVisible={isAdditionalMenuVisible} products={products} />
            <Button
                text={"Click for money"}
                onClick={handleClickForMoney}
                textSize={32}
                backgroundColor={palette.green}
                size={new UDim2(0, 155, 0, 110)}
                position={buttonPosition}
                anchorPoint={new Vector2(0.5, 0.5)}
            />
            {isUpgradeButtonVisible && (
                <Button
                    text={"Click to get upgrade"}
                    onClick={handleClickForUpgrade}
                    textSize={32}
                    backgroundColor={palette.green}
                    size={new UDim2(0, 150, 0, 110)}
                    position={upgradeButtonPosition}
                    anchorPoint={new Vector2(0.5, 0.5)}
                />
            )}        
        </>
    );
}