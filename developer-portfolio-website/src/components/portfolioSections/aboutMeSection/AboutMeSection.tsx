import { SiGmail } from "react-icons/si";
import { MdOutlinePhoneAndroid } from "react-icons/md";
import { useLocale, useTranslations } from "next-intl";
import { ArrowUpRightIcon } from "lucide-react";
import Image from "next/image";
import LinkedinImage from "@/public/images/linkedin.png"
import GithubImage from "@/public/images/github.png"
import ShinyText from "../../animatedComponents/ShinyText";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Button } from "../../shadcnComponents/Button";
import useAboutMeSectionViewModel from "@/src/viewModels/portfolioSectionViewModels/useAboutMeSectionViewModel";


export default function AboutMeSection() {
    const { text } = useAboutMeSectionViewModel();

    const t = useTranslations('AboutMeSection');
    const locale = useLocale();

    const handleOpenResume = () => {
        const resumeUrl = locale === 'sk' ? 'https://pmnhapadgqmn5xru.public.blob.vercel-storage.com/%C5%BDivotopis.pdf' : 'https://pmnhapadgqmn5xru.public.blob.vercel-storage.com/Resume.pdf';
        window.open(resumeUrl, '_blank');
    };

    const handleGithubIconClicked = () => {
        window.open("https://github.com/Leviox428", '_blank');
    }

    const handleLinkedinIconClicked = () => {
        window.open("https://www.linkedin.com/in/marek-dvorský-bba20a295", '_blank');
    }

    return(
        <div className="pb-15 overflow-y-auto scrollbar relative flex gap-4 justify-center flex-col w-full h-full bg-cover bg-[url('/images/photoOfMeBG.png')] bg-position-[79%] md:bg-position-[80%] lg:bg-position-[90%] xl:bg-position-[100%]">  
            <div className="absolute bottom-0 z-0 left-1/2 -translate-x-1/2 sm:left-auto sm:right-0 sm:translate-x-0"
            >

            </div>    
            
            <div className="ml-5 mr-5 mt-5">
                <p className="text-sm sm:text-base md:text-xl lg:text-3xl xl:text-5xl">{t("intro")}</p>
                <ShinyText 
                    text="Software Developer" 
                    disabled={false} 
                    speed={2} 
                    className='text-xl md:text-4xl lg:text-5xl xl:text-7xl mt-5' 
                />
            </div>

            <div className="flex w-full px-5 mt-6 sm:w-md md:w-lg lg:w-xl h-auto">            
                <ScrollArea type="always" className="rounded-md border p-4 md:text-lg lg:text-xl xl:text-2xl bg-zinc-800/30">
                    {text}
                </ScrollArea>
            </div>

            <Button
                onClick={handleOpenResume}
                className="ml-5 bg-white w-[110px] text-black cursor-pointer"
            >
               <ArrowUpRightIcon /> {t("resume")}
            </Button>

            <div className="mx-5 relative flex gap-2 h-auto w-auto">
                <Image
                    src={LinkedinImage}
                    width={32}
                    height={32}
                    alt="linkedin"
                    onClick={handleLinkedinIconClicked}
                    className="cursor-pointer"
                >
                </Image>
                <Image
                    src={GithubImage}
                    width={32}
                    height={32}
                    alt="github"
                    onClick={handleGithubIconClicked}
                    className="cursor-pointer"
                >
                </Image>
            </div>


            <div className="absolute bottom-0 w-full h-15 backdrop-blur-md bg-black/40 text-white p-4 flex items-center justify-between md:justify-start md:gap-2">
                <div className="flex items-center gap-2">
                    <SiGmail size={26} />
                    <a
                        href="mailto:ma12rek@gmail.com"
                        className="text-xs sm:text-sm md:text-base text-white hover:underline"
                    >
                        ma12rek@gmail.com
                    </a>
                </div>
                <div className="flex items-center gap-2">
                    <MdOutlinePhoneAndroid size={26} />
                    <a
                        href="tel:+421944502198"
                        className="text-xs sm:text-sm md:text-base text-white hover:underline"
                    >
                        0944502198
                    </a>
                </div>
            </div>
        </div>
    )
}