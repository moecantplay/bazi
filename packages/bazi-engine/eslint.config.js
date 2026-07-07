import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["coverage/", "node_modules/"] },
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "no-console": "error"
    }
  },
  {
    files: ["scripts/**/*.ts"],
    rules: { "no-console": "off" }
  }
);
