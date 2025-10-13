import { useEffect, useRef, useState } from "react";
import { Group, Object3D } from "three";
import { LoopRepeat } from "three";
import { useAnimations, useGLTF } from "@react-three/drei";
import { PlanetRef, SolarSystemModelProps } from "../models/types/solarSystemModelTypes";
import { planetInfoDict } from "../models/types/solarSystemModelTypes";
import handlePlanetClick from "@/src/functions/handlePlanetClick";
import { PerspectiveCamera as ThreePerspectiveCamera } from "three";
import { useTranslations } from "next-intl";
import React from "react";

export function useSolarSystemModelViewModel({ isPlaying, controlsRef, setShowPortfolioSection, setPlanetIndex }: SolarSystemModelProps) {
    const t = useTranslations("SolarSystemScene");
    const cameraRef = useRef<ThreePerspectiveCamera | null>(null);
    const groupRef = useRef<Group>(null);

    const { scene, animations } = useGLTF("/models/solar-system.glb");
    const { actions } = useAnimations(animations, groupRef);

    const [planetRefs, setPlanetRefs] = useState<PlanetRef[]>([]);
    const activePlanet = useRef<PlanetRef | null>(null);
    const activePivot = useRef<Object3D | null>(null);

    useEffect(() => {
        const planets: PlanetRef[] = [];
        scene.traverse((child: Object3D) => {
            if (!child.name.includes("_") && child.name.toLowerCase() !== "scene") {
                planets.push({ mesh: child, textRef: React.createRef() });
            }
        });
        setPlanetRefs(planets);
    }, [scene]);

    useEffect(() => {
        if (!actions) return;
        Object.values(actions).forEach((action) => {
            if (action) {
                action.reset();
                action.setLoop(LoopRepeat, Infinity);
                action.clampWhenFinished = true;
                action.play();
            }
        });
    }, [actions]);

    useEffect(() => {
        if (!actions) return;
        Object.values(actions).forEach((action) => {
            if (action) action.paused = !isPlaying;
        });
    }, [actions, isPlaying]);

    const onPlanetClick = (planet: PlanetRef, showPortfolioSection: boolean) => {
        handlePlanetClick(planet, cameraRef, activePlanet, activePivot, scene, setShowPortfolioSection, showPortfolioSection);
        const info = planetInfoDict[planet.mesh.name];
        if (info) setPlanetIndex(info.index);
    };

    return {
        scene,
        groupRef,
        cameraRef,
        planetRefs,
        activePlanet,
        activePivot,
        controlsRef,
        t,

        onPlanetClick,
    };
}
