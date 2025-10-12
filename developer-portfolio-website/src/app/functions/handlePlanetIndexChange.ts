import { indexToPlanet, SolarSystemModelRef } from "../components/models/SolarSystemModel";
import { PlanetIndexChangeAction } from "@/src/enums/PlanetIndexChangeAction";

export default function handlePlanetIndexChange(action: PlanetIndexChangeAction, solarSystemModelRef: React.RefObject<SolarSystemModelRef | null>, 
    setPlanetIndex: React.Dispatch<React.SetStateAction<number>>, currentIndex: number) {
        if (!solarSystemModelRef.current) return;

        const newIndex = action === PlanetIndexChangeAction.Increment ? currentIndex + 1 : currentIndex - 1;
        setPlanetIndex(newIndex);

        const planetName = indexToPlanet[newIndex];
        if (!planetName) return;

        const planet = solarSystemModelRef.current.planetRefs.find((planet) => planet.mesh.name === planetName);
        if (!planet) return;

        solarSystemModelRef.current.handlePlanetClick(planet);
}