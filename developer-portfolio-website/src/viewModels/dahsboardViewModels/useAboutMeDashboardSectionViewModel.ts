import { useToken } from "@/src/contexts/TokenContext";
import { fetchAboutMe, updateAboutMe } from "@/src/models/sectionsModels/aboutMeModel";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function useAboutMeDashboardSectionViewModel() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState("");
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleUpload = async () => {
    if (!file) return setUploadStatus("Please select a file.");

    setUploadStatus("Uploading...");

    try {
      const res = await fetch("/api/cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.token}`,
          "x-locale": locale

        },
        body: file,
      });

      const text = await res.text();
      setUploadStatus(text);
    } catch (err: any) {
      setUploadStatus("Upload failed: " + err.message);
    }
  };

  return {
    text,
    isLoading,
    isSaving,
    error,
    file,
    uploadStatus,

    setText,
    saveAboutMe,
    handleFileChange,
    handleUpload
  };
}