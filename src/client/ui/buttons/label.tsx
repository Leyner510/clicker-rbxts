import React, { useEffect } from "@rbxts/react";
import { useMotion } from "@rbxts/pretty-react-hooks";
import { springs } from "../utils/springs";
import { IProduct, ProductMenu } from "../components/product-menu";

interface AdditionalMenuProps {
    isVisible: boolean;
    products: IProduct[];
}


export function AdditionalMenu({ isVisible, products }: AdditionalMenuProps) {
    const [menuPosition, menuPositionMotion] = useMotion(0);
    const [menuTransparency, menuTransparencyMotion] = useMotion(1);
    const [textTransparency, textTransparencyMotion] = useMotion(1);



    useEffect(() => {
        if (isVisible) {
            menuPositionMotion.spring(1, springs.responsive);
            menuTransparencyMotion.spring(0, springs.responsive);
            textTransparencyMotion.spring(0, springs.responsive);
        } else {
            menuPositionMotion.spring(0, springs.responsive);
            menuTransparencyMotion.spring(1, springs.responsive);
            textTransparencyMotion.spring(1, springs.responsive);
        }
    }, [isVisible]);


    return (
        <frame
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={menuTransparency}
            Size={UDim2.fromScale(0.2, 0.6)}
            Position={menuPosition.map((y) => new UDim2(0.1, 0, 0.7 - y * 0.2, 0))}
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
                TextTransparency={textTransparency}
            />
            <ProductMenu products={products} isVisible={isVisible}/>{}
        </frame>
    );
};