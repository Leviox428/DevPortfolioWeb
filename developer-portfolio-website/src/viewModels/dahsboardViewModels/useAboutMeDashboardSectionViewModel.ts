import { useToken } from "@/src/contexts/TokenContext";
import { fetchAboutMe, updateAboutMe } from "@/src/models/sectionsModels/aboutMeModel";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function useAboutMeDashboardSectionViewModel() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = useToken();
  const locale = usePathname().startsWith("/en") ? "en" : "sk";

  const loadAboutMe = async () => {
    try {
        setError(null)
        setIsLoading(true);

        const data = await fetchAboutMe(token, locale);
        setText(data.text ?? "");
    } catch (err: any) {
        setError(err.message);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAboutMe();
  }, []);

  const saveAboutMe = async () => {
    try {
      setIsSaving(true);
      setError(null);

      await updateAboutMe(text, token, locale);
      await loadAboutMe();

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    text,
    setText,
    isLoading,
    isSaving,
    error,
    saveAboutMe,
  };
}