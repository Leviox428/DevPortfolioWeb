"use client";

import { useGLTF, useAnimations, Billboard, Text, PerspectiveCamera   } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useTranslations } from "next-intl";
import React, { useRef, useState, useEffect, forwardRef, RefObject, useImperativeHandle } from "react";
import { Group, Object3D, Object3DEventMap, LoopRepeat, Vector3, Intersection } from "three";
import { PerspectiveCamera as ThreePerspectiveCamera } from "three";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import handlePlanetClick from "../../functions/handlePlanetClick";

interface PlanetInfo {
    yOffset : number,
    zOffset : number,
    sectionKey : string,
    index : number
};

export const planetInfoDict: Record<string, PlanetInfo> = {
    venus: { yOffset: 2.5, zOffset: 4, sectionKey: "techStack", index: 2 },
    earth: { yOffset: 2.7, zOffset: 4, sectionKey: "projects", index: 3 },
    mars: { yOffset: 1.5, zOffset: 2, sectionKey: "experience", index: 4 },
    sun: { yOffset: 8.5, zOffset: 15, sectionKey: "about", index: 1},
};

export const indexToPlanet: Record<number, string> = Object.fromEntries(
    Object.entries(planetInfoDict).map(([key, info]) => [info.index, key])
);

export interface PlanetRef {
    mesh: Object3D;
    textRef: RefObject<Group<Object3DEventMap> | null>;
};

type SolarSystemModelProps = {
    isPlaying: boolean;
    controlsRef: React.RefObject<OrbitControlsImpl | null>;
    setShowPortfolioSection: React.Dispatch<React.SetStateAction<boolean>>,
    setPlanetIndex: React.Dispatch<React.SetStateAction<number>>
};

export interface SolarSystemModelRef {
    handlePlanetClick: (planet: PlanetRef) => void;
    planetRefs: PlanetRef[];
};

const SolarSystemModel = forwardRef<SolarSystemModelRef, SolarSystemModelProps>(
    ({ isPlaying, controlsRef, setShowPortfolioSection, setPlanetIndex }, ref) => {
    const cameraRef = useRef<ThreePerspectiveCamera | null>(null);
    const group = useRef<Group>(null);
    const { scene, animations } = useGLTF("/models/solar-system.glb");
    const t = useTranslations('SolarSystemScene');

    const { actions } = useAnimations(animations, group);

    const [planetRefs, setPlanetRefs] = useState<PlanetRef[]>([]);
    const activePlanet = useRef<PlanetRef | null>(null);

    const activePivot = useRef<Object3D | null>(null);


    useImperativeHandle(ref, () => ({
        planetRefs,
        handlePlanetClick: (planet) => {
            handlePlanetClick(
                planet,
                cameraRef,
                activePlanet,
                activePivot,
                scene,
                setShowPortfolioSection
            );
        },
    }));

    //controls animation of scene
    useEffect(() => {
        if (actions) {
            Object.values(actions).forEach((action) => {
                if (action) {
                    action.reset();
                    action.setLoop(LoopRepeat, Infinity);
                    action.clampWhenFinished = true;
                    action.play();
                }
            });
        }
    }, [actions]);

    useEffect(() => {
        if (actions) {
            Object.values(actions).forEach((action) => {
                if (!action) return;
                action.paused = !isPlaying; 
            });
        }
    }, [actions, isPlaying]);

    //fills planet from scene into planetRefs
    useEffect(() => { 
        const planets: { mesh: Object3D<Object3DEventMap>; textRef: React.RefObject<Group<Object3DEventMap> | null> }[] = []; 
        scene.traverse((child) => { 
            if (!child.name.includes("_") && child.name.toLowerCase() != "scene") {
                    planets.push({                    
                        mesh: child, 
                        textRef: React.createRef(), 
                }); 
            }                     
        }); 
        setPlanetRefs(planets); 
    }, [scene]);

    //moves labels, active pivot and handles orbitcontrols change
    useFrame((state, delta) => {
        planetRefs.forEach((planet) => {
            if (planet.textRef.current &&  planetInfoDict[planet.mesh.name]) {
               
                const offSets = planetInfoDict[planet.mesh.name] ?? 5;
                const worldPos = new Vector3();
                planet.mesh.getWorldPosition(worldPos);
                planet.textRef.current.position.set(worldPos.x, worldPos.y + offSets.yOffset, worldPos.z);
                
            }
        });
        if (!controlsRef.current) return;

        if (activePlanet.current && activePivot.current) {

            activePlanet.current.mesh.getWorldPosition(activePivot.current.position);

            const worldPos = new Vector3();
            activePlanet.current.mesh.getWorldPosition(worldPos);
            controlsRef.current.target.copy(worldPos);
            controlsRef.current.update();

            activePlanet.current.mesh.rotation.y += delta * 0.3;

        } else {
            controlsRef.current.target.set(0, 0, 0);
        }
        
    });


    return (
        <group ref={group} scale={1}>
            <primitive
                object={scene}
                onPointerDown={(e: { stopPropagation: () => void; intersections: Intersection<Object3D>[] ; }) => {                    
                    e.stopPropagation();
                    const intersection = e.intersections.find((i: { object: Object3D<Object3DEventMap>; }) =>
                        planetRefs.some((p) => p.mesh === i.object)
                    );

                    if (!intersection) return;

                    const planet = planetRefs.find((p) => p.mesh === intersection.object);
                                     
                    if (!planet) return;
                    
                    handlePlanetClick(planet, cameraRef, activePlanet, activePivot, scene, setShowPortfolioSection);

                    const planetInfo = planetInfoDict[planet.mesh.name];         
                    setPlanetIndex(planetInfo.index);
                }}
            />

            {planetRefs.map((planet) => {
                if (!planetInfoDict[planet.mesh.name]) return;
                
                const position = new Vector3();
                planet.mesh.getWorldPosition(position); 

                return (
                    <Billboard
                        ref={planet.textRef}                     
                        key={planet.mesh.name}
                        position={[position.x, position.y + planetInfoDict[planet.mesh.name].yOffset, position.z]}                     
                    >
                        <Text                                                                              
                            fontSize={0.7}
                            color="white"
                            anchorX="center"
                            anchorY="top"
                            >
                            {t(planetInfoDict[planet.mesh.name].sectionKey)}
                        </Text>            
                    </Billboard>
                );
            })}
            
            <PerspectiveCamera
                ref={cameraRef}
                makeDefault
                fov={60}
                position={[0, 55, 0]}
                >              
            </PerspectiveCamera>          
        </group>
    )
})
SolarSystemModel.displayName = "SolarSystemModel";

export default SolarSystemModel;
useGLTF.preload("/models/solar-system.glb");