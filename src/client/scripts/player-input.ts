import { Players, UserInputService, ProximityPromptService } from "@rbxts/services";
import { ClientEvents } from "shared/Events";

const userInputService = UserInputService;
const proximityPromptService = ProximityPromptService;

const screenGui = new Instance("ScreenGui");
screenGui.Parent = Players.LocalPlayer.WaitForChild("PlayerGui");

const hintFrame = new Instance("Frame");
hintFrame.Size = new UDim2(0, 200, 0, 50);
hintFrame.Position = new UDim2(0.5, -100, 0.5, -25);
hintFrame.BackgroundColor3 = Color3.fromRGB(0, 0, 0);
hintFrame.BackgroundTransparency = 0.5;
hintFrame.Visible = false;
hintFrame.Parent = screenGui;

const hintText = new Instance("TextLabel");
hintText.Text = "Нажмите E, чтобы посадить семя";
hintText.Size = new UDim2(1, 0, 1, 0);
hintText.TextColor3 = Color3.fromRGB(255, 255, 255);
hintText.BackgroundTransparency = 1;
hintText.Parent = hintFrame;

let currentPrompt: ProximityPrompt | undefined = undefined;

proximityPromptService.PromptShown.Connect((prompt) => {
    if (prompt.ActionText === "Посадить семя") {
        currentPrompt = prompt;
        hintFrame.Visible = true;
        hintText.Text = "Нажмите E, чтобы посадить семя";
    } else if (prompt.ActionText === "Полить растение") {
        currentPrompt = prompt;
        hintFrame.Visible = true;
        hintText.Text = "Нажмите E, чтобы полить растение";
    }
});

proximityPromptService.PromptHidden.Connect((prompt) => {
    if (prompt.ActionText === "Посадить семя" || prompt.ActionText === "Полить растение") {
        currentPrompt = undefined;
        hintFrame.Visible = false;
    }
});

userInputService.InputBegan.Connect((input) => {
    if (input.KeyCode === Enum.KeyCode.E) {
        if (currentPrompt) {
            const player = Players.LocalPlayer;
            const character = player.Character;
            if (character) {
                const primaryPart = character.PrimaryPart;
                if (primaryPart) {
                    if (currentPrompt.ActionText === "Посадить семя") {
                        const seedModel = character.FindFirstChild("Seed") as Model | undefined;
                        if (seedModel) {
                            const platform = currentPrompt.Parent as BasePart;
                            if (platform) {
                                ClientEvents.placeSeedClient.fire(platform);
                                print("посажено");
                                hintFrame.Visible = false;
                            } else {
                                print("Не удалось определить платформу для посадки семени.");
                            }
                        } else {
                            print("У вас нет семени.");
                        }
                    } else if (currentPrompt.ActionText === "Полить растение") {
                        const waterCanModel = character.FindFirstChild("WaterCan") as Model | undefined;
                        if (waterCanModel) {
                            const platform = currentPrompt.Parent as BasePart | undefined;
                            if (platform) {
                                ClientEvents.waterPlant.fire(platform);
                                print("Растение полито");
                                hintFrame.Visible = false;
                            } else {
                                print("Не удалось определить платформу для полива.");
                            }
                        } else {
                            print("У вас нет лейки.");
                        }
                    }
                }
