// src/client/components/garden-component.ts
import { OnStart } from "@flamework/core";
import { Component } from "@flamework/components";
import { GardenComponent } from "shared/components/garden-component";


@Component({})
export class ClientGardenComponent extends GardenComponent implements OnStart {
}