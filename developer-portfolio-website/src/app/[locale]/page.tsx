import EntryPoint from "@/src/components/EntryPoint";
import { generateToken } from "@/src/models/serverModels/pageModel";

export default async function Home() {
  const token = await generateToken();

  return  (
    <EntryPoint
      token={token}
    >     
    </EntryPoint>
  );
}
