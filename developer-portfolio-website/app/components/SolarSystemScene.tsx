"use client";

import { useThree, Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations, Billboard, PerspectiveCamera } from "@react-three/drei";
import { useState, Suspense, useEffect, useRef, RefObject } from "react";
import { Group, LoopOnce, LoopRepeat, Mesh, Vector3 } from "three";
import { Text } from "@react-three/drei";
import React from "react";

interface Offsets {
    yOffset : number,
    xOffset : number,
    zOffset : number
}


function SolarSystemModel() { 
    const cameraRef = useRef<any>(null);
    const group = useRef<Group>(null);
    const { scene, animations } = useGLTF("/models/solar-system.glb");
    const { actions } = useAnimations(animations, group);
    const [planetRefs, setPlanetRefs] = useState<{ mesh: any; textRef: React.RefObject<any> }[]>([]);
    const planetOffsets: Record<string, Offsets> = {
        venus: { xOffset: 8, yOffset: 4, zOffset : 4 },
        earth: { xOffset: 8, yOffset: 2, zOffset : 2 },
        mars: { xOffset: 8, yOffset: 1, zOffset : 8 },
        jupiter: { xOffset: 12, yOffset: 5, zOffset : 4 },
        saturn: { xOffset: 4, yOffset: 4, zOffset : 4 },
        uranus: { xOffset: 2, yOffset: 2, zOffset : 8 },
        neptune: { xOffset: 3, yOffset: 3, zOffset : 8 },
        sun: { xOffset: 26, yOffset: 9, zOffset : 3},
    };
    const planetNameToSectionName: Record<string, string> = {
        venus: "My tech stack",
        earth: "My Projects",
        jupiter: "Working Experience",
        sun: "About me",
    };

    const targetPlanet = useRef<any>(null);
    const offset = useRef<Vector3>(new Vector3());
    const isReparented = useRef(false);

    useEffect(() => {
        if (actions) {
            Object.values(actions).forEach((action) => {
                if (action) {
                    action.reset();
                    action.setLoop(LoopRepeat, 1); 
                    action.clampWhenFinished = true; 
                    action.play();
                }
            });
        }
    }, [actions]);

    useEffect(() => { 
        const planets: { mesh: any; textRef: React.RefObject<any> }[] = []; 
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
                if (planetOffsets[planet.mesh.name]) {
                    const offSets = planetOffsets[planet.mesh.name] ?? 5;
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

                    //targetPlanet.current = planet.mesh; // optional if you still want to track
                    const planetOffset = planetOffsets[planet.mesh.name];
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
                if (!planetOffsets[planet.mesh.name]) return;
                const position = new Vector3();
                planet.mesh.getWorldPosition(position); 

                return (
                    <Billboard
                        ref={planet.textRef}
                        key={planet.mesh.name}
                        position={[position.x, position.y + planetOffsets[planet.mesh.name].yOffset, position.z]}                     
                    >
                        <Text                                                                              
                            fontSize={0.7}
                            color="white"
                            anchorX="center"
                            anchorY="top"
                            >
                            {planetNameToSectionName[planet.mesh.name]}
                        </Text>            
                    </Billboard>
                );

            })}
            <PerspectiveCamera ref={cameraRef} makeDefault fov={50} position={[0, 55, 0]} />
        </group>
    )
}

export default function SolarSystemScene() {
    return (
        <div className="w-screen h-screen">
        <Canvas>
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <Suspense fallback={null}>
            <SolarSystemModel/>
            </Suspense>
            <OrbitControls enableZoom={true}  />
        </Canvas>
        </div>
    );
}