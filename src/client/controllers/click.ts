import { Controller, OnStart } from "@flamework/core";
import { ClientEvents } from "shared/Events";
import { atom, subscribe } from "@rbxts/charm";
import CharmSync from "@rbxts/charm-sync";

@Controller({})
export class Click implements OnStart {
	private moneyAtom = atom<number>(0);
	private updatesAtoms = atom<number>(0);
	private clickAtom = atom<number>(0);
	private syncer = CharmSync.client({
		atoms: { clicks: this.clickAtom, money: this.moneyAtom, updates: this.updatesAtoms },
	});

	public onStart() {
		ClientEvents.updateAtoms.connect((payloads) => {
			this.syncer.sync(...payloads);
		});

		ClientEvents.hydrate.fire();

		subscribe(this.moneyAtom, (money) => {
			print(`your money is ${money}`);
		})
	}
}