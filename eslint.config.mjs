import { defineConfig, globalIgnores } from "eslint/config";
import next from "eslint-config-next";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig([globalIgnores([
    "**/.next",
    "**/.cache",
    "**/package-lock.json",
    "**/public",
    "**/node_modules",
    "**/next-env.d.ts",
    "**/next.config.ts",
    "**/yarn.lock",
    "**/.eslintrc.js",
    "**/_BACKUPS",
]), {
    extends: [...next, ...nextCoreWebVitals],

    plugins: {
        "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
        parser: tsParser,
    },

    rules: {
        "react/no-unescaped-entities": "off",
        "@next/next/no-page-custom-font": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "react-hooks/rules-of-hooks": "off",
        "react-hooks/exhaustive-deps": "off",
        "react-hooks/error-boundaries": "off",
        "react-hooks/immutability": "off",
        "react-hooks/incompatible-library": "off",
        "react-hooks/purity": "off",
        "react-hooks/set-state-in-effect": "off",
        "@next/next/no-img-element": "off",
        "no-empty": "off",
        "no-unused-expressions": "off",
        "no-inner-declarations": "off",
        "react/no-unknown-property": "off",
        "react/no-children-prop": "off",
        "no-fallthrough": "off",
        "no-self-assign": "off",
        "jsx-a11y/alt-text": "off",
        "import/no-anonymous-default-export": "off",
        "@next/next/no-async-client-component": "off",
        "@next/next/next-script-for-ga": "off",
        "@next/next/no-before-interactive-script-outside-document": "off",
    },
}]);
