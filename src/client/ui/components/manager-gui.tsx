// src/client/ui/components/manager-gui.tsx
import React, { useEffect, useState } from "@rbxts/react";
import { palette } from "../utils/palette";
import { useFlameworkDependency } from "@rbxts/flamework-react-utils";
import { Click } from "client/controllers/click";
import { ClientEvents } from "shared/Events";
import { useAtom } from "@rbxts/react-charm";
import { AdditionalMenu } from "../buttons/label";
import { Button } from "../buttons/botton";

const COLORS = [palette.purple, palette.blue, palette.green, palette.yellow, palette.red];

// const MoneyDisplay = () => {
//     const click = useFlameworkDependency<Click>();
//     const money = useAtom(click.moneyAtom);

//     return (
//         <textlabel
//             Text={`Money: ${money}`}
//             FontFace={Font.fromName("Bangers")}
//             TextColor3={Color3.fromRGB(252, 223, 3)}
//             Size={UDim2.fromScale(0.2, 0.1)}
//             TextScaled={true}
//             BackgroundColor3={Color3.fromRGB(252, 3, 210)}
//             Position={UDim2.fromScale(0.5, 0.1)}
//             AnchorPoint={new Vector2(0.5, 0)}
//         >
//             <uicorner CornerRadius={new UDim(1)} />
//             <uistroke Thickness={10} Color={Color3.fromRGB(255, 255, 255)} ApplyStrokeMode={Enum.ApplyStrokeMode.Border}>
//                 <uigradient
//                     Color={new ColorSequence([
//                         new ColorSequenceKeypoint(0, Color3.fromRGB(197, 255, 90)),
//                         new ColorSequenceKeypoint(1, Color3.fromRGB(253, 255, 123)),
//                     ])}
//                 />
//             </uistroke>
//             <uitextsizeconstraint MaxTextSize={30} />
//         </textlabel>
//     );
// };

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
            <AdditionalMenu isVisible={isAdditionalMenuVisible} />
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