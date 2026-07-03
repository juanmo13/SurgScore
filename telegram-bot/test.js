import { getAllScales } from "../lib/scales/loader.ts";

const scales = getAllScales();

console.log(scales.map(s => s.name));