export const useConstructUrl = (key: string): string => {
    const baseUrl = process.env.NEXT_PUBLIC_STORAGE_PUBLIC_URL;
    if (!baseUrl) {
        throw new Error("Missing NEXT_PUBLIC_STORAGE_PUBLIC_URL");
    }
    const encodedKey = key.split("/").map(encodeURIComponent).join("/");

    return `${baseUrl.replace(/\/$/, "")}/${encodedKey}`;
};
