import sharp from "sharp";
import fs from "fs";
import path from "path";

const inputDir = "originals";
const outputDir = "public/images/cars";

fs.mkdirSync(outputDir, { recursive: true });

const files = fs.readdirSync(inputDir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));

for (const file of files) {
  const name = path.parse(file).name.toLowerCase();
  const output = path.join(outputDir, name + ".jpg");

  await sharp(path.join(inputDir, file))
    .rotate()
    .resize({ width: 1200, withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(output);

  const kb = Math.round(fs.statSync(output).size / 1024);
  console.log(name + ".jpg -> " + kb + " KB");
}