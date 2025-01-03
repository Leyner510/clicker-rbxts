import { Component, BaseComponent } from "@flamework/components";
import { atom } from "@rbxts/charm";
import { OnStart } from "@flamework/core";
import { Players, ReplicatedStorage, RunService} from "@rbxts/services";

interface GardenState {
    seedStage: number; // 0 - no seed, 1 - sprout, 2 - medium, 3 - grown
    lastWatered: number;
}

@Component()
export class GardenComponent extends BaseComponent<GardenState, Part> implements OnStart {
    private seedStage = atom(0);
    private lastWatered = atom(0);

    public onStart() {

        this.instance.Touched.Connect((otherPart) => {
            const player = Players.GetPlayerFromCharacter(otherPart.Parent as Model);
            if (player && player.Character && player.Character.PrimaryPart) {
                const seedModel = ReplicatedStorage.FindFirstChild("SeedModel") as Model | undefined;
                if (seedModel) {
                    const seedClone = seedModel.Clone();
                    seedClone.Parent = this.instance;
                    if (seedClone.PrimaryPart) {
                        seedClone.PrimaryPart.Position = this.instance.Position.add(new Vector3(0, 1, 0));
                    }
                    this.seedStage((currentStage) => currentStage + 1); // Set seed stage to 1
                    this.lastWatered(() => os.time());
                }
            }
        });

        RunService.Heartbeat.Connect(() => {
            this.updatePlant();
        });
    }

    public waterPlant() {  
        if (this.seedStage() > 0) {
            this.lastWatered(() => os.time());
        }
    }

    public updatePlant() {
        const currentTime = os.time();
        const timeSinceWatered = currentTime - this.lastWatered();

        if (timeSinceWatered > 10) {
            this.seedStage(() => 0);
        } else {
            if (this.seedStage() === 1 && timeSinceWatered >= 10) {
                this.seedStage(() => 2);
            } else if (this.seedStage() === 2 && timeSinceWatered >= 20) {
                this.seedStage(() => 3);
            }
        }
    }
}