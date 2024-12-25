import { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { atom, subscribe } from "@rbxts/charm";
import CharmSync from "@rbxts/charm-sync";
import { ServerEvents } from "shared/Events";
import { Workspace } from "@rbxts/services";

@Component()
export class PlayerComponent extends BaseComponent<{}, Player> implements OnStart {
	private clicksAtom = atom(0);
	private moneyAtom = atom(0);
	private updatesAtoms = atom(0);
	private potionLevelAtom = atom(0);
	private clickBonusAtom = atom(0); 
	private clicksRemainingAtom = atom(0);

	private syncer = CharmSync.server({
		atoms: { 
			clicks: this.clicksAtom, 
			money: this.moneyAtom, 
			updates: this.updatesAtoms, 
			potionLevel: this.potionLevelAtom,
			clickBonus: this.clickBonusAtom,
			clicksRemaining: this.clicksRemainingAtom,
		},
	});

	private leaderstatsFolder: Folder | undefined

	public onStart() {
		this.syncer.connect((player, ...payloads) => {
			if (player !== this.instance) return;

			ServerEvents.updateAtoms.fire(player, payloads);
		});

		
		this.createLeaderstats();
		this.setupLeaderstats();

	}

	private createLeaderstats() {
		this.leaderstatsFolder = new Instance("Folder");
		this.leaderstatsFolder.Name = "leaderstats";
		this.leaderstatsFolder.Parent = this.instance;

		const moneyValue = new Instance("IntValue");
		moneyValue.Name = "Money";
		moneyValue.Value = this.moneyAtom();
		moneyValue.Parent = this.leaderstatsFolder;

		const upgradesValue = new Instance("IntValue");
		upgradesValue.Name = "Upgrades";
		upgradesValue.Value = this.updatesAtoms();
		upgradesValue.Parent = this.leaderstatsFolder;
	}

	private setupLeaderstats() {
		subscribe(this.moneyAtom, (value) => {
			const moneyValue = this.leaderstatsFolder?.FindFirstChild("Money") as IntValue | undefined;
			if (moneyValue) {
				moneyValue.Value = value;
			}
		});

		subscribe(this.updatesAtoms, (value) => {
			const upgradesValue = this.leaderstatsFolder?.FindFirstChild("Upgrades") as IntValue | undefined;
			if (upgradesValue) {
				upgradesValue.Value = value;
			}
		});
	}

	public incrementClicks(amount: number) {
		const upgrade = this.updatesAtoms();
		const baseMoneyToAdd = 1 + upgrade;
		const clickBonus = this.clickBonusAtom();
		const moneyToAdd = baseMoneyToAdd + clickBonus;

		this.clicksAtom((currentClicks) => currentClicks + amount);
		this.moneyAtom((currentMoney) => currentMoney + moneyToAdd);

		this.clicksRemainingAtom((remaining) => {
			if (remaining > 0) {
				return remaining - amount;
			}
			return 0;
		});

		if (this.clicksRemainingAtom() === 0) {
			this.clickBonusAtom(0);
		}
	}

	public buyUpgrade() {
		const currentMoney = this.moneyAtom()
		const currentUpgrade = this.updatesAtoms()
		const upgrateCost = 1 + currentUpgrade * 10;

		if (currentMoney >= upgrateCost) {
			this.moneyAtom((currentMoney) => currentMoney - upgrateCost);
			this.updatesAtoms((currentUpgrade) => currentUpgrade + 1);
		} else {
			print("not enough money")
		}
	}

	public buyPotionLevel(level: number, cost: number, clickBonus: number, clicksRemaining: number) {
		const currentMoney = this.moneyAtom();
		const currentUpgrade = this.updatesAtoms();
		const currentClicksRemaining = this.clicksRemainingAtom();

		if (currentClicksRemaining > 0) {
			print("У вас уже есть активное зелье. Пожалуйста, используйте все бонусные клики.");
			return;
		}

		if (currentUpgrade >= level && currentMoney >= cost) {
			this.moneyAtom((currentMoney) => currentMoney - cost);
			this.potionLevelAtom(level);
			this.clickBonusAtom(clickBonus);
			this.clicksRemainingAtom(clicksRemaining);
			this.spawnPotionModel(level)
			print(`Potion Level ${level} purchased.`);
		} else {
			print(`Not enough money or upgrades for Potion Level ${level}.`);
		}
	}

	private spawnPotionModel(level: number) {
		const replicatedStorage = game.GetService("ReplicatedStorage");
		const potionModelsFolder = replicatedStorage.FindFirstChild("PotionModels") as Folder | undefined;

		if (!potionModelsFolder) {
			print("Папка с моделями зелий не найдена.");
			return;
		}

		const potionModel = potionModelsFolder.FindFirstChild(`PotionLevel${level}`) as Model | undefined;

		if (!potionModel) {
			print(`Модель зелья уровня ${level} не найдена.`);
			return;
		}

		const playerCharacter = this.instance.Character;
		if (!playerCharacter) {
			print("Персонаж игрока не найден.");
			return;
		}

		const playerRootPart = playerCharacter.FindFirstChild("HumanoidRootPart") as BasePart | undefined;
		if (!playerRootPart) {
			print("Корневая часть персонажа не найдена.");
			return;
		}

		const ray = new Ray(playerRootPart.Position, new Vector3(0, -5, 0));
		const ignoreList = [playerCharacter];
		const params = new RaycastParams();
		params.FilterDescendantsInstances = ignoreList;
		params.FilterType = Enum.RaycastFilterType.Exclude;
		const result = Workspace.Raycast(ray.Origin, ray.Direction, params);

		if (result) {
			const newPotionModel = potionModel.Clone();
			newPotionModel.Parent = Workspace;
			newPotionModel.PrimaryPart!.CFrame = new CFrame(result.Position).mul(CFrame.Angles(0, math.rad(math.random(0, 360)), 0));
		} else {
			print("Не удалось найти место для размещения зелья.");
		}
	}

	public hydrate() {
		this.syncer.hydrate(this.instance);
	}
}