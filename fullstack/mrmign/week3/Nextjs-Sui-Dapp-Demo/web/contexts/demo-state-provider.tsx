import { createContext, useCallback, useContext, useState } from "react";
import { getState } from "@/contracts/query";
import exp from "constants";

interface StateContextType {
  acount: number;
  refresh: () => Promise<void>;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

interface StateProvideProps {
  children: React.ReactNode;
}

export const StateProvider: React.FC<StateProvideProps> = ({ children }) => {
  const [acount, setAcount] = useState(0);
  const refresh = useCallback(async () => {
    const state = await getState();
    const data = state.data?.content as unknown as {
      fields: { acount: number };
    };
    setAcount(data.fields.acount);
  }, []);
  return (
    <StateContext.Provider value={{ acount, refresh }}>
      {children}
    </StateContext.Provider>
  );
};

export function useStateContext() {
  const context = useContext(StateContext);
  if (!context)
    throw new Error("useStateContext must be used within a StateProvider");
  return context;
}
