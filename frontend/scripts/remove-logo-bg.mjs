import sharp from 'sharp';
import { copyFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const source = process.argv[2] || path.join(root, 'public', 'techloom-logo.png');
const output = path.join(root, 'public', 'techloom-logo.png');
const backup = path.join(root, 'public', 'techloom-logo.original.png');

async function removeWhiteBackground(inputPath, outputPath) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const brightness = (r + g + b) / 3;

    if (brightness >= 248) {
      data[i + 3] = 0;
    } else if (brightness >= 230) {
      const fade = 1 - (brightness - 230) / (248 - 230);
      data[i + 3] = Math.round(255 * fade);
    }
  }

  await sharp(data, { raw: { width, height, channels } })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(outputPath);

  console.log(`Saved transparent logo: ${outputPath} (${width}x${height})`);
}

copyFileSync(source, backup);
await removeWhiteBackground(source, output);
console.log(`Backup: ${backup}`);