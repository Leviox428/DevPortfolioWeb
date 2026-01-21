import { FieldInfo } from "./common";

export interface ReviewType {
    fullName: string;
    content: string;
    stars: number;
    source: string;
    id: string;
}

export const authCardFieldInfoDict: Record<string, FieldInfo> = {
    email: { min: 10, max: 50},
    password: { min: 8, max: 50 },
    fullName: { min: 4, max: 50}
}

export const reviewEditorFieldInfoDict: Record<string, FieldInfo> = {
    content: { min: 10, max: 200}
}

