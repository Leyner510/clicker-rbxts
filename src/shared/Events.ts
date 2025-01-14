// src/shared/Events.ts
import { Networking } from "@flamework/networking";
import type { Atom } from "@rbxts/charm";
import type CharmSync from "@rbxts/charm-sync";
import { RunService } from "@rbxts/services";

export const IS_PLUGIN = RunService.IsStudio() && RunService.IsRunning();

interface ClientToServerEvents {
    click: () => void;
    buyUpgrade: () => void;
    buyPotionLevel: (level: number, cost: number, clickBonus: number, clicksRemaining: number) => void;
    money: () => void;
    hydrateForMoney: () => CharmSync.SyncPayload<{
        money: Atom<number>
    }>;
    hydrate: () => CharmSync.SyncPayload<{
        clicks: Atom<number>;
    }>;
    waterPlant: (platform: BasePart) => void;
    placeSeedClient: (platform: BasePart) => void;
    placeSeed: (seedModel: Model, platform: BasePart) => void;
}

interface ServerToClientEvents {
    updateAtoms: (payload: CharmSync.SyncPayload<{
        clicks: Atom<number>;
        money: Atom<number>;
        updates: Atom<number>;
        potionLevel: Atom<number>;
        clickBonus: Atom<number>;
        clicksRemaining: Atom<number>;
    }>[]) => void;
    updatePlantState: (payload: any) => void;
    click: () => void;
    buyUpgrade: () => void;
    buyPotionLevel: (level: number, cost: number, clickBonus: number, clicksRemaining: number) => void;
    money: () => void;
    hydrateForMoney: () => CharmSync.SyncPayload<{
        money: Atom<number>
    }>;
    hydrate: () => CharmSync.SyncPayload<{
        clicks: Atom<number>;
    }>;
    waterPlant: (platform: BasePart) => void;
    placeSeed: (seedModel: Model, platform: BasePart) => void;
}

const GlobalEvents = Networking.createEvent<
    ClientToServerEvents,
    ServerToClientEvents
>();

export const ClientEvents = GlobalEvents.createClient({});
export const ServerEvents = GlobalEvents.createServer({});