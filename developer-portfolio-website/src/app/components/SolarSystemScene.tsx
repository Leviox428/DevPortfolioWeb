"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations, Billboard, PerspectiveCamera, Html, Loader } from "@react-three/drei";
import { useState, Suspense, useEffect, useRef, RefObject } from "react";
import { Group, LoopRepeat, Object3D, Object3DEventMap, Vector3 } from "three";
import { Text } from "@react-three/drei";
import React from "react";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { PlayPauseButton } from "./PausePlayButton";
import handlePlanetClick from "../functions/handlePlanetClick";
import { LanguageButton } from "./LanguageButton";
import { useTranslations } from 'next-intl';

export interface PlanetInfo {
    yOffset : number,
    xOffset : number,
    zOffset : number,
    sectionKey : string
}

type SolarSystemModelProps = {
    isPlaying: boolean;
    controlsRef: React.RefObject<OrbitControlsImpl | null>;
};

function SolarSystemModel( { isPlaying, controlsRef } : SolarSystemModelProps) { 
    const cameraRef = useRef<any>(null);
    const group = useRef<Group>(null);

    const t = useTranslations('SolarSystemScene');

    const { scene, animations } = useGLTF("/models/solar-system.glb");
    const { actions } = useAnimations(animations, group);

    const [planetRefs, setPlanetRefs] = useState<{ mesh: Object3D<Object3DEventMap>; textRef: React.RefObject<any> }[]>([]);
    const activePlanet = useRef<{
        mesh: Object3D<Object3DEventMap>;
        textRef: React.RefObject<any>;
    } | null>(null);

    const activePivot = useRef<Object3D>(null);

    const planetInfoDict: Record<string, PlanetInfo> = {
        venus: { xOffset: 8, yOffset: 3, zOffset : 5, sectionKey: "techStack" },
        earth: { xOffset: 8, yOffset: 3, zOffset : 4, sectionKey: "projects" },
        mars: { xOffset: 8, yOffset: 2, zOffset : 3, sectionKey: "experience" },
        sun: { xOffset: 26, yOffset: 9, zOffset : 15, sectionKey: "about"},
    };

    //controls animation of scene
    useEffect(() => {
        if (actions) {
            Object.values(actions).forEach((action) => {
                if (action) {
                    action.reset();
                    action.setLoop(LoopRepeat, Infinity);
                    action.clampWhenFinished = true;

                    if (isPlaying) {
                        action.play();
                    } else {
                        action.paused = true;
                    }
                }
            });
        }
    }, [actions, isPlaying]);

    //fills planet from scene into planetRefs
    useEffect(() => { 
        const planets: { mesh: Object3D<Object3DEventMap>; textRef: React.RefObject<any> }[] = []; 
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
        } else {
            controlsRef.current.target.set(0, 0, 0);
        }        
    });

    return (
        <group ref={group} scale={1}>
            <primitive
                object={scene}
                onPointerDown={(e: { stopPropagation: () => void; intersections: any[]; }) => {                    
                    e.stopPropagation();
                    const intersection = e.intersections.find((i: { object: Object3D<Object3DEventMap>; }) =>
                        planetRefs.some((p) => p.mesh === i.object)
                    );

                    if (!intersection) return;

                    const planet = planetRefs.find((p) => p.mesh === intersection.object);
                                     
                    if (!planet) return;
                    activePlanet.current = planet;

                    const planetInfo = planetInfoDict[planet.mesh.name];                                           
                    if (!cameraRef.current || !planetInfo) return;
                    
                    // Reparent camera 
                    cameraRef.current.parent?.remove(cameraRef.current);
                    const pivot = new Object3D();
                    scene.add(pivot);
                    planet.mesh.getWorldPosition(pivot.position);
                    pivot.add(cameraRef.current);
                    activePivot.current = pivot;

                    const yOffset = planet.mesh.name === "earth" ? planetInfo.yOffset : 0;

                    cameraRef.current.position.set(0, yOffset, planetInfo.zOffset);
                    cameraRef.current.lookAt(pivot.position);

                    // Update OrbitControls target if available
                    if (controlsRef.current) {
                        const worldPos = new Vector3();
                        planet.mesh.getWorldPosition(worldPos);
                        controlsRef.current.target.copy(worldPos);
                        controlsRef.current.update();
                    }
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
}

export default function SolarSystemScene() {
    const [isPlaying, setIsPlaying] = useState(true);
    const controlsRef = useRef<OrbitControlsImpl>(null);

    return (
        <div className="w-screen h-screen">
            <Canvas>
                <ambientLight intensity={0.4} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                <Suspense fallback={
                    <Html center>
                        <div className="flex items-center justify-center h-screen">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
                        </div>
                    </Html>                  
                }>
                    <SolarSystemModel isPlaying={isPlaying} controlsRef={controlsRef} />
                </Suspense>
                <OrbitControls ref={controlsRef} enableZoom={true}  />
            </Canvas>
            <PlayPauseButton
                isPlaying={isPlaying}
                onToggle={() => setIsPlaying((prev) => !prev)}
            />
            <LanguageButton></LanguageButton>
        </div>
    );
}