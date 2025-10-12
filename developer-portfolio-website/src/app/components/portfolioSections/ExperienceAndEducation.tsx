import { Separator } from "../shadcnComponents/Separator";
import DecryptedText from "../animatedComponents/DecryptedText";

export default function ExperienceAndEducation() {
    return (
        <div className="relative flex-col flex w-full h-full p-6 gap-8 overflow-y-auto">
            <DecryptedText 
                speed={10}
                maxIterations={100}
                text="Education:"
                animateOn="view"
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
                parentClassName="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
                >
            </DecryptedText>
            
            <div className="flex wrap flex-col md:flex-row gap-4 place-items-center">       
                <img className="w-[150px] h-[80px]" src="/images/unizaLogo.png" alt="Uniza logo" />
                <p className="text-md lg:text-xl xl:text-2xl"><strong>2022-2025:</strong></p>
                <p className="xl:text-lg">Currently studying 3rd year of bachelor degree at univerzity of Žilina</p>
            </div>  

            <Separator className="bg-zinc-300/90"></Separator>

            <DecryptedText 
                speed={10}
                maxIterations={100}
                text="Experience:"
                animateOn="view"
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
                parentClassName="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
            >
            </DecryptedText>

            <div className="flex wrap flex-col md:flex-row gap-4 place-items-center mt-5">
                <img 
                    className="w-[150px] h-[80px]" 
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/wordpress/wordpress-original.svg"
                >
                </img>
                <p className="text-md lg:text-xl xl:text-2xl"><strong>Self-employed | 2022 – 2024:</strong></p>
                <ul className="list-disc list-inside text-base xl:text-lg space-y-1">
                    <li>Designed and developed custom WordPress websites for clients.</li>
                    <li>Customized themes and plugins to meet project requirements.</li>
                    <li>Implemented SEO, performance, and security optimizations.</li>
                    <li>Provided ongoing maintenance, support, and technical consultation.</li>
                </ul>
            </div>  
        </div>
    )
}