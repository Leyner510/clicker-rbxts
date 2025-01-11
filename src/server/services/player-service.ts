import { Components } from "@flamework/components";
import { OnStart, Service } from "@flamework/core";
import { Players, ReplicatedStorage, Workspace } from "@rbxts/services";
import { GroundCheckComponent } from "server/components/check-grounded-component";
import { PlayerComponent } from "server/components/player-component";
import { ServerEvents } from "shared/Events";
import { ServerGardenComponent } from "server/components/garden-component";
import { Inject } from "@rbxts/flamework-di-toolkit";
import { CharmedComponents } from "@rbxts/charmed-components";
import { GardenComponent } from "shared/components/garden-component";

@Service()
export class PlayerService implements OnStart {
    @Inject
    private components!: Components;

    @Inject
    private charmedComponents!: CharmedComponents;

    public onStart() {
        ServerEvents.hydrate.connect((player) => {
            const playerComponent = this.components.getComponent<PlayerComponent>(player);
            playerComponent?.hydrate();
        });

        ServerEvents.click.connect((player) => {
            const playerComponent = this.components.getComponent<PlayerComponent>(player);
            playerComponent?.incrementClicks(1);
        });

        ServerEvents.buyUpgrade.connect((player) => {
            const playerComponent = this.components.getComponent<PlayerComponent>(player);
            playerComponent?.buyUpgrade();
        });

        ServerEvents.buyPotionLevel.connect((player, level, cost, clickBonus, clicksRemaining) => {
            const playerComponent = this.components.getComponent<PlayerComponent>(player);
            playerComponent?.buyPotionLevel(level, cost, clickBonus, clicksRemaining);
        });

        ServerEvents.waterPlant.connect((player, platform) => {
            const gardenComponent = this.components.getComponent<ServerGardenComponent>(platform);
            if (gardenComponent) {
                gardenComponent.waterPlant();
                this.spawnTomato(platform)
                const proximityPromptDelete = platform.FindFirstChildOfClass("ProximityPrompt");
                if (proximityPromptDelete) {
                    proximityPromptDelete.Destroy();
                }
                print("Метод waterPlant вызван для платформы:", platform.Name);
            } else {
                print("Компонент ServerGardenComponent не найден на платформе:", platform.Name);
            }
        });

        ServerEvents.placeSeed.connect((player, seedModel, platform) => {
            const gardenComponent = this.components.getComponent<ServerGardenComponent>(platform);
            if (gardenComponent) {
                gardenComponent.placeSeed();
                this.spawnSprout(platform);
                const proximityPromptDelete = platform.FindFirstChildOfClass("ProximityPrompt");
                if (proximityPromptDelete) {
                    proximityPromptDelete.Destroy();
                }
            }
        });

        Players.PlayerAdded.Connect((player) => {
            this.components.addComponent<PlayerComponent>(player);
            player.CharacterAdded.Connect((character) => {
                this.spawnSeedModel(character);
                this.spawnWaterCanModel(character);
                const humanoidRootPart = character.FindFirstChild("HumanoidRootPart") as BasePart | undefined;
                if (humanoidRootPart) {
                    this.components.addComponent<GroundCheckComponent>(humanoidRootPart);
                }
            });
        });

        this.charmedComponents.watchDispatch((player, payload) => {
            ServerEvents.updatePlantState.fire(player, payload);
        });

        this.createGardens();
    }

    private createGardens() {
        const gardenSize = new Vector3(4, 0.1, 4);
        const gardenColor = Color3.fromRGB(128, 128, 128);
        const platformColor = Color3.fromRGB(165, 42, 42);

        const gardenPositions = [
            new Vector3(0, 0, 0),
            new Vector3(5, 0, 0),
            new Vector3(0, 0, 5),
            new Vector3(5, 0, 5),
        ];

        gardenPositions.forEach((position) => {
            const garden = new Instance("Part");
            garden.Size = gardenSize;
            garden.Position = position;
            garden.Color = gardenColor;
            garden.Anchored = true;
            garden.CanCollide = true;
            garden.Parent = Workspace;

            const platform = new Instance("Part");
            platform.Size = new Vector3(3, 0.1, 3);
            platform.Position = position.add(new Vector3(0, 2, 0));
            platform.Color = platformColor;
            platform.Anchored = true;
            platform.CanCollide = true;
            platform.Parent = garden;

            const proximityPrompt = new Instance("ProximityPrompt");
            proximityPrompt.ActionText = "Посадить семя";
            proximityPrompt.ObjectText = "Платформа для посадки семени";
            proximityPrompt.HoldDuration = 0;
            proximityPrompt.Parent = platform;

            this.components.addComponent<ServerGardenComponent>(platform);
        });
    }

    private spawnSeedModel(character: Model) {
        const replicatedStorage = game.GetService("ReplicatedStorage");
        const seedModelFolder = replicatedStorage.FindFirstChild("SeedModel") as Folder | undefined;

        if (!seedModelFolder) {
            print("Папка с моделями семян не найдена.");
            return;
        }

        const seedModel = seedModelFolder.FindFirstChild("Seed") as Model | undefined;

        if (!seedModel) {
            print("Модель семени не найдена.");
            return;
        }

        const newSeedModel = seedModel.Clone();
        newSeedModel.Parent = character;
        newSeedModel.Name = "Seed";
    }

    private spawnWaterCanModel(character: Model) {
        const replicatedStorage = game.GetService("ReplicatedStorage");
        const waterCanModel = replicatedStorage.FindFirstChild("WaterCan") as Model | undefined;

        if (!waterCanModel) {
            print("Модель лейки не найдена.");
            return;
        }

        const newWaterCanModel = waterCanModel.Clone();
        newWaterCanModel.Parent = character;
        newWaterCanModel.Name = "WaterCan";
    }

    private spawnSprout(platform: BasePart) {
        const replicatedStorage = game.GetService("ReplicatedStorage");
        const seedModelFolder = replicatedStorage.FindFirstChild("SeedModel") as Folder | undefined;

        if (!seedModelFolder) {
            print("Папка с моделями семян не найдена.");
            return;
        }

        const sproutModel = seedModelFolder.FindFirstChild("Sprout") as Model | undefined;

        if (!sproutModel) {
            print("Модель ростка не найдена.");
            return;
        }

        const newSproutModel = sproutModel.Clone();
        const primaryPart = newSproutModel.PrimaryPart;

        if (!primaryPart) {
            print("У модели ростка нет PrimaryPart.");
            return;
        }

        primaryPart.Position = platform.Position.add(new Vector3(0, 1, 0));
        newSproutModel.Parent = platform;

        const proximityPrompt = new Instance("ProximityPrompt");
        proximityPrompt.ActionText = "Полить растение";
        proximityPrompt.ObjectText = "Растение нужно полить";
        proximityPrompt.HoldDuration = 0;
        proximityPrompt.Parent = platform;

        print("ProximityPrompt для полива создан на платформе:", platform.Name);
    }

    private spawnTomato(platform: BasePart) {
        const replicatedStorage = game.GetService("ReplicatedStorage");
        const seedModelFolder = replicatedStorage.FindFirstChild("SeedModel") as Folder | undefined;

        if (!seedModelFolder) {
            print("Папка с моделями семян не найдена.");
            return;
        }

        const tomatoModel = seedModelFolder.FindFirstChild("Tomato") as Model | undefined;

        if (!tomatoModel) {
            print("Модель помидора не найдена.");
            return;
        }

        const newTomatoModel = tomatoModel.Clone();
        const primaryPart = newTomatoModel.PrimaryPart;

        if (!primaryPart) {
            print("У модели помидора нет PrimaryPart.");
            return;
        }

        primaryPart.Position = platform.Position.add(new Vector3(0, 1, 0));
        newTomatoModel.Parent = platform;
        newTomatoModel.Name = "Tomato";

        print("Модель помидора создана на платформе:", platform.Name);
    }
}