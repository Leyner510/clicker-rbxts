import { CharmedComponent } from "@rbxts/charmed-components";

interface GardenState {
    seedStage: number;
    lastWatered: number;
    lastTomatoSpawned: number;
    cooldownEnd: number;
}

export class GardenComponent extends CharmedComponent<GardenState, {}, Part> {
    protected defaultState = {
        seedStage: 0,
        lastWatered: 0,
        lastTomatoSpawned: 0,
        cooldownEnd: 0,
    };
}