// src/client/ui/app.tsx
import { useFlameworkDependency } from "@rbxts/flamework-react-utils";
import React from "@rbxts/react";
import { useAtom } from "@rbxts/react-charm";
import { Click } from "client/controllers/click";
import { ClientEvents } from "shared/Events";


const MoneyDisplay = () => {
    const click = useFlameworkDependency<Click>();
    const money = useAtom(click.moneyAtom);

    return (
        <textlabel
            Text={`Money: ${money}`}
            FontFace={Font.fromName("Bangers")}
            TextColor3={Color3.fromRGB(252, 223, 3)}
            Size={UDim2.fromScale(0.2, 0.1)}
            TextScaled={true}
            BackgroundColor3={Color3.fromRGB(252, 3, 210)}
            Position={UDim2.fromScale(0.5, 0.1)}
            AnchorPoint={new Vector2(0.5, 0)}
        >
            <uicorner CornerRadius={new UDim(1)} />
            <uistroke Thickness={10} Color={Color3.fromRGB(255, 255, 255)} ApplyStrokeMode={Enum.ApplyStrokeMode.Border}>
                <uigradient
                    Color={new ColorSequence([
                        new ColorSequenceKeypoint(0, Color3.fromRGB(197, 255, 90)),
                        new ColorSequenceKeypoint(1, Color3.fromRGB(253, 255, 123)),
                    ])}
                />
            </uistroke>
            <uitextsizeconstraint MaxTextSize={30} />
        </textlabel>
    );
};

export function App() {
    return (
        <>
            <MoneyDisplay />
            <textbutton
                key={"Clicks"}
                Text={'Click to get clicks'}
                FontFace={Font.fromName("Bangers")}
                TextColor3={Color3.fromRGB(252, 223, 3)}
                Size={UDim2.fromScale(0.2, 0.1)}
                TextScaled={true}
                BackgroundColor3={Color3.fromRGB(252, 3, 210)}
                Position={UDim2.fromScale(0.3, 0.4)}
                Event={{
                    Activated: () => ClientEvents.click.fire(),
                }}
            >
                <uicorner CornerRadius={new UDim(1)} />
                <uistroke Thickness={10} Color={Color3.fromRGB(255, 255, 255)} ApplyStrokeMode={Enum.ApplyStrokeMode.Border}>
                    <uigradient key={"UIGradient"}
                        Color={new ColorSequence([
                            new ColorSequenceKeypoint(0, Color3.fromRGB(197, 255, 90)),
                            new ColorSequenceKeypoint(1, Color3.fromRGB(253, 255, 123)),
                        ])} />
                </uistroke>
                <uitextsizeconstraint MaxTextSize={30} />
            </textbutton>

            <textbutton
                key={"Upgrades"}
                Text={'Click to get upgrades'}
                FontFace={Font.fromName("Bangers")}
                TextColor3={Color3.fromRGB(252, 223, 3)}
                Size={UDim2.fromScale(0.2, 0.1)}
                TextScaled={true}
                BackgroundColor3={Color3.fromRGB(252, 3, 210)}
                Position={UDim2.fromScale(0.6, 0.4)}
                Event={{
                    Activated: () => ClientEvents.buyUpgrade.fire(),
                }}
            >
                <uicorner CornerRadius={new UDim(1)} />
                <uistroke Thickness={10} Color={Color3.fromRGB(255, 255, 255)} ApplyStrokeMode={Enum.ApplyStrokeMode.Border}>
                    <uigradient key={"UIGradient"}
                        Color={new ColorSequence([
                            new ColorSequenceKeypoint(0, Color3.fromRGB(197, 255, 90)),
                            new ColorSequenceKeypoint(1, Color3.fromRGB(253, 255, 123)),
                        ])} />
                </uistroke>
                <uitextsizeconstraint MaxTextSize={30} />
            </textbutton>
        </>
    );
}