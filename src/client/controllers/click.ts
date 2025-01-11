import { Controller, OnStart } from "@flamework/core";
import { ClientEvents } from "shared/Events";
import { atom } from "@rbxts/charm";
import CharmSync from "@rbxts/charm-sync";
import { CharmedComponents } from "@rbxts/charmed-components";
import { Inject } from "@rbxts/flamework-di-toolkit";
import { Players } from "@rbxts/services";

@Controller({})
export class Click implements OnStart {

    @Inject
    private charmedComponents!: CharmedComponents;

    public moneyAtom = atom<number>(0);
    private updatesAtoms = atom<number>(0);
    private clickAtom = atom<number>(0);
    private potionLevelAtom = atom<number>(0);
    private clickBonusAtom = atom<number>(0);
    private clicksRemainingAtom = atom<number>(0);

    private syncer = CharmSync.client({
        atoms: {
            clicks: this.clickAtom,
            money: this.moneyAtom,
            updates: this.updatesAtoms,
            potionLevel: this.potionLevelAtom,
            clickBonus: this.clickBonusAtom,
            clicksRemaining: this.clicksRemainingAtom
        },
    });

    public onStart() {
        ClientEvents.updateAtoms.connect((payloads) => {
            this.syncer.sync(...payloads);
        });

        ClientEvents.updatePlantState.connect((payload) => {
            this.charmedComponents.sync(payload);
        });


        ClientEvents.placeSeed.connect((seedModel, platform) => {
            if (platform) {
                this.spawnSprout(platform);
            } else {
                print("Не удалось определить платформу для посадки семени.");
            }
        });

        Players.LocalPlayer.CharacterAdded.Connect((character) => {
            this.spawnSeedModel(character);
            this.spawnWaterCanModel(character);
        });

        ClientEvents.hydrate.fire();
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
}