import { RefObject } from "react";
import { Object3D, Vector3 } from "three";
import { PlanetInfo } from "../components/SolarSystemScene";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";

export default function handlePlanetClick(
    planet: { mesh: Object3D; textRef: React.RefObject<any> },
    planetInfo: PlanetInfo,
    cameraRef: RefObject<any>,
    setActivePlanet: React.Dispatch<React.SetStateAction<any>>,
    controlsRef: RefObject<OrbitControlsImpl | null>
) {
   
    setActivePlanet(planet);

    if (!cameraRef.current || !planetInfo) return;
    // Reparent camera to planet
    cameraRef.current.parent?.remove(cameraRef.current);
    planet.mesh.add(cameraRef.current);

    const yOffset = planet.mesh.name === "earth" ? planetInfo.yOffset : 0;

    cameraRef.current.position.set(0, yOffset, planetInfo.zOffset);
    cameraRef.current.lookAt(0, 0, 0);

    // Update OrbitControls target if available
    if (controlsRef.current) {
        const worldPos = new Vector3();
        planet.mesh.getWorldPosition(worldPos);
        controlsRef.current.target.copy(worldPos);
        controlsRef.current.update();
    }
}