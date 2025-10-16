"use client";

import SolarSystemScene from "@/src/components/scene/SolarSystemScene";
import usePageViewModel from "@/src/viewModels/usePageViewModel";


export default function Home() {
  const vm = usePageViewModel();
  
  return  <SolarSystemScene />;
}
