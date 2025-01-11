import { Component } from "@flamework/components";
import { Action, Subscribe } from "@rbxts/charmed-components";
import { Workspace } from "@rbxts/services";
import { GardenComponent } from "shared/components/garden-component";

@Component()
export class ServerGardenComponent extends GardenComponent {

    @Action
    public waterPlant() {
        const state = this.getState();
        const currentTime = Workspace.GetServerTimeNow();

        if (currentTime - state.lastWatered < 10) {
            print("Растение можно полить только раз в 10 секунд.");
            return;
        }

        const platform = this.instance;
        const seedModel = platform.FindFirstChild("Seed") as Model | undefined;

        if (!seedModel) {
            print("На платформе нет семечка.");
            return;
        }

        const newStage = math.min(state.seedStage + 1, 2);
        return {
            ...state,
            seedStage: newStage,
            lastWatered: currentTime,
        };
    }

    @Action
    public updatePlant() {
        const currentState = this.getState();
        const platform = this.instance;
        const sproutModel = platform.FindFirstChild("Sprout") as Model | undefined;

        if (sproutModel && currentState.seedStage === 2) {
            sproutModel.Parent = undefined;

            const proximityPrompt = platform.FindFirstChildOfClass("ProximityPrompt");
            if (proximityPrompt) {
                proximityPrompt.Destroy();
            }

        } else if (sproutModel) {
            const stageModelName = `SproutStage${currentState.seedStage}`;
            const replicatedStorage = game.GetService("ReplicatedStorage");
            const stageModel = replicatedStorage.FindFirstChild(stageModelName) as Model | undefined;

            if (stageModel) {
                sproutModel.Parent = undefined;
                const newSproutModel = stageModel.Clone();
                newSproutModel.Parent = platform;
                newSproutModel.Name = "Sprout";
            } else {
                print(`Модель стадии ростка ${stageModelName} не найдена в ReplicatedStorage.`);
            }
        } else {
            print("Модель ростка не найдена на платформе.");
        }
    }

    @Action
    public placeSeed() {
        const state = this.getState();

        if (state.seedStage === 0) {
            return {
                ...state,
                seedStage: 1,
                lastWatered: Workspace.GetServerTimeNow(),       
            };
        }
        return state;
    }
}