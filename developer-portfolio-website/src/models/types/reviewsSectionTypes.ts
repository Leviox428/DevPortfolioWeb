import { FieldInfo } from "./common";

export interface ReviewType {
    author: string;
    content: string;
    stars: number;
    source: string;
    id: string;
}

export const authCardFieldInfoDict: Record<string, FieldInfo> = {
    email: { min: 10, max: 50},
    password: { min: 8, max: 50 },
}

export const reviewEditorFieldInfoDict: Record<string, FieldInfo> = {
    author: { min: 6, max: 30 },
    content: { min: 10, max: 200}
}
