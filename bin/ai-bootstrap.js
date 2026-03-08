#!/usr/bin/env node

import { scanRepo } from "../src/scanRepo.js"
import { detectStack } from "../src/detectStack.js"
import { detectEntrypoints } from "../src/detectEntrypoints.js"
import { generateEntrypointsDoc } from "../src/generateEntrypointsDoc.js"
import { buildContext } from "../src/buildContext.js"
import { generateDocs } from "../src/generateDocs.js"
import { generateDependencyGraph } from "../src/generateDependencyGraph.js"
import { generateDependencyGraphDoc } from "../src/generateDependencyGraphDoc.js"
import { generateFeatureMap } from "../src/generateFeatureMap.js"
import { generateFeatureMapDoc } from "../src/generateFeatureMapDoc.js"
import { writeDocs } from "../src/writeDocs.js"

async function run() {
  console.log("🔎 Scanning repository...")

  const structure = await scanRepo()
  const stack = await detectStack()

  console.log("🔍 Detecting entrypoints...")

  const entrypoints = detectEntrypoints()

  const entrypointsDoc = generateEntrypointsDoc(entrypoints)

  console.log("🔗 Building dependency graph...")

  const graph = generateDependencyGraph()

  const graphDoc = generateDependencyGraphDoc(graph)

  console.log("🧩 Detecting features...")

  const features = generateFeatureMap()

  const featureMapDoc = generateFeatureMapDoc(features)

  console.log("🧠 Building context...")

  const context = buildContext(structure, stack)

  console.log("🤖 Generating AI documentation...")

  const docs = await generateDocs(context)

  console.log("📁 Writing /ai folder...")

  await writeDocs({
    ...docs,
    entrypoints: entrypointsDoc,
    dependencyGraph: graphDoc,
    featureMap: featureMapDoc
  })

  console.log("✅ AI bootstrap completed")

}

run()
