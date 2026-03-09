import fs from "fs"
import os from "os"
import path from "path"
import { afterEach, describe, expect, it } from "vitest"
import { detectStack } from "../src/detectStack.js"

const tempRoots = []

afterEach(() => {
  while (tempRoots.length > 0) {
    const dir = tempRoots.pop()
    fs.rmSync(dir, { recursive: true, force: true })
  }
})

function makeTempProject(name, packageJson, extraFiles = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), `${name}-`))
  tempRoots.push(root)

  if (packageJson) {
    fs.writeFileSync(path.join(root, "package.json"), JSON.stringify(packageJson, null, 2))
  }

  for (const [relPath, content] of Object.entries(extraFiles)) {
    const fullPath = path.join(root, relPath)
    fs.mkdirSync(path.dirname(fullPath), { recursive: true })
    fs.writeFileSync(fullPath, content)
  }

  return root
}

describe("detectStack", () => {
  it("detects Ember and QUnit projects", async () => {
    const root = makeTempProject("ember", {
      dependencies: {
        "ember-source": "~5.8.0",
        "ember-qunit": "^8.0.0"
      },
      devDependencies: {
        "ember-cli": "~5.8.0"
      }
    })

    const stack = await detectStack(root)

    expect(stack.framework).toBe("Ember")
    expect(stack.frameworks).toContain("Ember")
    expect(stack.testingTools).toContain("QUnit")
    expect(stack.language).toBe("JavaScript")
    expect(stack.packageManager).toBe("npm")
  })

  it("detects Lit 3 projects", async () => {
    const root = makeTempProject("lit3", {
      packageManager: "pnpm@9.0.0",
      dependencies: {
        lit: "^3.1.2"
      },
      devDependencies: {
        vitest: "^2.1.8"
      }
    })

    const stack = await detectStack(root)

    expect(stack.framework).toBe("Lit 3")
    expect(stack.frameworks).toContain("Lit 3")
    expect(stack.testing).toBe("Vitest")
    expect(stack.packageManager).toBe("pnpm")
  })

  it("handles repositories without package.json", async () => {
    const root = makeTempProject(
      "no-pkg",
      null,
      { "src/main.ts": "export const value = 1\n", "pnpm-lock.yaml": "" }
    )

    const stack = await detectStack(root)

    expect(stack.language).toBe("TypeScript")
    expect(stack.packageManager).toBe("pnpm")
    expect(stack.framework).toBe("Unknown")
  })
})
