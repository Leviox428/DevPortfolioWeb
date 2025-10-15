interface FieldInfo {
    min: number;
    max: number;
}

export const fieldInfoDict: Record<string, FieldInfo> = {
    email: { min: 10, max: 40},
    subject: { min: 10, max: 50 },
    message: { min: 20, max: 200}
}

