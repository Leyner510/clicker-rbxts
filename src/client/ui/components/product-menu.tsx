import { Button } from "../buttons/botton";
import React from "@rbxts/react";


export interface IProduct {
    id: number;
    name: string;
    imageUrl: string
    onClick: () => void;
}

interface IProductMenuProps {
    products: IProduct[];
    isVisible: boolean;
}

export function ProductMenu({ products, isVisible }: IProductMenuProps) {
    return (
        <frame
            BackgroundTransparency={1}
            Size={UDim2.fromScale(1, 1)}
            Position={UDim2.fromScale(0, 0)}
            AnchorPoint={new Vector2(0, 0)}
            Visible={isVisible}
        >
            {products.map((product) => (
                <Button
                    key={product.id}
                    text={product.name}
                    onClick={product.onClick}
                    textSize={24}
                    backgroundColor={Color3.fromRGB(227, 10, 10)}
                    size={UDim2.fromScale(0.36, 0.25)}
                    position={UDim2.fromScale(0.5, (product.id - 1) * 0.3,)}
                    anchorPoint={new Vector2(0.5, 0)}
                >
                    <imagelabel
                        Image={product.imageUrl}
                        Size={UDim2.fromScale(0.8, 0.8)}
                        Position={UDim2.fromScale(0.5, 0.5)}
                        AnchorPoint={new Vector2(0.5, 0.5)}
                        BackgroundTransparency={1}
                    />
                </Button>
            ))}
        </frame>
    )
}