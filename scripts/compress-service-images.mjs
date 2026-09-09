import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const sourceDir = path.resolve('public/services/images of services');
const outputDir = path.resolve('public/services');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const files = [
  { srcName: 'marksheet-digitizer.png', outName: 'marksheet-digitizer.webp' },
  { srcName: 'copygo.png', outName: 'copygo.webp' },
  { srcName: 'certif-maker.png', outName: 'certif-maker.webp' },
  { srcName: 'techzgreen.png', outName: 'techzgreen.webp' },
];

async function processFile(item) {
  const srcPath = path.join(sourceDir, item.srcName);
  const outPath = path.join(outputDir, item.outName);
  const meta = await sharp(srcPath).metadata();

  let targetBuf = null;
  let targetSize = 0;

  // Search for parameters giving file size between 70 KB (71680 B) and 90 KB (92160 B)
  for (let scale = 0.4; scale <= 3.0; scale += 0.05) {
    const w = Math.round(meta.width * scale);
    if (w < 50) continue;

    for (let q = 10; q <= 100; q += 2) {
      for (const fmt of ['webp', 'png']) {
        let pipeline = sharp(srcPath).resize({ width: w });
        let buf;
        if (fmt === 'webp') {
          buf = await pipeline.webp({ quality: q, lossless: q > 95 }).toBuffer();
        } else {
          buf = await pipeline.png({ quality: q, compressionLevel: Math.min(9, Math.floor((100 - q) / 10)) }).toBuffer();
        }

        if (buf.length >= 70 * 1024 && buf.length <= 90 * 1024) {
          targetBuf = buf;
          targetSize = buf.length;
          console.log(`Matched ${item.srcName} -> ${item.outName} (${fmt}, scale=${scale.toFixed(2)}, q=${q}): ${(targetSize / 1024).toFixed(2)} KB`);
          break;
        }
      }
      if (targetBuf) break;
    }
    if (targetBuf) break;
  }

  // Fallback if not found in exact loop
  if (!targetBuf) {
    targetBuf = await sharp(srcPath).webp({ quality: 85 }).toBuffer();
    targetSize = targetBuf.length;
    console.log(`Fallback ${item.outName}: ${(targetSize / 1024).toFixed(2)} KB`);
  }

  fs.writeFileSync(outPath, targetBuf);
}

async function run() {
  for (const item of files) {
    await processFile(item);
  }
}

run();
