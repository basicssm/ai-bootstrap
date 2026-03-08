import fs from "fs"
import path from "path"

function listFiles(dir) {
  return fs.readdirSync(dir).filter(file => {
    const full = path.join(dir, file)
    return fs.statSync(full).isFile()
  })
}

function listDirs(dir) {
  return fs.readdirSync(dir).filter(file => {
    const full = path.join(dir, file)
    return fs.statSync(full).isDirectory()
  })
}

export function generateFeatureMap(root = process.cwd()) {

  const src = path.join(root, "src")

  if (!fs.existsSync(src)) return []

  let featureRoot = null

  const candidates = ["features", "modules", "domains"]

  for (const c of candidates) {
    const candidate = path.join(src, c)

    if (fs.existsSync(candidate)) {
      featureRoot = candidate
      break
    }
  }

  if (!featureRoot) return []

  const features = listDirs(featureRoot)

  const result = []

  features.forEach(feature => {

    const featurePath = path.join(featureRoot, feature)

    const files = listFiles(featurePath)

    result.push({
      name: feature,
      path: path.relative(root, featurePath),
      files
    })

  })

  return result

}