const fs = require("fs");
const path = require("path");

const SCALES_DIR = path.join(__dirname, "../../data/scales");

function getScales() {
  const files = fs
    .readdirSync(SCALES_DIR)
    .filter((file) => file.endsWith(".json"));

  return files.map((file) => {
    const content = fs.readFileSync(path.join(SCALES_DIR, file), "utf8");
    return JSON.parse(content);
  });
}

module.exports = { getScales };
function getCategories() {
  const scales = getScales();

  return [...new Set(scales.map((s) => s.category))];
}
function searchScales(query) {
  query = query.toLowerCase();

  return getScales().filter((scale) => {
    const text = [
      scale.name,
      scale.fullName,
      scale.description,
      ...(scale.keywords || [])
    ]
      .join(" ")
      .toLowerCase();

    return text.includes(query);
  });
}

module.exports = {
  getScales,
  getCategories,
  searchScales,
};