export interface Project {
    id: number;
    title: { en: string; sk: string };
    shortDescription: { en: string; sk: string };
    languages: string[];
    link?: string;
    thumbnail: string;
}
