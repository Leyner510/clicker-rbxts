import { Controller, OnStart } from "@flamework/core";
import { Players } from "@rbxts/services";
import ReactRoblox from "@rbxts/react-roblox";
import React from "@rbxts/react";
import { MenuButton } from "client/buttons/menu";

@Controller({})
export class UserInterfaceController implements OnStart {
    public onStart() {
        const playerGui = Players.LocalPlayer.WaitForChild("PlayerGui") as Folder;
        const proxyFolder = new Instance("Folder");
        const screenGui = new Instance("ScreenGui", playerGui);

        const root = ReactRoblox.createRoot(proxyFolder);

        screenGui.ResetOnSpawn = false;

        root.render(
            ReactRoblox.createPortal(<MenuButton />, screenGui)
        )
    }
}
