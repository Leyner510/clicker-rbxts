import { Flamework } from "@flamework/core";
import { DependencyContainer } from "@rbxts/flamework-di-toolkit";

const container = new DependencyContainer();

container.enableFlameworkResolver();

Flamework.addPaths("src/server");
Flamework.addPaths("src/shared");

container.injectIntoFlamework();

Flamework.ignite();
