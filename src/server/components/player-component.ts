import { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { atom, subscribe } from "@rbxts/charm";
import CharmSync from "@rbxts/charm-sync";
import { ServerEvents } from "shared/Events";

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
			clicksRemaining: this.clicksRemainingAtom
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

	public buyPotionLevel1() {
		const currentMoney = this.moneyAtom();
		const currentUpgrade = this.updatesAtoms();

		if (currentUpgrade >= 1 && currentMoney >= 10) {
			this.moneyAtom((currentMoney) => currentMoney - 10);
			this.potionLevelAtom(1)
			this.clickBonusAtom(3)
			this.clicksRemainingAtom(30)
			print("potion Level 1 purchased")

		} else {
			print("Not enough money or upgrades for Potion Level 1.")
		}
	}

	public buyPotionLevel2() {
		const currentMoney = this.moneyAtom();
		const currentUpgrade = this.updatesAtoms();

		if (currentUpgrade >= 25 && currentMoney >= 15000) {
			this.moneyAtom((currentMoney) => currentMoney - 15000);
			this.potionLevelAtom(2);
			this.clickBonusAtom(200)
			this.clicksRemainingAtom(70)
			print("Potion Level 2 purchased.");
		} else {
			print("Not enough money or upgrades for Potion Level 2.");
		}
	}

	public buyPotionLevel3() {
		const currentMoney = this.moneyAtom();
		const currentUpgrade = this.updatesAtoms();
		const currentPotionLevel = this.potionLevelAtom();

		if (currentUpgrade >= 40 && currentMoney >= 100000) {
			this.moneyAtom((currentMoney) => currentMoney - 100000);
			this.potionLevelAtom(3);
			this.clickBonusAtom(500)
			this.clicksRemainingAtom(130)
			print("Potion Level 3 purchased.");
		} else {
			print("Not enough money or upgrades for Potion Level 3.");
		}
	}

	public hydrate() {
		this.syncer.hydrate(this.instance);
	}
}