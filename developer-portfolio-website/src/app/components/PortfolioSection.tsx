import AboutMeSection from "./portfolioSections/AboutMeSection";
import Particles from "./aestheticComponents/Particles";

interface Props {
    onClose: () => void;
}


export default function PortfolioSecion({ onClose } : Props) {
    return (
        <div className="absolute overflow-hidden inset-0 mx-4 my-18 xl:mx-auto xl:w-[1200px] 
            bg-black/65 rounded-2xl shadow-lg backdrop-blur-sm border border-white/5">            
            <Particles
                particleColors={['#ffffff', '#ffffff']}
                particleCount={250}
                particleSpread={8}
                speed={0.1}
                particleBaseSize={80}
                moveParticlesOnHover={false}
                alphaParticles={false}
                disableRotation={false}
                className="z-0"
            />
            <button onClick={onClose} className="text-2xl absolute top-2 right-3 text-white hover:text-red-500 z-10">
                ×
            </button>
            <AboutMeSection></AboutMeSection>
        </div>
    )
}