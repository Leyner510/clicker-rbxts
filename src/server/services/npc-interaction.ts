import { Players, UserInputService, Workspace } from "@rbxts/services";
import { ServerEvents } from "shared/Events";
import { Flamework } from "@flamework/core";

Flamework.addPaths("src/server");
Flamework.ignite();

const INTERACTION_DISTANCE = 10;
const INTERACTION_KEY = Enum.KeyCode.E;

Players.PlayerAdded.Connect((player) => {
    player.CharacterAdded.Connect((character) => {
        const humanoidRootPart = character.WaitForChild("HumanoidRootPart") as BasePart;

        UserInputService.InputBegan.Connect((input, gameProcessed) => {
            if (gameProcessed) return;
            if (input.KeyCode === INTERACTION_KEY) {
                const closestNPC = findClosestNPC(humanoidRootPart.Position, INTERACTION_DISTANCE);
                if (closestNPC) {
                    ServerEvents.showNPCMenu.fire(player, player);
                }
            }
        });
    });
});

function findClosestNPC(position: Vector3, maxDistance: number): Model | undefined {
    let closestNPC: Model | undefined = undefined;
    let closestDistance = maxDistance;

    for (const model of Workspace.GetDescendants()) {
        if (model.IsA("Model") && model.FindFirstChild("NPC")) {
            const npcRootPart = model.FindFirstChild("HumanoidRootPart") as BasePart | undefined;
            if (npcRootPart) {
                const distance = (npcRootPart.Position as Vector3).sub(position).Magnitude
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestNPC = model;
                }
            }
        }
    }

    return closestNPC;
}