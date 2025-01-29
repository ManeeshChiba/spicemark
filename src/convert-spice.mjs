import fm from "front-matter";
import HTMLParser from "node-html-parser";
import { Marked } from "marked";
import { FRONT_MATTER_MATCHER, loadFile, writeFile } from "./utils.mjs";
import { makeAttribute } from "./makeAttributes.mjs";

function extractAttributes(fileContent) {
    return fm(fileContent).attributes;
}

function getFragment(childNodes) {
    return [...childNodes]
        .map((node) => {
            const { tagName, text } = node;
            if (node.childNodes && node.childNodes.length > 0) {
                return {
                    tag: tagName,
                    content: getFragment(node.childNodes),
                };
            }
            if (!tagName && text === "\n") {
                return null;
            }
            return {
                tag: tagName,
                content: makeAttribute(text),
            };
        })
        .filter((x) => x);
}

function main() {
    const filename = process.argv[2].split("/").splice(-1)[0].split(".smd")[0];
    const file = loadFile(process.argv[2]);
    const fmRemoved = file.replace(FRONT_MATTER_MATCHER, "");
    const mkd = new Marked();
    const html = mkd.parse(fmRemoved);
    const dom = HTMLParser.parse(html);
    const struct = getFragment(dom.childNodes);
    const converted = JSON.stringify(
        {
            frontMatter: extractAttributes(file),
            html: struct,
        },
        null,
        4
    );
    writeFile(`${process.argv[3]}/${filename}.json`, converted);
}

main();
