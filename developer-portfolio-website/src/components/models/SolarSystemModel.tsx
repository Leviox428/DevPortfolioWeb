"use client";

import { useGLTF, useAnimations, Billboard, Text, PerspectiveCamera   } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { forwardRef, useImperativeHandle } from "react";
import { Object3D, Object3DEventMap, LoopRepeat, Vector3, Intersection } from "three";
import handlePlanetClick from "../../functions/handlePlanetClick";
import { planetInfoDict, PlanetRef, SolarSystemModelProps, SolarSystemModelRef } from "@/src/models/types/solarSystemModelTypes";
import { useSolarSystemModelViewModel } from "@/src/viewModels/useSolarSystemModelViewModel";

/*interface PlanetInfo {
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
    handlePlanetClick: (planet: PlanetRef, showPortfolioSection: boolean) => void;
    planetRefs: PlanetRef[];
    cameraRef: RefObject<ThreePerspectiveCamera | null>;
};*/

const SolarSystemModel = forwardRef<SolarSystemModelRef, SolarSystemModelProps>(
    ({ isPlaying, controlsRef, setShowPortfolioSection, setPlanetIndex }, ref) => {
    
    const vm = useSolarSystemModelViewModel({ isPlaying, controlsRef ,setShowPortfolioSection, setPlanetIndex });    

    useImperativeHandle(ref, () => ({
        planetRefs: vm.planetRefs,
        cameraRef: vm.cameraRef,
        handlePlanetClick: (planet: PlanetRef, showPortfolioSection: boolean) =>
            vm.onPlanetClick(planet, showPortfolioSection),
    }));


    //moves labels, active pivot and handles orbitcontrols change
    useFrame((state, delta) => {
        vm.planetRefs.forEach((planet) => {
            if (planet.textRef.current &&  planetInfoDict[planet.mesh.name]) {
               
                const offSets = planetInfoDict[planet.mesh.name] ?? 5;
                const worldPos = new Vector3();
                planet.mesh.getWorldPosition(worldPos);
                planet.textRef.current.position.set(worldPos.x, worldPos.y + offSets.yOffset, worldPos.z);
                
            }
        });
        if (!vm.controlsRef.current) return;

        if (vm.activePlanet.current && vm.activePivot.current) {

            vm.activePlanet.current.mesh.getWorldPosition(vm.activePivot.current.position);

            const worldPos = new Vector3();
            vm.activePlanet.current.mesh.getWorldPosition(worldPos);
            vm.controlsRef.current.target.copy(worldPos);
            vm.controlsRef.current.update();

            vm.activePlanet.current.mesh.rotation.y += delta * 0.3;

        } else {
            vm.controlsRef.current.target.set(0, 0, 0);
        }
        
    });

    return (
        <group ref={vm.groupRef} scale={1}>
            <primitive
                object={vm.scene}
                onPointerDown={(e: { stopPropagation: () => void; intersections: Intersection<Object3D>[] ; }) => {                    
                    e.stopPropagation();
                    const intersection = e.intersections.find((i: { object: Object3D<Object3DEventMap>; }) =>
                        vm.planetRefs.some((p) => p.mesh === i.object)
                    );

                    if (!intersection) return;

                    const planet = vm.planetRefs.find((p) => p.mesh === intersection.object);
                                     
                    if (!planet) return;
                    
                    handlePlanetClick(planet, vm.cameraRef, vm.activePlanet, vm.activePivot, vm.scene, setShowPortfolioSection);

                    const planetInfo = planetInfoDict[planet.mesh.name];         
                    setPlanetIndex(planetInfo.index);
                }}
            />

            {vm.planetRefs.map((planet) => {
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
                            {vm.t(planetInfoDict[planet.mesh.name].sectionKey)}
                        </Text>            
                    </Billboard>
                );
            })}
            
            <PerspectiveCamera
                ref={vm.cameraRef}
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