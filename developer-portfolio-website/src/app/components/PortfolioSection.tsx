import AboutMeSection from "./portfolioSections/AboutMeSection";
import Image from "next/image";
import CloseSVG from "../../../public/svgs/close.svg";

interface Props {
    onClose: () => void;
    planetIndex: number;
}


export default function PortfolioSecion({ onClose, planetIndex } : Props) {
    const renderSection = () => {
        switch (planetIndex) {
            case 1:
                return <AboutMeSection />;
            default:
                return <div className="text-white p-6">Coming soon 🚀</div>;
        }
    };
    return (
        <div className="absolute overflow-hidden inset-0 mx-4 my-18 xl:mx-auto xl:w-[1200px] 
            bg-black/65 rounded-2xl shadow-lg backdrop-blur-sm border border-white/5">            

            <svg 
                onClick={onClose}
                className="absolute top-1 right-1 hover:text-red-500 z-2"
                width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" 
                stroke="#ffffffff">
                <g id="SVGRepo_tracerCarrier"></g>
                <g id="SVGRepo_iconCarrier"> 
                <path d="M7 17L16.8995 7.10051" stroke="#ffffffff"></path> 
                <path d="M7 7.00001L16.8995 16.8995" stroke="#ffffffff"></path> </g>
            </svg>
            {renderSection()}
        </div>
    )
}