import { Flamework } from "@flamework/core";
import React, { StrictMode } from "@rbxts/react";
import { createPortal, createRoot } from "@rbxts/react-roblox";
import { Players } from "@rbxts/services";
import { App } from "./ui/components/app";

const root = createRoot(new Instance("Folder"));
const target = Players.LocalPlayer.WaitForChild("PlayerGui");

root.render(<StrictMode>{createPortal(<App />, target)}</StrictMode>);

Flamework.addPaths("src/client");
Flamework.addPaths("src/shared");


Flamework.ignite();


// useEffect(() => {
//     UserInputService.InputBegan.Connect((input, gameProcessed) => {
//         if (gameProcessed) return;
//         if (input.KeyCode === Enum.KeyCode.E) {
//             ClientEvents.waterPlant.fire();
//         }
//     });
// }, []);