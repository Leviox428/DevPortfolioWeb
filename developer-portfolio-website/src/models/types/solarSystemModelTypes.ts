import { RefObject } from "react";
import { Group, Object3D } from "three";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { PerspectiveCamera as ThreePerspectiveCamera } from "three";

// --- Planet info ---
export interface PlanetInfo {
    yOffset: number;
    zOffset: number;
    sectionKey: string;
    index: number;
}

// Planet info dictionary
export const planetInfoDict: Record<string, PlanetInfo> = {
    venus: { yOffset: 2.5, zOffset: 4, sectionKey: "techStack", index: 2 },
    earth: { yOffset: 2.7, zOffset: 4, sectionKey: "projects", index: 3 },
    mars: { yOffset: 1.5, zOffset: 2, sectionKey: "experience", index: 4 },
    sun: { yOffset: 8.5, zOffset: 15, sectionKey: "about", index: 1 },
    
};

// Map index back to planet
export const indexToPlanet: Record<number, string> = Object.fromEntries(
    Object.entries(planetInfoDict).map(([key, info]) => [info.index, key])
);

// --- Planet reference ---
export interface PlanetRef {
    mesh: Object3D;
    textRef: RefObject<Group | null>;
}

// --- Props passed from parent ---
export interface SolarSystemModelProps {
    isPlaying: boolean;
    controlsRef: RefObject<OrbitControlsImpl | null>;
    setShowPortfolioSection: React.Dispatch<React.SetStateAction<boolean>>;
    setPlanetIndex: React.Dispatch<React.SetStateAction<number>>;
}

// --- Ref methods exposed by the component ---
export interface SolarSystemModelRef {
    handlePlanetClick: (planet: PlanetRef, showPortfolioSection: boolean) => void;
    planetRefs: PlanetRef[];
    cameraRef: RefObject<ThreePerspectiveCamera | null>;
}