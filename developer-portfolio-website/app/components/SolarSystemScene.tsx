"use client";

import { useThree, Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations, Billboard } from "@react-three/drei";
import { useState, Suspense, useEffect, useRef, RefObject } from "react";
import { Group, LoopOnce, LoopRepeat, Mesh, Vector3 } from "three";
import { Text } from "@react-three/drei";
import React from "react";

interface SolarSystemModelProp {
  controls: RefObject<any>;
}

interface Offsets {
    yOffset : number,
    xOffset : number
}


function SolarSystemModel({ controls }: SolarSystemModelProp) { 
    //ToDo: remove after testing
    const { camera } = useThree();

    const group = useRef<Group>(null);
    const { scene, animations } = useGLTF("/models/solar-system.glb");
    const { actions } = useAnimations(animations, group);
    const [planetRefs, setPlanetRefs] = useState<{ mesh: any; textRef: React.RefObject<any> }[]>([]);
    const planetOffsets: Record<string, Offsets> = {
        mercury: { xOffset: 1, yOffset: 1 },
        venus: { xOffset: 8, yOffset: 4 },
        earth: { xOffset: 8, yOffset: 4 },
        mars: { xOffset: 8, yOffset: 1 },
        jupiter: { xOffset: 12, yOffset: 5 },
        saturn: { xOffset: 4, yOffset: 4 },
        uranus: { xOffset: 2, yOffset: 2 },
        neptune: { xOffset: 3, yOffset: 3 },
        sun: { xOffset: 26, yOffset: 9 },
        moon: { xOffset: 1, yOffset: 1 },
    };
    const planetNameToSectionName: Record<string, string> = {
        venus: "My tech stack",
        earth: "My Projects",
        jupiter: "Working Experience",
        sun: "About me",
    };

    const targetPlanet = useRef<any>(null);
    const targetCameraPos = useRef<Vector3 | null>(null);

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
                    console.log("pushed: " + child.name)
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
                const offSets = planetOffsets[planet.mesh.name] ?? 5;
                const worldPos = new Vector3();
                planet.mesh.getWorldPosition(worldPos);
                planet.textRef.current.position.set(worldPos.x, worldPos.y + offSets.yOffset, worldPos.z);
            }
        });

        if (targetPlanet.current && targetCameraPos.current) {
            const planetPos = new Vector3();
            targetPlanet.current.getWorldPosition(planetPos);

            // Transform the local offset into world space
            const worldOffset = targetCameraPos.current
                .clone()
                .applyQuaternion(targetPlanet.current.quaternion); 

            const desiredPos = planetPos.clone().add(worldOffset);

            camera.position.lerp(desiredPos, 0.05);
            camera.lookAt(planetPos);
        }
    });

    return (
        <group ref={group} scale={1}>
            <primitive
                object={scene}
                onPointerDown={(e: { object: { name: any; }; }) => {
                    const planet = planetRefs.find(p => p.mesh.name === e.object.name);
                    if (!planet) return;

                    // Choose the offset you want (e.g. right side of planet)
                    const offset = new Vector3(
                        planetOffsets[planet.mesh.name].xOffset, 
                        0, 
                        0
                    );

                    if (controls.current) {
                        controls.current.enabled = false; // freeze orbit controls
                    }

                    targetCameraPos.current = offset; // <-- store as RELATIVE offset
                    targetPlanet.current = planet.mesh;
                }}
        />

            {planetRefs.map((planet) => {
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
        </group>
    )
}

export default function SolarSystemScene() {
    const controls = useRef<any>(null);
    return (
        <div className="w-screen h-screen">
        <Canvas camera={{ position: [0, 40, 0], fov: 30 }}>
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <Suspense fallback={null}>
            <SolarSystemModel controls={ controls }/>
            </Suspense>
            <OrbitControls ref={controls} enableZoom={true}  />
        </Canvas>
        </div>
    );
}