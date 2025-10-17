import { useRef, useState } from "react";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { PlanetIndexChangeAction } from "@/src/models/enums/planetIndexChangeAction";
import handlePlanetIndexChange from "@/src/functions/handlePlanetIndexChange";
import { SolarSystemModelRef, planetInfoDict } from "../models/types/solarSystemModelTypes";

export default function useSolarSystemViewModel() {
    const [isPlaying, setIsPlaying] = useState(true);
    const [showPortfolioSection, setShowPortfolioSection] = useState(false);
    const [planetIndex, setPlanetIndex] = useState(0);

    const controlsRef = useRef<OrbitControlsImpl>(null);
    const solarSystemModelRef = useRef<SolarSystemModelRef>(null);

    const togglePlay = () => setIsPlaying((prev) => !prev);
    const closePortfolio = () => {
        setShowPortfolioSection(false);
        if (!solarSystemModelRef.current) return;
        const planet = solarSystemModelRef.current.planetRefs.find((planet) => planet.mesh.name === "sun");
        if (!planet) return;
        solarSystemModelRef.current.handlePlanetClick(planet, false)
    }

    const goNextPlanet = () =>
        handlePlanetIndexChange(
            PlanetIndexChangeAction.Increment,
            solarSystemModelRef,
            setPlanetIndex,
            planetIndex
        );

    const goPrevPlanet = () =>        
        handlePlanetIndexChange(
            PlanetIndexChangeAction.Decrement,
            solarSystemModelRef,
            setPlanetIndex,
            planetIndex
        );

    const canGoNext = planetIndex < Object.keys(planetInfoDict).length;
    const canGoPrev = planetIndex > 1;

    return {
        // state
        isPlaying,
        showPortfolioSection,
        planetIndex,
        controlsRef,
        solarSystemModelRef,
        
        // computed
        canGoNext,
        canGoPrev,

        // actions
        togglePlay,
        setShowPortfolioSection,
        closePortfolio,
        goNextPlanet,
        goPrevPlanet,
        setPlanetIndex,
    };
}
