// components/SkillSection.tsx
import Image, { StaticImageData } from "next/image";
import { JSX } from "react";

interface SkillSectionProps {
    title: string;
    image: StaticImageData;
    icons: { src?: string; svg?: JSX.Element }[];
}

export default function TechStack({ title, image, icons }: SkillSectionProps) {
  return (
        <div className="flex flex-1 flex-row md:flex-col gap-2 justify-center items-center">
            <div className="max-w-1/4 md:max-w-none md:h-auto md:max-h-1/5">
                <Image src={image} alt={title} className="object-cover w-full h-full" />
            </div>
            <div className="relative rounded-md border border-zinc-800/30 w-full h-full">
                <div className="flex items-center justify-center min-h-[50px] h-1/6 bg-zinc-800/30">
                <p className="text-center text-xl lg:text-2xl xl:text-3xl">{title}</p>
                </div>
                    <div className="p-3 flex flex-wrap gap-6 items-center justify-center">
                        {icons.map((icon, i) =>
                            icon.src ? (
                                <img
                                    key={i}
                                    className="w-1/5 sm:w-1/5 md:w-1/4 lg:w-1/4"
                                    src={icon.src}
                                    alt=""
                                />
                                ) : (
                                <div key={i} className="w-1/5 sm:w-1/5 md:w-1/4 lg:w-1/4 fill-white">
                                    {icon.svg}
                                </div>
                            )
                        )}
                </div>
            </div>
        </div>
  );
}
