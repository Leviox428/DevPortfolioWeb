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

    const { scene, animations } = useGLTF("/models/solar-system.glb");
    const { actions } = useAnimations(animations, group);

    const [planetRefs, setPlanetRefs] = useState<{ mesh: Object3D<Object3DEventMap>; textRef: React.RefObject<any> }[]>([]);
    const [activePlanet, setActivePlanet] = useState<{
        mesh: Object3D<Object3DEventMap>;
        textRef: React.RefObject<any>;
    } | null>(null);

    const planetInfoDict: Record<string, PlanetInfo> = {
        venus: { xOffset: 8, yOffset: 4, zOffset : 4, sectionKey: "My tech stack" },
        earth: { xOffset: 8, yOffset: 2, zOffset : 2, sectionKey: "My Projects" },
        mars: { xOffset: 8, yOffset: 3, zOffset : 8, sectionKey: "Working Experience" },
        sun: { xOffset: 26, yOffset: 9, zOffset : 3, sectionKey: "About me"},
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

    //moves labels and handles orbitcontrols change
    useFrame(() => {
        planetRefs.forEach((planet) => {
            if (planet.textRef.current) {
                if (planetInfoDict[planet.mesh.name]) {
                    const offSets = planetInfoDict[planet.mesh.name] ?? 5;
                    const worldPos = new Vector3();
                    planet.mesh.getWorldPosition(worldPos);
                    planet.textRef.current.position.set(worldPos.x, worldPos.y + offSets.yOffset, worldPos.z);
                }
            }
        });
        if (!controlsRef.current) return;

        if (activePlanet) {
            const worldPos = new Vector3();
            activePlanet.mesh.getWorldPosition(worldPos);
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
                    //const planet = planetRefs.find(p => p.mesh.name === e.object.name);
                    if (!planet) return;
                    const planetInfo = planetInfoDict[planet.mesh.name];
                    handlePlanetClick(planet, planetInfo, cameraRef, setActivePlanet, controlsRef);
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
                            {planetInfoDict[planet.mesh.name].sectionKey}
                        </Text>            
                    </Billboard>
                );
            })}
            
            <PerspectiveCamera
                ref={cameraRef}
                makeDefault
                fov={50}
                position={[0, 55, 0]}
                >
                {activePlanet && planetInfoDict[activePlanet.mesh.name] && (
                    <Html
                        position={[0, 0, -2]} // 2 units in front of camera
                        transform
                        distanceFactor={1.5}
                    >
                    <div className="bg-white/80 p-4 rounded-xl shadow-lg">
                        <h2 className="text-black font-bold">{activePlanet.mesh.name}</h2>
                        <p className="text-black text-sm">
                            {planetInfoDict[activePlanet.mesh.name].sectionKey || "Unknown Section"}
                        </p>
                        <button
                        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
                        onClick={() => setActivePlanet(null)}
                        >
                        Close
                        </button>
                    </div>
                    </Html>
                )}
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
        </div>
    );
}