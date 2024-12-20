import { Components } from "@flamework/components";
import { OnStart, Service } from "@flamework/core";
import { Players } from "@rbxts/services";
import { GroundCheckComponent } from "server/components/check-grounded-component";
import { PlayerComponent } from "server/components/player-component";
import { ServerEvents } from "shared/Events";

@Service()
export class PlayerService implements OnStart {
	constructor(private components: Components) { }

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

		Players.PlayerAdded.Connect((player) => this.components.addComponent<PlayerComponent>(player));

		Players.PlayerAdded.Connect((player) => {
			player.CharacterAdded.Connect((character) => {
				const humanoidRootPart = character.FindFirstChild("HumanoidRootPart") as BasePart | undefined;
				if (humanoidRootPart) {
					this.components.addComponent<GroundCheckComponent>(humanoidRootPart);
				}
			});
		});
	}
}