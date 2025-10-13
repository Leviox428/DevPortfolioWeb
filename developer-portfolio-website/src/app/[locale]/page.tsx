"use client";

import dynamic from "next/dynamic";

const SolarSystemScene = dynamic(
  () => import("../components/scene/SolarSystemScene"),
  { ssr: false } // only load in browser
);

export default function Home() {
  return  <SolarSystemScene />;
}
