import fs from "fs"

export async function detectStack() {
  const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"))

  const deps = {
    ...pkg.dependencies,
    ...pkg.devDependencies
  }

  return {
    framework: detectFramework(deps),
    testing: detectTesting(deps),
    language: deps.typescript ? "TypeScript" : "JavaScript",
    packageManager: "npm"
  }
}

function detectFramework(deps) {
  if (deps.next) return "Next.js"
  if (deps.react) return "React"
  if (deps["react-native"]) return "React Native"
  if (deps.vue) return "Vue"
  return "Unknown"
}

function detectTesting(deps) {
  if (deps.jest) return "Jest"
  if (deps.vitest) return "Vitest"
  if (deps.cypress) return "Cypress"
  if (deps.playwright) return "Playwright"
  return "Unknown"
}