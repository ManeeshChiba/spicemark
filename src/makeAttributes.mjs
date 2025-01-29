import { GENERIC_MATCHER } from "./utils.mjs";

export function makeAttribute(string) {
    const payload = string.replaceAll(GENERIC_MATCHER, (_, p1) => {
        const [identifier, ...rest] = p1.split(" ");
        // const g = rest.split("|").trim();
        console.log(identifier);
        switch (identifier) {
            // Ingredient
            case "i":
                return "Ingredient";
            // Cookware
            case "c":
                return "Cookware";
            // Time
            case "t":
                return "Time";
            default:
                return "Entity not found";
        }
    });
    // console.log(payload);
    return string;
}
