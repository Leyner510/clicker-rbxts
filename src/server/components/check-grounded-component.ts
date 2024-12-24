import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { Workspace } from "@rbxts/services";

@Component()
export class GroundCheckComponent extends BaseComponent<{}, BasePart> implements OnStart {
    private checkInterval: number =  0.5;

    public onStart() {
        this.groundCheck();
    }

    private groundCheck() {
        task.spawn(() =>{
            while (true) {
                this.checkIfOnGround();
                task.wait(this.checkInterval);
            }
        });
    }

    private checkIfOnGround() {
        const origin = this.instance.Position;
        const direction = new Vector3(0, -1, 0);
        const raycastParams = new RaycastParams();
        raycastParams.FilterDescendantsInstances = [this.instance]
        raycastParams.FilterType = Enum.RaycastFilterType.Exclude;

        const result = Workspace.Raycast(origin, direction, raycastParams);
        // if (result) {
        //     print(`${this.instance.Name} на полу`)
        // } else {
        //     print(`${this.instance.Name} не на полу`)
        // }
    }
}