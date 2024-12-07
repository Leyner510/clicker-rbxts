import { atom, subscribe } from "@rbxts/charm";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "@rbxts/react";
import { ClientEvents } from "shared/Events";

const moneyContext = createContext<number>(0);

interface IMoneyProviderProps {
    children: ReactNode;
}

export const MoneyProvider: React.FC<IMoneyProviderProps> = ({ children }) => {
    const moneyAtom = atom<number>(0);
    const [money, setMoney] = useState<number>(moneyAtom());

    useEffect(() => {
        ClientEvents.updateAtoms.connect((payloads) => {
            payloads.forEach((payload) => {
                if (payload.type === "init" || payload.type === "patch") {
                    const { money } = payload.data;
                    if (money) {
                        moneyAtom(money);
                    }
                }
            });
        });

        const unsubscribe = subscribe(moneyAtom, (value) => {
            setMoney(value);
        });

        ClientEvents.hydrate.fire();
 
        return () => {
            unsubscribe();
        };
    }, [])

    return (
        <moneyContext.Provider value={money}>
            {children}
        </moneyContext.Provider>
    );
};

export const useMoney = () => useContext(moneyContext)