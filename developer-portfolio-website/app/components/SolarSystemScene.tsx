"use client";

import { useThree, Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations, Billboard, PerspectiveCamera, Html, Loader } from "@react-three/drei";
import { useState, Suspense, useEffect, useRef, RefObject } from "react";
import { Group, LoopOnce, LoopRepeat, Mesh, Object3D, Object3DEventMap, Vector3 } from "three";
import { Text } from "@react-three/drei";
import React from "react";
import { Play, Pause } from "lucide-react";
import { PlayPauseButton } from "./PausePlayButton";

interface PlanetInfo {
    yOffset : number,
    xOffset : number,
    zOffset : number,
    sectionName : string
}

type SolarSystemModelProps = {
    isPlaying: boolean;
};

function SolarSystemModel( { isPlaying } : SolarSystemModelProps) { 
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
        venus: { xOffset: 8, yOffset: 4, zOffset : 4, sectionName: "My tech stack" },
        earth: { xOffset: 8, yOffset: 2, zOffset : 2, sectionName: "My Projects" },
        mars: { xOffset: 8, yOffset: 1, zOffset : 8, sectionName: "Working Experience" },
        sun: { xOffset: 26, yOffset: 9, zOffset : 3, sectionName: "About me"},
    };

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
        
    });

    return (
        <group ref={group} scale={1}>
            <primitive
                object={scene}
                onPointerDown={(e: { object: { name: any; }; }) => {
                    const planet = planetRefs.find(p => p.mesh.name === e.object.name);
                    if (!planet) return;
                    setActivePlanet(planet);
                    //targetPlanet.current = planet.mesh; // optional if you still want to track
                    const planetOffset = planetInfoDict[planet.mesh.name];
                    // Re-parent the camera into the planet's group
                    if (cameraRef.current && planetOffset) {
                        // Remove from previous parent
                        cameraRef.current.parent?.remove(cameraRef.current);

                        // Add to the planet mesh or its group
                        planet.mesh.add(cameraRef.current);
                        var earthYOffset = 0;
                        if (planet.mesh.name == "earth") {
                            earthYOffset = planetOffset.yOffset
                        }
                        
                        // Set offset relative to planet
                        cameraRef.current.position.set(
                            0,
                            earthYOffset,
                            planetOffset.zOffset
                        );

                        // Look at the planet center
                        cameraRef.current.lookAt(0, 0, 0);
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
                            {planetInfoDict[planet.mesh.name].sectionName}
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
                {activePlanet && (
                    <Html
                        position={[0, 0, -2]} // 2 units in front of camera
                        transform
                        distanceFactor={1.5}
                    >
                    <div className="bg-white/80 p-4 rounded-xl shadow-lg">
                        <h2 className="text-black font-bold">{activePlanet.mesh.name}</h2>
                        <p className="text-black text-sm">
                            {planetInfoDict[activePlanet.mesh.name].sectionName || "Unknown Section"}
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
                    <SolarSystemModel isPlaying={isPlaying} />
                </Suspense>
                <OrbitControls enableZoom={true}  />
            </Canvas>
            <PlayPauseButton
                isPlaying={isPlaying}
                onToggle={() => setIsPlaying((prev) => !prev)}
            />
        </div>
    );
}