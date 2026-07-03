import { getAllScales } from "./lib/scales/loader";

const scales = getAllScales();

console.log(scales.map(s => s.name));