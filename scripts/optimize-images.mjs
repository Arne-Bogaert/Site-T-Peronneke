import sharp from 'sharp'
import { readdir } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const assetsDir = path.join(__dirname, '../src/assets')

const targets = [
  { input: "'T Perron Logo.png",          output: "'T Perron Logo.webp",          quality: 90 },
  { input: "'T Perron Korte Papegaai.png", output: "'T Perron Korte Papegaai.webp", quality: 90 },
  { input: 'hero.png',                     output: 'hero.webp',                     quality: 85 },
  { input: 'Foto_interieur.jpg',           output: 'Foto_interieur.webp',           quality: 82 },
]

for (const { input, output, quality } of targets) {
  const src  = path.join(assetsDir, input)
  const dest = path.join(assetsDir, output)
  try {
    const info = await sharp(src).webp({ quality }).toFile(dest)
    const before = (await import('fs')).statSync(src).size
    const after  = info.size
    const pct    = Math.round((1 - after / before) * 100)
    console.log(`✓ ${output}  ${(before/1024).toFixed(0)}K → ${(after/1024).toFixed(0)}K  (-${pct}%)`)
  } catch (e) {
    console.error(`✗ ${input}: ${e.message}`)
  }
}
