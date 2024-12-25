import React, { useEffect } from "@rbxts/react";
import { useClickSound } from "client/ui/hooks/use-sound";

const MUSIC_SOUND_ID = "rbxassetid://1848354536";

const backgroundMusic = new Instance("Sound");
backgroundMusic.SoundId = MUSIC_SOUND_ID;
backgroundMusic.Looped = true;
backgroundMusic.Volume = 0.5;
backgroundMusic.Parent = game.GetService("Workspace");

export function SoundController() {
    const playClickSound = useClickSound({ soundId: "rbxassetid://1673280232" });

    useEffect(() => {
        backgroundMusic.Play();

        return () => {
            backgroundMusic.Stop();
        };
    }, []);

    return (playClickSound);
}