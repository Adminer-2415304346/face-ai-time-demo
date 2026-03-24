import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

const sourceRoot = path.resolve(
  projectRoot,
  '..',
  'images'
)

const publicRoot = path.join(projectRoot, 'public', 'images', 'demo')
const recognitionMockPath = path.join(projectRoot, 'src', 'mock', 'recognition.js')
const datasetMockPath = path.join(projectRoot, 'src', 'mock', 'dataset.js')

const validExts = new Set(['.jpg', '.jpeg', '.png', '.bmp', '.webp'])
const ignoredIdentityTokens = new Set(['Other'])
const ignoredIdentities = new Set(['0', 'L'])
const splitPriority = ['test', 'val', 'train']

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true })
}

function resetDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true })
  ensureDir(dir)
}

function toPosix(p) {
  return p.split(path.sep).join('/')
}

function parseIdentity(filename) {
  const base = path.basename(filename, path.extname(filename))
  const parts = base.split('_')

  if (parts.length <= 2) {
    return base
  }

  const identityParts = parts.slice(2, -1).filter(Boolean).filter((part) => !ignoredIdentityTokens.has(part))
  const identity = (identityParts.length ? identityParts : parts.slice(2)).join(' ').trim()
  return identity || base
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function readDataset() {
  const identities = new Map()
  const yearSet = new Set()
  let totalImages = 0

  for (const split of fs.readdirSync(sourceRoot, { withFileTypes: true })) {
    if (!split.isDirectory()) continue
    const splitName = split.name
    const splitPath = path.join(sourceRoot, splitName)

    for (const yearDir of fs.readdirSync(splitPath, { withFileTypes: true })) {
      if (!yearDir.isDirectory()) continue
      const year = yearDir.name
      const yearPath = path.join(splitPath, year)
      yearSet.add(year)

      for (const file of fs.readdirSync(yearPath, { withFileTypes: true })) {
        if (!file.isFile()) continue

        const ext = path.extname(file.name).toLowerCase()
        if (!validExts.has(ext)) continue

        const identity = parseIdentity(file.name)
        const fullPath = path.join(yearPath, file.name)
        totalImages += 1

        if (!identities.has(identity)) {
          identities.set(identity, {
            name: identity,
            count: 0,
            years: new Map(),
            splits: new Map()
          })
        }

        const record = identities.get(identity)
        record.count += 1

        if (!record.years.has(year)) {
          record.years.set(year, [])
        }

        record.years.get(year).push({
          split: splitName,
          year,
          filename: file.name,
          fullPath
        })

        record.splits.set(splitName, (record.splits.get(splitName) || 0) + 1)
      }
    }
  }

  return {
    identities: [...identities.values()],
    totalImages,
    years: [...yearSet].sort()
  }
}

function compareFiles(a, b) {
  return splitPriority.indexOf(a.split) - splitPriority.indexOf(b.split) || a.filename.localeCompare(b.filename)
}

function getPreferredFile(files) {
  return [...files].sort(compareFiles)[0]
}

function copyAsset(sourceFile, relativePath) {
  const targetPath = path.join(publicRoot, relativePath)
  ensureDir(path.dirname(targetPath))
  fs.copyFileSync(sourceFile.fullPath, targetPath)
  return `/${toPosix(path.join('images', 'demo', relativePath))}`
}

function getLatestYear(record) {
  return [...record.years.keys()].sort().at(-1)
}

function getRepresentativeCover(record) {
  const latestYear = getLatestYear(record)
  return getPreferredFile(record.years.get(latestYear))
}

function chooseRecognitionSet(records) {
  const filtered = records.filter((item) => item.years.size >= 4 && !ignoredIdentities.has(item.name) && item.name.length >= 3)
  const sorted = filtered.sort((a, b) => b.years.size - a.years.size || b.count - a.count)
  return {
    target: sorted[0],
    candidates: sorted.slice(1, 4),
    showcase: sorted.slice(0, 8)
  }
}

function buildRecognitionMock(targetRecord, candidateRecords) {
  const targetSlug = slugify(targetRecord.name)
  const targetCover = getRepresentativeCover(targetRecord)
  const sortedYears = [...targetRecord.years.keys()].sort()

  const timeline = sortedYears.slice(0, 4).map((year, index) => {
    const file = getPreferredFile(targetRecord.years.get(year))
    return {
      id: String(index + 1),
      year: Number(year),
      label: `第 ${index + 1} 时期`,
      image: copyAsset(file, path.join('recognition', 'timeline', `${targetSlug}-${year}${path.extname(file.filename).toLowerCase()}`))
    }
  })

  const latestYear = getLatestYear(targetRecord)
  const targetCoverUrl = copyAsset(
    targetCover,
    path.join('recognition', `${targetSlug}-target${path.extname(targetCover.filename).toLowerCase()}`)
  )

  const candidates = candidateRecords.map((record, index) => {
    const cover = getRepresentativeCover(record)
    const coverUrl = copyAsset(
      cover,
      path.join('recognition', `candidate-${index + 1}-${slugify(record.name)}${path.extname(cover.filename).toLowerCase()}`)
    )

    return {
      id: String(index + 1),
      name: record.name,
      code: `ID-${String(index + 2).padStart(3, '0')}`,
      confidence: Number((96.8 - index * 6.7).toFixed(1)),
      latestYear: Number(getLatestYear(record)),
      type: 'non-human',
      cover: coverUrl
    }
  })

  return `export const recognitionMock = ${JSON.stringify(
    {
      uploadPreview: targetCoverUrl,
      result: {
        status: 'matched',
        confidence: 98.2,
        predictedAge: '--',
        predictedStage: '跨时期稳定',
        target: {
          name: targetRecord.name,
          code: 'ID-001',
          cover: targetCoverUrl
        },
        candidates,
        timeline,
        identityInfo: {
          个体编号: 'ID-001',
          个体类型: '非人类',
          样本总数: targetRecord.count,
          覆盖年份: `${sortedYears[0]} - ${sortedYears.at(-1)}`,
          最近出现: latestYear,
          数据来源: '本地 images 数据集'
        }
      }
    },
    null,
    2
  )}\n`
}

function buildDatasetMock(records, totalImages, years) {
  const usable = records
    .filter((item) => !ignoredIdentities.has(item.name) && item.name.length >= 3)
    .sort((a, b) => b.years.size - a.years.size || b.count - a.count)

  const individuals = usable.slice(0, 8).map((record, index) => {
    const cover = getRepresentativeCover(record)
    const coverUrl = copyAsset(
      cover,
      path.join('dataset', 'individuals', `${slugify(record.name)}${path.extname(cover.filename).toLowerCase()}`)
    )

    return {
      id: `N-${String(index + 1).padStart(4, '0')}`,
      name: record.name,
      type: '非人类',
      sampleCount: record.count,
      periodCount: record.years.size,
      latestUpdate: `${getLatestYear(record)}-12-31`,
      status: record.years.size >= 5 ? 'complete' : 'pending',
      cover: coverUrl
    }
  })

  const cases = usable.slice(0, 3).map((record, index) => {
    const cover = getRepresentativeCover(record)
    const imageUrl = copyAsset(
      cover,
      path.join('dataset', 'cases', `${slugify(record.name)}${path.extname(cover.filename).toLowerCase()}`)
    )

    const sortedYears = [...record.years.keys()].sort()

    return {
      id: `case-${index + 1}`,
      title: `${record.name} 跨时期案例`,
      desc: `覆盖 ${sortedYears[0]} 至 ${sortedYears.at(-1)} 年，共 ${record.years.size} 个时期样本。`,
      image: imageUrl
    }
  })

  const yearDistribution = years.map((year) => {
    let value = 0
    for (const record of usable) {
      value += record.years.get(year)?.length || 0
    }

    return {
      year,
      value
    }
  })

  const datasetStatsMock = [
    { label: '个体总数', value: usable.length, extra: '基于本地 images 数据集统计' },
    { label: '图片总数', value: totalImages, extra: '覆盖 train / val / test 三个子集' },
    { label: '时间跨度', value: `${years.length} 年`, extra: `${years[0]} - ${years.at(-1)}` },
    { label: '跨期个体', value: usable.filter((item) => item.years.size >= 4).length, extra: '可用于跨时间展示筛选' }
  ]

  const typeDistributionMock = [
    { name: '非人类', value: usable.length }
  ]

  return `export const datasetStatsMock = ${JSON.stringify(datasetStatsMock, null, 2)}\n\nexport const individualListMock = ${JSON.stringify(individuals, null, 2)}\n\nexport const typicalCaseListMock = ${JSON.stringify(cases, null, 2)}\n\nexport const periodYearDistributionMock = ${JSON.stringify(yearDistribution, null, 2)}\n\nexport const typeDistributionMock = ${JSON.stringify(typeDistributionMock, null, 2)}\n`
}

function main() {
  if (!fs.existsSync(sourceRoot)) {
    throw new Error(`Source dataset not found: ${sourceRoot}`)
  }

  resetDir(publicRoot)

  const { identities, totalImages, years } = readDataset()
  const { target, candidates } = chooseRecognitionSet(identities)

  if (!target || candidates.length < 3) {
    throw new Error('Not enough identities found to build demo assets.')
  }

  fs.writeFileSync(recognitionMockPath, buildRecognitionMock(target, candidates), 'utf8')
  fs.writeFileSync(datasetMockPath, buildDatasetMock(identities, totalImages, years), 'utf8')

  console.log(`Generated demo assets from ${sourceRoot}`)
  console.log(`Target identity: ${target.name}`)
  console.log(`Candidates: ${candidates.map((item) => item.name).join(', ')}`)
}

main()
