import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { Skeleton } from "./shadcnComponents/Skeleton";

interface ProjectCardProps { 
    title: string;
    description: string;
    thumbnail: string;
    link?: string;
}

export default function ProjectCard({ title, description, thumbnail, link }: ProjectCardProps) {
    const [isLoading, setIsLoading] = useState(true)
    return (
        <div 
            className="relative group w-full md:w-1/2 h-1/2 bg-black/65 overflow-hidden cursor-pointer"
            onClick={() => {
                if (link) window.open(link, "_blank", "noopener, noreferrer")
            }}
        >
            <motion.div
                className="absolute inset-0"
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                 {isLoading && (
                    <Skeleton className="absolute inset-0 h-full w-full rounded-xl bg-zinc-600/80" />
                )}

                <Image                    
                    src={thumbnail}
                    alt={title}
                    fill
                    loading="lazy"
                    className={`object-cover transition-transform duration-500 ease-out group-hover:scale-110 ${
                        isLoading ? "opacity-0" : "opacity-100"
                    }`}
                    onLoadingComplete={() => setIsLoading(false)}
                />
            </motion.div>
            <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-center p-6">
                <div>
                    <h3 className="text-white text-lg lg:text-xl xl:text-2xl font-bold mb-2">{title}</h3>
                    <p className="text-gray-200 text-sm lg:text-md xl:text-lg leading-relaxed">{description}</p>
                </div>
            </div>
        </div>
    )
}