import React, { useEffect } from "@rbxts/react";
import { useMotion } from "@rbxts/pretty-react-hooks";
import { springs } from "../utils/springs";
import { IProduct, ProductMenu } from "../components/product-menu";

interface AdditionalMenuProps {
    isVisible: boolean;
    products: IProduct[];
}


export function AdditionalMenu({ isVisible, products }: AdditionalMenuProps) {
    const [animations, animationsMotion] = useMotion({
        menuPosition: 0,
        menuTransparency: 1,
        textTransparency: 1,
    });

    useEffect(() => {
        if (isVisible) {
            animationsMotion.spring({
                menuPosition: 1,
                menuTransparency: 0,
                textTransparency: 0,
            }, springs.responsive);
        } else {
            animationsMotion.spring({
                menuPosition: 0,
                menuTransparency: 1,
                textTransparency: 1,
            }, springs.responsive);
        }
    }, [isVisible, animationsMotion]);

    return (
        <frame
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={animations.map((anim) => anim.menuTransparency)}
            Size={UDim2.fromScale(0.2, 0.6)}
            Position={animations.map((anim) => new UDim2(0.1, 0, 0.7 - anim.menuPosition * 0.2, 0))}
            AnchorPoint={new Vector2(0.5, 0.5)}
            Visible={isVisible}
        >
            <uicorner CornerRadius={new UDim(0, 16)} />
            <textlabel
                Text="Additional Menu"
                FontFace={Font.fromName("Bangers")}
                TextColor3={Color3.fromRGB(0, 0, 0)}
                Size={UDim2.fromScale(1, 0.1)}
                TextScaled={true}
                BackgroundTransparency={1}
                Position={UDim2.fromScale(0.5, 0.1)}
                AnchorPoint={new Vector2(0.5, 0)}
                TextTransparency={animations.map((anim) => anim.textTransparency)}
            />
            <ProductMenu products={products} isVisible={isVisible} />
        </frame>
    );
};