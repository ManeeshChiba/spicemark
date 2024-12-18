import fse from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import * as Cook from "@cooklang/cooklang-ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ROOT = path.resolve(__dirname, "../");
const LOOKUP_DIR = path.join(ROOT, "lookup");
const RECIPES_PATH = path.join(ROOT, "recipes");
const ROUTES_PATH = path.join(ROOT, "src/routes");

const ensureDir = () => {
  fse.emptyDirSync(LOOKUP_DIR);
};

async function readDirctory() {
  return await fse.readdir(RECIPES_PATH);
}

async function getFileContent(filename: string) {
  const location = path.resolve(RECIPES_PATH, filename);
  if (fse.existsSync(location)) {
    return await fse.readFile(location, "utf-8");
  }
  return null;
}

const readReciepes = async () => {
  const paths = await readDirctory().then((files) =>
    files.filter((file) => file.includes(".cook"))
  );
  return await Promise.all(
    paths.map(async (filename) => {
      const content = await getFileContent(filename);
      const data: Cook.ParseResult = new Cook.Parser().parse(content ?? "");
      return { title: filename, data };
    })
  );
};

export interface LookupObjectData {
  title: string;
  ingredients: string[];
  totalTimeMinutes: number;
  cookwares: string[];
}

export type LookupObject = Record<string, LookupObjectData>;

const processRecipes = (recipeArray: { title: string; data: Cook.ParseResult }[]): LookupObject => {
  const collectTimes = (steps: Cook.Step[]) => {
    return steps
      .flatMap((step) => step)
      .filter((step) => step.type == "timer")
      .map((step: Cook.Timer) => {
        switch (step.units) {
          case "min":
          case "minute":
          case "minutes":
            return parseInt(`${step.quantity}`);
          case "hrs":
          case "hour":
          case "hours":
            return parseInt(`${step.quantity}`) * 60;
          default:
            return parseInt(`${step.quantity}`);
        }
      })
      .reduce((partialSum, a) => partialSum + a, 0);
  };

  return recipeArray.reduce((acc, cur) => {
    const title = cur.title.replace(".cook", "").toLocaleLowerCase();

    const course = cur.data.metadata?.["Course"] ?? "Other";

    const data: LookupObjectData = {
      title,
      ingredients: cur.data?.ingredients.map((ing) => ing.name) ?? [],
      cookwares: cur.data?.cookwares.map((cw) => cw.name) ?? [],
      totalTimeMinutes: collectTimes(cur.data.steps)
    };

    return {
      ...acc,
      [course.toLowerCase()]: {
        ...acc[course.toLowerCase()],
        [title]: data
      }
    };
  }, {});
};

async function build() {
  ensureDir();
  const recipes = await readReciepes();
  const processed = processRecipes(recipes);
  // For lookup
  fse.writeFileSync(path.join(LOOKUP_DIR, "lookup.json"), JSON.stringify(processed, null, 4));
  const inject = `
  <script>
    import { onMount } from 'svelte';

    onMount(() => {
      window.lookup = ${JSON.stringify(processed)}
    });
  </script>`;
  fse.writeFileSync(path.join(ROUTES_PATH, "Lookup.svelte"), inject);
}

build();
