# ai-bootstrap

`ai-bootstrap` es un CLI que analiza un repositorio y genera una carpeta `/ai` con documentación lista para usar en asistentes como GitHub Copilot, Cursor, Claude Code o ChatGPT.

Objetivo: dejar cualquier repo preparado para trabajo asistido por IA en pocos segundos.

## Qué hace el proyecto

Al ejecutar `ai-bootstrap`:

1. Escanea la estructura del repositorio.
2. Detecta stack tecnológico desde `package.json` (framework, lenguaje, testing, package manager).
3. Detecta entrypoints comunes (`index.ts`, `main.tsx`, `server.js`, etc.) para enriquecer el análisis.
4. Genera un grafo de dependencias basado en imports/requires.
5. Detecta mapa de features si encuentra `src/features`, `src/modules` o `src/domains`.
6. Genera documentación en `/ai`.

## Archivos que genera

Salida actual:

```text
/ai
  project-overview.md
  architecture.md
  coding-standards.md
  dependency-graph.md
  feature-map.md
  repo-map.md
  prompts/
    task-template.md
```

Descripción rápida:

- `project-overview.md`: resumen del stack y comandos base para ejecutar/probar.
- `architecture.md`: tipo de arquitectura detectada y carpetas principales.
- `coding-standards.md`: convenciones inferidas de código y testing.
- `dependency-graph.md`: relaciones de imports por archivo.
- `feature-map.md`: módulos/áreas funcionales detectadas.
- `repo-map.md`: mapa general del árbol del repo.
- `prompts/task-template.md`: plantilla para pedir tareas a un asistente de IA.

## Instalación

Global:

```bash
npm install -g ai-bootstrap
```

Sin instalar (npx):

```bash
npx ai-bootstrap
```

## Uso básico

Dentro del repositorio objetivo:

```bash
ai-bootstrap
```

## Uso sin API key (recomendado)

No necesitas ninguna API key para usar `ai-bootstrap`.

- Por defecto usa un generador local.
- Funciona en entornos corporativos donde no puedes usar claves externas.
- Es compatible con flujo de trabajo con Copilot Chat porque Copilot consume los `.md` generados.

## OpenAI opcional (no obligatorio)

Si quieres usar OpenAI de forma opcional:

```bash
export OPENAI_API_KEY=tu_api_key
ai-bootstrap
```

Forzar modo local aunque exista key:

```bash
export AI_BOOTSTRAP_USE_OPENAI=0
ai-bootstrap
```

## Cómo usarlo con Copilot Chat en VSCode (sin API key)

1. Abre tu repo en VSCode.
2. Ejecuta:
```bash
ai-bootstrap
```
3. Abre Copilot Chat.
4. Pídele explícitamente que use el contexto de `/ai`.

Prompt recomendado:

```text
Antes de responder, lee /ai/project-overview.md, /ai/architecture.md y /ai/coding-standards.md.
Luego proponme cambios para [tu tarea] respetando esa arquitectura.
```

Prompt para implementar cambios:

```text
Usa los documentos de /ai como fuente de contexto del repo.
Implementa [tu tarea], lista los archivos modificados y explica riesgos/regresiones.
```

## Flujo recomendado

```bash
git clone <repo>
cd <repo>
ai-bootstrap
git add ai
git commit -m "Add AI bootstrap docs"
```

Después usa Copilot Chat (o cualquier asistente) apoyándote en `/ai`.

## Limitaciones actuales

- Detección de stack enfocada en ecosistema JavaScript/TypeScript.
- La calidad del resultado depende de la estructura real del repositorio.
- El grafo de dependencias usa parsing por regex (rápido, no semántico).

## Contribuir

Ideas de mejora:

- Soporte ampliado para otros lenguajes.
- Detección de arquitectura más profunda.
- Mejoras en análisis de monorepos.
- Integración con CI.

## Licencia

MIT
