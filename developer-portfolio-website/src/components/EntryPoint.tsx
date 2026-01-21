"use client"

import { TokenProvider } from "../contexts/TokenContext";
import usePageViewModel from "../viewModels/useEntryPointViewModel";
import SolarSystemScene from "./solarSystemModel/SolarSystemScene";

type EntryPointProps = {
  token: string | null;
  children: React.ReactNode;
};

export default function EntryPoint({ token, children }: EntryPointProps) {
  usePageViewModel(token);

  return (
    <TokenProvider initialToken={token}>
      {children}
    </TokenProvider>
  );
}