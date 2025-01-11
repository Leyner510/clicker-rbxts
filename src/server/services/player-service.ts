import { Components } from "@flamework/components";
import { OnStart, Service } from "@flamework/core";
import { Players, Workspace } from "@rbxts/services";
import { GroundCheckComponent } from "server/components/check-grounded-component";
import { PlayerComponent } from "server/components/player-component";
import { ClientEvents, ServerEvents } from "shared/Events";
import { ServerGardenComponent } from "server/components/garden-component";
import { Inject } from "@rbxts/flamework-di-toolkit";
import { CharmedComponents } from "@rbxts/charmed-components";

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
                const proximityPromptDelete = platform.FindFirstChildOfClass("ProximityPrompt");
                if (proximityPromptDelete) {
                    proximityPromptDelete.Destroy();
                }
                print("Метод waterPlant вызван для платформы:", platform.Name);
            } else {
                print("Компонент ServerGardenComponent не найден на платформе:", platform.Name);
            }
        });

        ServerEvents.placeSeed.connect((seedModel, platform) => {
            const gardenComponent = this.components.getComponent<ServerGardenComponent>(platform);
            if (gardenComponent) {
                const newState = gardenComponent.placeSeed();
                const player = Players.GetPlayerFromCharacter(seedModel.Parent as Model);
                if (player) {
                    ClientEvents.placeSeed.fire(seedModel, platform);
                }
            } else {
                print("Компонент ServerGardenComponent не найден на платформе:", platform.Name);
            }
        });

        Players.PlayerAdded.Connect((player) => {
            this.components.addComponent<PlayerComponent>(player);
            player.CharacterAdded.Connect((character) => {
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
}