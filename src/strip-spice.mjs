import { GENERIC_MATCHER, loadFile, writeFile } from "./utils.mjs";

function getOriginalFromToken(token) {
    const segments = token.split("|").map((item) => item.trim());
    const originals = segments.map((segment) => {
        const [identifier, ...rest] = segment.split(" ");
        return rest.join(" ");
    });
    return originals[0];
}

function stripToStandardMD(spicedMarkDown) {
    return spicedMarkDown.replaceAll(GENERIC_MATCHER, (_, p1) => {
        return getOriginalFromToken(p1);
    });
}

export function main() {
    const filename = process.argv[2].split("/").splice(-1)[0].split(".smd")[0];
    const result = loadFile(process.argv[2]);
    const stripped = stripToStandardMD(result);
    writeFile(`${process.argv[3]}/${filename}.md`, stripped);
}

main();
