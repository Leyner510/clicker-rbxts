import { SoundService } from "@rbxts/services";

interface IClickSoundProps {
    soundId: string;
}

export function useClickSound({ soundId }: IClickSoundProps) {
    const playSound = () => {
        const sound = new Instance("Sound");
        sound.SoundId = soundId;
        sound.Parent = SoundService;
        sound.Play();

        sound.Ended.Connect(() => {
            sound.Destroy();
        })
    };

    return playSound
};
