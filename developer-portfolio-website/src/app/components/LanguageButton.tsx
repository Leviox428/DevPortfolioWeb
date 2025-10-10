"use client";

import { usePathname, useRouter } from "next/navigation";
import SkFlagPng from "../../../public/images/slovakia.png"; 
import GbFlagPng from "../../../public/images/united-kingdom.png"; 
import Image from "next/image";

export function LanguageButton() {
  const router = useRouter();
  const pathname = usePathname();

  const currentLang = pathname.startsWith("/en") ? "en" : "sk";

  const toggleLanguage = () => {
    const newLang = currentLang === "sk" ? "en" : "sk";
    const newPath = pathname.replace(/^\/(sk|en)/, `/${newLang}`);
    router.push(newPath);
  };

  return (
    <div className="fixed top-4 right-4">
      <button
        onClick={toggleLanguage}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg hover:bg-gray-100 transition"
      >
         <Image
            src={currentLang === "sk" ? SkFlagPng : GbFlagPng}
            alt={currentLang === "sk" ? "Slovenská vlajka" : "UK flag"}
            width={32} 
            height={32}
        />
      </button>
    </div>
  );
}