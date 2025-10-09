import Image from "next/image";
import ShinyText from "../aestheticComponents/ShinyText"
import AboutMeImage from "../../../../public/images/photoOfMe.png"; 

export default function AboutMeSection() {
    return(
        <div className="relative justify-between flex flex-col w-full h-full">  
            <div className="absolute bottom-0 z-0 left-1/2 -translate-x-1/2 sm:left-auto sm:right-0 sm:translate-x-0"
            >
                <Image        
                    alt=""            
                    src={AboutMeImage}
                    width={500}
                    height={600}
                    className="object-cover h-max
                    w-[60vw] max-w-[400px] sm:w-[350px] md:w-[400px] lg:w-[500px]"
                />
            </div>    
            
            <div className="ml-5 mr-5 mt-5">
                <p className="text-2xl">Hi, my name is Marek Dvorský and I am a</p>
                <ShinyText 
                    text="Software Developer" 
                    disabled={false} 
                    speed={2} 
                    className='text-2xl' 
                />
            </div>

            <div className="justify-self-end w-full h-1/10 backdrop-blur-md bg-black/40 text-white p-4 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium">Let’s Connect</p>
                    <p className="text-xs text-gray-300">me@example.com</p>
                </div>
                <button className="z-10 bg-white/10 border border-white/30 text-white text-sm px-4 py-2 rounded-lg hover:bg-white/20 transition">
                    Contact Me
                </button>
            </div>
        </div>
    )
}