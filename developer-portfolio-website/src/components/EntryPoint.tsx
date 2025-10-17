"use client"

import { TokenProvider } from "../contexts/TokenContext";
import usePageViewModel from "../viewModels/useEntryPointViewModel";
import SolarSystemScene from "./scene/SolarSystemScene";

export default function EntryPoint({ token }: { token: string | null }) {
  usePageViewModel(token);

  return  (
    <TokenProvider initialToken={token}>
      <SolarSystemScene />
    </TokenProvider>
  );
}