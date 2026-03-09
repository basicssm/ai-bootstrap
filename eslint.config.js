import js from "@eslint/js"
import globals from "globals"

export default [
  {
    ignores: ["ai/**", "coverage/**", "dist/**", "node_modules/**"]
  },
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node
      }
    },
    rules: {
      "no-console": "off"
    }
  },
  {
    files: ["test/**/*.test.js"],
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  }
]
