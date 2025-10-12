"use client";

import { VscDebugStepOver } from "react-icons/vsc";
import { VscDebugStepBack } from "react-icons/vsc";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html, Loader } from "@react-three/drei";
import { useState, Suspense, useRef } from "react";
import React from "react";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { PlayPauseButton } from "../app/components/PausePlayButton";
import { LanguageButton } from "../app/components/LanguageButton";
import PortfolioSecion from "../app/components/PortfolioSection";
import Particles from "../app/components/animatedComponents/Particles";
import { planetInfoDict, SolarSystemModelRef } from "../messages/SolarSystemModel";
import handlePlanetIndexChange from "../app/functions/handlePlanetIndexChange";
import { PlanetIndexChangeAction } from "@/src/enums/PlanetIndexChangeAction";
import dynamic from "next/dynamic";

const SolarSystemModel = dynamic(
    () => import("../messages/SolarSystemModel"),
    { ssr: false }
);

export default function SolarSystemScene() {
    const [isPlaying, setIsPlaying] = useState(true);
    const [showPortfolioSection, setShowPortfolioSection] = useState(false);
    const [planetIndex, setPlanetIndex] = useState(0);
    const controlsRef = useRef<OrbitControlsImpl>(null);
    const solarSystemRef = useRef<SolarSystemModelRef>(null);

    return (
        <div className="relative w-screen h-screen">    
            <Particles
                particleColors={['#ffffff', '#ffffff']}
                particleCount={300}
                particleSpread={20}
                speed={0.1}
                particleBaseSize={70}
                moveParticlesOnHover={true}
                alphaParticles={false}
                disableRotation={false}
                className="z-0"
            />   
            <Canvas>
                <ambientLight intensity={0.4} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                <Suspense fallback={
                    <Html center>
                        <Loader/>
                    </Html>                  
                }>
                    <SolarSystemModel ref={solarSystemRef} setShowPortfolioSection={setShowPortfolioSection} setPlanetIndex={setPlanetIndex} isPlaying={isPlaying} controlsRef={controlsRef} />
                </Suspense>
                <OrbitControls ref={controlsRef} enableZoom={true}  />
            </Canvas>          
            { showPortfolioSection && <PortfolioSecion planetIndex={planetIndex} onClose={() => setShowPortfolioSection(false)}></PortfolioSecion> }
            <PlayPauseButton
                isPlaying={isPlaying}
                onToggle={() => setIsPlaying((prev) => !prev)}
            />
            <LanguageButton></LanguageButton>
            { showPortfolioSection && planetIndex > 1 && 
                <div className="fixed bottom-4 left-4">
                <button
                    onClick={() =>
                        handlePlanetIndexChange(PlanetIndexChangeAction.Decrement, solarSystemRef, setPlanetIndex, planetIndex)
                    }
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg hover:bg-gray-100 transition"
                >
                    <VscDebugStepBack color="black" size={32}></VscDebugStepBack>
                </button>
            </div>
            }
            { showPortfolioSection && planetIndex < Object.keys(planetInfoDict).length &&
                <div className="fixed bottom-4 right-4">
                    <button
                        onClick={() =>
                            handlePlanetIndexChange(PlanetIndexChangeAction.Increment, solarSystemRef, setPlanetIndex, planetIndex)
                        }
                        className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg hover:bg-gray-100 transition"
                    >
                        <VscDebugStepOver color="black" size={32}></VscDebugStepOver>                   
                    </button>
                </div>
            }          
        </div>
    );
}