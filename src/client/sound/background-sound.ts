import { SoundService } from "@rbxts/services";

const MUSIC_SOUND_ID = "rbxassetid://1848354536";

const backgroundMusic = new Instance("Sound");
backgroundMusic.SoundId = MUSIC_SOUND_ID;
backgroundMusic.Looped = true;
backgroundMusic.Volume = 0.5;

backgroundMusic.Parent = game.GetService("Workspace");

backgroundMusic.Play();