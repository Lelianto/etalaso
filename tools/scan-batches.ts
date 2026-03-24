import { readdirSync, readFileSync, lstatSync, existsSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'

function findPlacesFiles(dir: string): string[] {
  const results: string[] = []
  if (!existsSync(dir)) return results
  for (const file of readdirSync(dir)) {
    const full = join(dir, file)
    const stat = lstatSync(full)
    if (stat.isDirectory()) results.push(...findPlacesFiles(full))
    else if (file === 'places.json') results.push(full)
  }
  return results
}

const downloads = join(homedir(), 'Downloads')
const batches = readdirSync(downloads)
  .filter(d => d.startsWith('scraper-all-batch') && !d.endsWith('.zip'))
  .sort()

let totalNew = 0

for (const batch of batches) {
  const seedDir = join(downloads, batch, 'tools/scraper/seed-data')
  const files = findPlacesFiles(seedDir)
  console.log(`\n📦 ${batch}`)

  for (const f of files) {
    const rel = f.replace(seedDir + '/', '').replace('/places.json', '')
    const data = JSON.parse(readFileSync(f, 'utf-8'))
    const total = data.places?.length || 0
    const umkm = (data.places || []).filter((p: { website: string | null }) => !p.website).length
    console.log(`   ${rel}: ${total} total, ${umkm} UMKM`)
    totalNew += umkm
  }
}

console.log(`\n📊 Total UMKM across all batches: ${totalNew}`)
