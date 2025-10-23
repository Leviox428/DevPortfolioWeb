import { FieldInfo } from "./common";

export const reachOutFieldInfoDict: Record<string, FieldInfo> = {
    email: { min: 10, max: 40},
    subject: { min: 10, max: 50 },
    message: { min: 20, max: 200}
}

