import { Flamework } from "@flamework/core";
import React, { StrictMode } from "@rbxts/react";
import { createPortal, createRoot } from "@rbxts/react-roblox";
import { Players } from "@rbxts/services";
import { App } from "./ui/components/app";
import { DependencyContainer } from "@rbxts/flamework-di-toolkit";

const container = new DependencyContainer();

container.enableFlameworkResolver();

const root = createRoot(new Instance("Folder"));
const target = Players.LocalPlayer.WaitForChild("PlayerGui");

root.render(<StrictMode>{createPortal(<App />, target)}</StrictMode>);

Flamework.addPaths("src/client");
Flamework.addPaths("src/shared");

container.injectIntoFlamework();

Flamework.ignite();
