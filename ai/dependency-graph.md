# Dependency Graph

This file describes internal module dependencies.

## /Users/sergio/dev/ai-bootstrap/bin/ai-bootstrap.js

→ ../src/scanRepo.js
→ ../src/detectStack.js
→ ../src/detectEntrypoints.js
→ ../src/generateEntrypointsDoc.js
→ ../src/buildContext.js
→ ../src/generateDocs.js
→ ../src/generateDependencyGraph.js
→ ../src/generateDependencyGraphDoc.js
→ ../src/generateFeatureMap.js
→ ../src/generateFeatureMapDoc.js
→ ../src/writeDocs.js

## /Users/sergio/dev/ai-bootstrap/src/detectArchitecture.js

→ fs

## /Users/sergio/dev/ai-bootstrap/src/detectEntrypoints.js

→ fs
→ path

## /Users/sergio/dev/ai-bootstrap/src/detectStack.js

→ fs
→ path

## /Users/sergio/dev/ai-bootstrap/src/generateDependencyGraph.js

→ fs
→ path

## /Users/sergio/dev/ai-bootstrap/src/generateDocs.js

→ ./detectArchitecture.js

## /Users/sergio/dev/ai-bootstrap/src/generateFeatureMap.js

→ fs
→ path

## /Users/sergio/dev/ai-bootstrap/src/generateRepoMap.js

→ fs
→ path

## /Users/sergio/dev/ai-bootstrap/src/scanRepo.js

→ fs
→ path

## /Users/sergio/dev/ai-bootstrap/src/writeDocs.js

→ fs
→ ./generateRepoMap.js

