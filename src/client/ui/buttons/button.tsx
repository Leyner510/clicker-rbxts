import { useMotion } from "@rbxts/pretty-react-hooks";
import React, { useEffect, useState } from "@rbxts/react";
import { springs } from "../utils/springs";
import { palette } from "../utils/palette";
import { brighten } from "../utils/color-utils";
import { SoundController } from "client/controllers/sound-controller";


interface ButtonProps {
    onClick?: () => void;
    font?: Font;
    text?: string;
    textSize?: number;
    backgroundColor?: Color3;
    size?: UDim2;
    position?: UDim2;
    anchorPoint?: Vector2;
    children?: React.ReactNode;
    soundId?: string;
}

export function Button({
    onClick,
    text,
    textSize,
    backgroundColor = palette.blue,
    size,
    position,
    anchorPoint,
    children,
    soundId = "rbxassetid://1673280232",
}: ButtonProps) {
    const [pressed, setPressed] = useState(false);
    const [hovered, setHovered] = useState(false);

    const [buttonPosition, buttonPositionMotion] = useMotion(0);
    const [buttonColor, buttonColorMotion] = useMotion(backgroundColor);

    useEffect(() => {
        if (pressed) {
            buttonPositionMotion.spring(0, springs.responsive);
            buttonColorMotion.spring(brighten(backgroundColor, -0.1), springs.responsive);
        } else if (hovered) {
            buttonPositionMotion.spring(8, springs.responsive);
            buttonColorMotion.spring(brighten(backgroundColor, 0.1), springs.responsive);
        } else {
            buttonPositionMotion.spring(0, springs.responsive);
            buttonColorMotion.spring(backgroundColor, springs.responsive);
        }
    }, [pressed, hovered, backgroundColor]);

    useEffect(() => {
        if (!pressed && hovered) {
            buttonPositionMotion.impulse(1);
            buttonPositionMotion.spring(8, springs.bubbly);
        }
    }, [pressed]);

    const playClickSound = SoundController();

    const handleClick = () => {
        if (onClick) {
            onClick();
        }
        playClickSound();
    };

    return (
        <frame BackgroundTransparency={1} AnchorPoint={anchorPoint} Size={size} Position={position}>
            <textbutton
                FontFace={Font.fromName("Bangers")}
                Text={text}
                TextColor3={Color3.fromRGB(252, 223, 3)}
                TextSize={textSize}
                TextScaled={true}
                AutoButtonColor={false}
                BackgroundColor3={buttonColor}
                Size={new UDim2(1, 0, 1, 0)}
                Position={buttonPosition.map((y) => new UDim2(0, 0, 0, y))}
                Event={{
                    Activated: handleClick,
                    MouseEnter: () => setHovered(true),
                    MouseLeave: () => {
                        setHovered(false);
                        setPressed(false);
                    },
                    MouseButton1Down: () => setPressed(true),
                    MouseButton1Up: () => setPressed(false),
                }}
            >
                <uicorner CornerRadius={new UDim(0, 16)} />
                {children}
            </textbutton>
        </frame>
    );
}