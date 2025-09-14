import tseslint from "typescript-eslint";
import pluginImport from "eslint-plugin-import";
import prettier from "eslint-config-prettier";

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  {
    ignores: ["dist/**", "node_modules/**", "tests/**", "scripts/**"]
  },
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
        sourceType: "module"
      }
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      import: pluginImport
    },
    rules: {
      /* Type safety */
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-function-return-type": [
        "error",
        { allowExpressions: false }
      ],
      "@typescript-eslint/strict-boolean-expressions": "error",
      "@typescript-eslint/no-floating-promises": "error",

      /* Code cleanliness */
      eqeqeq: ["error", "always"],
      "no-console": ["warn", { allow: ["error", "warn"] }],
      curly: ["error", "all"],
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling"],
            "index"
          ],
          "newlines-between": "always"
        }
      ],

      /* Layering discipline */
      "import/no-cycle": "error",
      "import/no-relative-parent-imports": "warn",
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../models/*", "src/models/*"],
              message:
                "Do not import entities into controllers — use DTOs/services instead."
            }
          ]
        }
      ],

      /* Prevent unused cruft */
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
      ]
    }
  },
  prettier
];