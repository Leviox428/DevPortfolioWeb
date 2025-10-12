import { RefObject } from "react";
import { Group, Object3D, Object3DEventMap, Vector3 } from "three";
import { planetInfoDict, PlanetRef } from "../../messages/SolarSystemModel";

export default function handlePlanetClick(
    planet: { mesh: Object3D; textRef: React.RefObject<any> },
    cameraRef: RefObject<any>,
    activePlanet: React.RefObject<PlanetRef | null>,
    activePivot: React.RefObject<any>,
    scene: Group<Object3DEventMap>,
    setShowPortfolioSection: React.Dispatch<React.SetStateAction<boolean>>,
) {
   
    const planetInfo = planetInfoDict[planet.mesh.name];                                      
    activePlanet.current = planet;

    if (!cameraRef.current || !planetInfo) return;
    // Reparent camera 
    cameraRef.current.parent?.remove(cameraRef.current);
    const pivot = new Object3D();
    scene.add(pivot);
    planet.mesh.getWorldPosition(pivot.position);
    pivot.add(cameraRef.current);
    activePivot.current = pivot;

    //activePlanet.current.textRef

    const yOffset = planet.mesh.name === "earth" ? planetInfo.yOffset : 0;

    cameraRef.current.position.set(0, yOffset, planetInfo.zOffset);
    cameraRef.current.lookAt(planet);

    setShowPortfolioSection(true);
    
}