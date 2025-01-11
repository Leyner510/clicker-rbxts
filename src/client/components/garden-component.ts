// src/client/components/garden-component.ts
import { OnStart } from "@flamework/core";
import { Component } from "@flamework/components";
import { GardenComponent } from "shared/components/garden-component";
import { Subscribe } from "@rbxts/charmed-components";
import { ReplicatedStorage } from "@rbxts/services";

@Component({})
export class ClientGardenComponent extends GardenComponent implements OnStart {
    public onStart() {
        // Подписываемся на изменения состояния при старте компонента
        this.onStateUpdate(this.getState())
    }

    @Subscribe((state) => state)
    private onStateUpdate(newState: typeof this.defaultState) {
        if (newState.seedStage === 1) {
            this.spawnSprout();
        } else if (newState.seedStage === 2) {
            this.spawnTomato();
        }
    }

    private spawnSprout() {
        const seedModelFolder = ReplicatedStorage.FindFirstChild("SeedModel") as Folder;
        if (!seedModelFolder) {
            print("Папка с моделями семян не найдена.");
            return;
        }

        const sproutModel = seedModelFolder.FindFirstChild("Sprout") as Model;
        if (!sproutModel) {
            print("Модель ростка не найдена.");
            return;
        }

        // Удаляем существующий росток, если есть
        const existingSprout = this.instance.FindFirstChild("Sprout");
        if (existingSprout) {
            existingSprout.Destroy();
        }

        const newSproutModel = sproutModel.Clone();
        const primaryPart = newSproutModel.PrimaryPart;

        if (!primaryPart) {
            print("У модели ростка нет PrimaryPart.");
            return;
        }

        primaryPart.Position = this.instance.Position.add(new Vector3(0, 1, 0));
        newSproutModel.Parent = this.instance;
        newSproutModel.Name = "Sprout";

        // Создаем ProximityPrompt для полива
        const proximityPrompt = new Instance("ProximityPrompt");
        proximityPrompt.ActionText = "Полить растение";
        proximityPrompt.ObjectText = "Растение нужно полить";
        proximityPrompt.HoldDuration = 0;
        proximityPrompt.Parent = this.instance;
    }

    private spawnTomato() {
        const seedModelFolder = ReplicatedStorage.FindFirstChild("SeedModel") as Folder;
        if (!seedModelFolder) {
            print("Папка с моделями семян не найдена.");
            return;
        }

        const tomatoModel = seedModelFolder.FindFirstChild("Tomato") as Model;
        if (!tomatoModel) {
            print("Модель помидора не найдена.");
            return;
        }

        // Удаляем существующий росток
        const existingSprout = this.instance.FindFirstChild("Sprout");
        if (existingSprout) {
            existingSprout.Destroy();
        }

        const newTomatoModel = tomatoModel.Clone();
        const primaryPart = newTomatoModel.PrimaryPart;

        if (!primaryPart) {
            print("У модели помидора нет PrimaryPart.");
            return;
        }

        primaryPart.Position = this.instance.Position.add(new Vector3(0, 1, 0));
        newTomatoModel.Parent = this.instance;
        newTomatoModel.Name = "Tomato";

        // Удаляем ProximityPrompt для полива
        const proximityPrompt = this.instance.FindFirstChildOfClass("ProximityPrompt");
        if (proximityPrompt) {
            proximityPrompt.Destroy();
        }
    }
}