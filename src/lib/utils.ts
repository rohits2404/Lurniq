import {
    uniqueNamesGenerator,
    adjectives,
    animals,
} from "unique-names-generator";

export { cn } from "cn";

export function generateSlug(): string {
    const randomName = uniqueNamesGenerator({
        dictionaries: [adjectives, animals],
        separator: "-",
        length: 2,
        style: "lowerCase",
    });

    const randomNumber = Math.floor(1000 + Math.random() * 9000);

    return `${randomName}-${randomNumber}`;
}
