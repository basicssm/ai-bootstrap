import fs from "fs"
import path from "path"

export async function detectStack(root = process.cwd()) {
  const pkg = readPackageJson(root)
  const deps = collectDeps(pkg)
  const frameworks = detectFrameworks(deps, root)
  const testingTools = detectTestingTools(deps, root)

  return {
    framework: frameworks[0] || "Unknown",
    frameworks,
    testing: testingTools[0] || "Unknown",
    testingTools,
    language: detectLanguage(deps, root),
    packageManager: detectPackageManager(pkg, root),
    runtime: detectRuntime(deps, root)
  }
}

function readPackageJson(root) {
  const pkgPath = path.join(root, "package.json")

  if (!fs.existsSync(pkgPath)) return null

  return JSON.parse(fs.readFileSync(pkgPath, "utf8"))
}

function collectDeps(pkg) {
  if (!pkg) return {}

  return {
    ...(pkg.dependencies || {}),
    ...(pkg.devDependencies || {}),
    ...(pkg.peerDependencies || {})
  }
}

function detectFrameworks(deps, root) {
  const frameworks = []

  if (deps.next) frameworks.push("Next.js")
  if (deps.nuxt) frameworks.push("Nuxt")
  if (deps.react) frameworks.push("React")
  if (deps["react-native"]) frameworks.push("React Native")
  if (deps.vue) frameworks.push("Vue")
  if (deps.svelte || deps["@sveltejs/kit"]) frameworks.push("Svelte")
  if (deps.angular || deps["@angular/core"]) frameworks.push("Angular")
  if (deps.astro) frameworks.push("Astro")

  if (deps["ember-source"] || deps["ember-cli"] || hasPrefix(deps, "@ember/")) {
    frameworks.push("Ember")
  }

  if (deps.lit || deps["lit-html"] || deps["lit-element"]) {
    frameworks.push(resolveLitName(deps))
  }

  if (frameworks.length === 0 && fs.existsSync(path.join(root, "pom.xml"))) {
    frameworks.push("Java (Maven)")
  }

  if (frameworks.length === 0 && fs.existsSync(path.join(root, "go.mod"))) {
    frameworks.push("Go")
  }

  return dedupe(frameworks)
}

function resolveLitName(deps) {
  const litVersion = deps.lit || ""
  const major = Number.parseInt(litVersion.replace(/^[^\d]*/, ""), 10)

  if (Number.isFinite(major) && major >= 3) return "Lit 3"
  return "Lit"
}

function detectTestingTools(deps, root) {
  const tools = []

  if (deps.jest) tools.push("Jest")
  if (deps.vitest) tools.push("Vitest")
  if (deps.cypress) tools.push("Cypress")
  if (deps.playwright || deps["@playwright/test"]) tools.push("Playwright")
  if (deps.mocha) tools.push("Mocha")
  if (deps.ava) tools.push("AVA")
  if (deps.qunit || deps["ember-qunit"]) tools.push("QUnit")
  if (deps["@testing-library/react"] || deps["@testing-library/dom"]) {
    tools.push("Testing Library")
  }

  if (tools.length === 0 && fs.existsSync(path.join(root, "pytest.ini"))) {
    tools.push("Pytest")
  }

  return dedupe(tools)
}

function detectLanguage(deps, root) {
  if (deps.typescript || hasFilesWithExtensions(root, [".ts", ".tsx"])) {
    return "TypeScript"
  }

  if (fs.existsSync(path.join(root, "pyproject.toml")) || fs.existsSync(path.join(root, "requirements.txt"))) {
    return "Python"
  }

  if (fs.existsSync(path.join(root, "go.mod"))) return "Go"
  if (fs.existsSync(path.join(root, "Cargo.toml"))) return "Rust"
  if (fs.existsSync(path.join(root, "pom.xml")) || fs.existsSync(path.join(root, "build.gradle"))) {
    return "Java"
  }

  if (hasFilesWithExtensions(root, [".js", ".jsx", ".mjs", ".cjs"])) {
    return "JavaScript"
  }

  if (Object.keys(deps).length > 0 || fs.existsSync(path.join(root, "package.json"))) {
    return "JavaScript"
  }

  return "Unknown"
}

function detectPackageManager(pkg, root) {
  const packageManagerField = pkg?.packageManager

  if (typeof packageManagerField === "string" && packageManagerField.length > 0) {
    return packageManagerField.split("@")[0]
  }

  if (fs.existsSync(path.join(root, "pnpm-lock.yaml"))) return "pnpm"
  if (fs.existsSync(path.join(root, "yarn.lock"))) return "yarn"
  if (fs.existsSync(path.join(root, "bun.lockb")) || fs.existsSync(path.join(root, "bun.lock"))) {
    return "bun"
  }
  if (fs.existsSync(path.join(root, "package-lock.json"))) return "npm"

  if (pkg) return "npm"

  return "Unknown"
}

function detectRuntime(deps, root) {
  if (deps["@angular/core"] || deps.react || deps.vue || deps.next || deps.lit || deps["ember-source"]) {
    return "Node.js"
  }

  if (fs.existsSync(path.join(root, "pyproject.toml")) || fs.existsSync(path.join(root, "requirements.txt"))) {
    return "Python"
  }

  if (fs.existsSync(path.join(root, "go.mod"))) return "Go"
  if (fs.existsSync(path.join(root, "Cargo.toml"))) return "Rust"
  if (fs.existsSync(path.join(root, "pom.xml")) || fs.existsSync(path.join(root, "build.gradle"))) {
    return "JVM"
  }

  if (fs.existsSync(path.join(root, "package.json"))) return "Node.js"

  return "Unknown"
}

function hasPrefix(obj, prefix) {
  return Object.keys(obj).some(key => key.startsWith(prefix))
}

function dedupe(items) {
  return [...new Set(items)]
}

function hasFilesWithExtensions(root, extensions) {
  const entries = fs.readdirSync(root, { withFileTypes: true })

  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === ".git" || entry.name === "dist" || entry.name === "build") {
      continue
    }

    const full = path.join(root, entry.name)

    if (entry.isDirectory()) {
      if (hasFilesWithExtensions(full, extensions)) return true
      continue
    }

    if (extensions.some(ext => entry.name.endsWith(ext))) return true
  }

  return false
}
