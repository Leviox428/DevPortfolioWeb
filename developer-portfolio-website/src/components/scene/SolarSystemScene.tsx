"use client";

import { VscDebugStepOver } from "react-icons/vsc";
import { VscDebugStepBack } from "react-icons/vsc";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html, Loader } from "@react-three/drei";
import { Suspense } from "react";
import React from "react";
import { PlayPauseButton } from "../PausePlayButton";
import { LanguageButton } from "../LanguageButton";
import PortfolioSecion from "../PortfolioSection";
import Particles from "../animatedComponents/Particles";
import SolarSystemModel from "../models/SolarSystemModel";
import { useSolarSystemViewModel } from "@/src/viewModels/useSolarSystemViewModel";

export default function SolarSystemScene() {
    const vm = useSolarSystemViewModel();
    
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
                    <SolarSystemModel
                        ref={vm.solarSystemModelRef}
                        setShowPortfolioSection={vm.setShowPortfolioSection}
                        setPlanetIndex={vm.setPlanetIndex}
                        isPlaying={vm.isPlaying}
                        controlsRef={vm.controlsRef}
                    />
                </Suspense>
                <OrbitControls ref={vm.controlsRef} enableZoom={true}  />
            </Canvas>          
            { vm.showPortfolioSection && (
                <PortfolioSecion 
                    planetIndex={vm.planetIndex} 
                    onClose={vm.closePortfolio}
                />
            )}
            <PlayPauseButton
                isPlaying={vm.isPlaying}
                onToggle={vm.togglePlay}
            />
            <LanguageButton></LanguageButton>
            { vm.showPortfolioSection && vm.canGoPrev &&  (
                <div className="fixed bottom-4 left-4">
                    <button
                        onClick={vm.goPrevPlanet}
                        className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg hover:bg-gray-100 transition"
                    >
                        <VscDebugStepBack color="black" size={32}></VscDebugStepBack>
                    </button>
                </div>
            )}
            { vm.showPortfolioSection && vm.canGoNext && (
                <div className="fixed bottom-4 right-4">
                    <button
                        onClick={vm.goNextPlanet}
                        className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg hover:bg-gray-100 transition"
                    >
                        <VscDebugStepOver color="black" size={32}></VscDebugStepOver>                   
                    </button>
                </div>
            )}          
        </div>
    );
}