"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations, Billboard } from "@react-three/drei";
import { useState, Suspense, useEffect, useRef } from "react";
import { Group, LoopOnce, Object3D, Vector3 } from "three";
import { Text } from "@react-three/drei";
import React from "react";

function SolarSystemModel() { 
    const group = useRef<Group>(null);
    const { scene, animations } = useGLTF("/models/solar-system.glb");
    const { actions } = useAnimations(animations, group);
    const [planetRefs, setPlanetRefs] = useState<{ name: string; mesh: any; textRef: React.RefObject<any> }[]>([]);
    
        

    useEffect(() => {
        if (actions) {
            Object.values(actions).forEach((action) => {
                if (action) {
                    action.reset();
                    action.setLoop(LoopOnce, 1); 
                    action.clampWhenFinished = true; 
                    action.play();
                }
            });
        }
    }, [actions]);

    useEffect(() => {
        var i = 0;
        const planets: { name: string; mesh: any; textRef: React.RefObject<any> }[] = [];
        scene.traverse((child) => {
            console.log(i + child.name);
            i++;
            planets.push({
                name: child.name,
                mesh: child,
                textRef: React.createRef(),
            });
        });
        setPlanetRefs(planets);
    }, [scene]);

    useFrame(() => {
        planetRefs.forEach((planet) => {
            if (planet.textRef.current) {
                const worldPos = new Vector3();
                planet.mesh.getWorldPosition(worldPos);
                planet.textRef.current.position.set(worldPos.x, worldPos.y + 1, worldPos.z);
            }
        });
    });

    return (
        <group ref={group} scale={1}>
            <primitive
                object={scene}
                onPointerDown={(e: { object: { name: any; }; }) => {
                    console.log("Clicked planet:", e.object.name);
                }}
        />

            {planetRefs.map((planet) => {
                const position = new Vector3();
                planet.mesh.getWorldPosition(position); 

                return (
     
                    <Text
                        ref={planet.textRef}
                        position={[position.x, position.y + 1, position.z]}
                        fontSize={0.5}
                        color="white"
                        anchorX="center"
                        anchorY="bottom"
                        >
                        {planet.name}
                    </Text>
        
                );

            })}
        </group>
    )
}

export default function SolarSystemScene() {
  return (
    <div className="w-screen h-screen">
      <Canvas camera={{ position: [0, 40, 0], fov: 30 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Suspense fallback={null}>
          <SolarSystemModel />
        </Suspense>
        <OrbitControls enableZoom={true} />
      </Canvas>
    </div>
  );
}