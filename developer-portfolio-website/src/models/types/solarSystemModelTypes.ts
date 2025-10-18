import { RefObject } from "react";
import { Group, Object3D } from "three";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { PerspectiveCamera as ThreePerspectiveCamera } from "three";

export interface PlanetInfo {
    yOffset: number;
    zOffset: number;
    sectionKey: string;
    index: number;
}

export const planetInfoDict: Record<string, PlanetInfo> = {
    sun: { yOffset: 8.5, zOffset: 15, sectionKey: "about", index: 1 },
    venus: { yOffset: 2.5, zOffset: 4, sectionKey: "techStack", index: 2 },
    earth: { yOffset: 2.7, zOffset: 4, sectionKey: "projects", index: 3 },
    mars: { yOffset: 1.5, zOffset: 2, sectionKey: "experience", index: 4 },
    jupiter: { yOffset: 4.83, zOffset: 8, sectionKey: "skills", index: 5 },
    saturn: { yOffset: 4.83, zOffset: 8, sectionKey: "reachOut", index: 6 }
};

export const indexToPlanet: Record<number, string> = Object.fromEntries(
    Object.entries(planetInfoDict).map(([key, info]) => [info.index, key])
);

export interface PlanetRef {
    mesh: Object3D;
    textRef: RefObject<Group | null>;
}

export interface SolarSystemModelProps {
    isPlaying: boolean;
    controlsRef: RefObject<OrbitControlsImpl | null>;
    setShowPortfolioSection: React.Dispatch<React.SetStateAction<boolean>>;
    setPlanetIndex: React.Dispatch<React.SetStateAction<number>>;
}

export interface SolarSystemModelRef {
    handlePlanetClick: (planet: PlanetRef, showPortfolioSection: boolean) => void;
    planetRefs: PlanetRef[];
    cameraRef: RefObject<ThreePerspectiveCamera | null>;
}