import EntryPoint from "@/src/components/EntryPoint";
import SolarSystemScene from "@/src/components/solarSystemModel/SolarSystemScene";
import { generateToken } from "@/src/models/serverModels/pageModel";

export default async function Home() {
  const token = await generateToken();

  return  (
    <EntryPoint token={token}>
      <SolarSystemScene />
    </EntryPoint>
  );
}
