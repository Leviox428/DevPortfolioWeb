import { createContext, ReactNode, useContext, useState } from "react";

export type TokenContextType = {
  token: string | null;
};

const TokenContext = createContext<TokenContextType>({ token: null });

export function useToken() {
    return useContext(TokenContext);
}

export function TokenProvider({ children, initialToken }: { children: ReactNode; initialToken?: string | null }) {
    const [token, setToken] = useState<string | null>(initialToken || null);

    return (
        <TokenContext.Provider value={{ token }}>
            {children}
        </TokenContext.Provider>
    );
}