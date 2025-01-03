import { Components } from "@flamework/components";
import { OnStart, Service } from "@flamework/core";
import { Players, ReplicatedStorage, Workspace } from "@rbxts/services";
import { GroundCheckComponent } from "server/components/check-grounded-component";
import { PlayerComponent } from "server/components/player-component";
import { CharmedComponents } from "@rbxts/charmed-components";
import { ServerEvents } from "shared/Events";
import { GardenComponent } from "server/components/garden-component";
import { Inject } from "@rbxts/flamework-di-toolkit";

@Service()
export class PlayerService implements OnStart {
    @Inject
    private components!: Components;
    
    // @Inject
    // private charmedComponents!: CharmedComponents;

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

        ServerEvents.waterPlant.connect((player) => {
            const character = player.Character;
            if (character && character.PrimaryPart) {
                const ray = new Ray(character.PrimaryPart.Position, character.PrimaryPart.CFrame.LookVector.mul(5));
                const result = Workspace.Raycast(ray.Origin, ray.Direction);
                if (result) {
                    const gardenComponent = this.components.getComponent<GardenComponent>(result.Instance);
                    if (gardenComponent) {
                        gardenComponent.waterPlant();
                    }
                }
            }
        });

        Players.PlayerAdded.Connect((player) => {
            this.components.addComponent<PlayerComponent>(player);
            this.giveSeedTool(player);
        });

        Players.PlayerAdded.Connect((player) => {
            player.CharacterAdded.Connect((character) => {
                const humanoidRootPart = character.FindFirstChild("HumanoidRootPart") as BasePart | undefined;
                if (humanoidRootPart) {
                    this.components.getComponent<GroundCheckComponent>(humanoidRootPart);
                }
            });
        });

        // this.charmedComponents.watchDispatch((player, payload) => {
        //     ServerEvents.updatePlantState.fire(player, payload);
        // });

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
            garden.Parent = Workspace;

            const platform = new Instance("Part");
            platform.Size = new Vector3(3, 0.1, 3);
            platform.Position = position.add(new Vector3(0, 2, 0));
            platform.Color = platformColor;
            platform.Anchored = true;
            platform.Parent = garden;

            this.components.getComponent<GardenComponent>(platform);
        });
    }
    private giveSeedTool(player: Player) {
        let backpack = player.FindFirstChild("Backpack") as Backpack | undefined;
        if (!backpack) {
            backpack = new Instance("Backpack");
            backpack.Name = "Backpack";
            backpack.Parent = player;
            print(`Backpack created for player: ${player.Name}`);
        } else {
            print(`Backpack found for player: ${player.Name}`);
        }

        const seedModel = ReplicatedStorage.FindFirstChild("SeedModel") as Folder | undefined;
        if (seedModel) {
            print(`SeedModel found in ReplicatedStorage`);
            const seedTool = seedModel.FindFirstChild("Seed") as Tool | undefined;
            if (seedTool) {
                print(`Seed tool found in SeedModel`);
                const seedClone = seedTool.Clone();
                seedClone.Parent = backpack;
                print(`Seed tool cloned and added to Backpack`);
            } else {
                print(`Seed tool not found in SeedModel`);
            }
        } else {
            print(`SeedModel not found in ReplicatedStorage`);
        }
    }
}