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

	private syncer = CharmSync.server({
		atoms: { clicks: this.clicksAtom, money: this.moneyAtom, updates: this.updatesAtoms },
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
		const upgrade = this.updatesAtoms()
		const moneyToAdd = 1 + upgrade;
		this.clicksAtom((currentClicks) => currentClicks + amount);
		this.moneyAtom((currentMoney) => currentMoney + moneyToAdd);
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

	public hydrate() {
		this.syncer.hydrate(this.instance);
	}
}