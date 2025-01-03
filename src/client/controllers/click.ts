import { Controller, OnStart } from "@flamework/core";
import { ClientEvents } from "shared/Events";
import { atom, subscribe } from "@rbxts/charm";
import CharmSync from "@rbxts/charm-sync";

@Controller({})
export class Click implements OnStart {
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

		ClientEvents.hydrate.fire();

		// subscribe(this.moneyAtom, (money) => {
		// 	print(`Your money is ${money}`);
		// });

		subscribe(this.potionLevelAtom, (potionLevel) => {
			print(`Your potion level is ${potionLevel}`);
		});

		subscribe(this.clickBonusAtom, (clickBonus) => {
			print(`Your click bonus is ${clickBonus}`);
		});


		subscribe(this.clicksRemainingAtom, (clicksRemaining) => {
			print(`Clicks remaining with bonus: ${clicksRemaining}`);
		});
	}
}