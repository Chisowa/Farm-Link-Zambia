module.exports = {
  extends: ["prettier"],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module"
  },
  rules: {
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "no-debugger": "warn",
    "prefer-const": "warn",
    "no-var": "error"
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        project: "./tsconfig.json"
      },
      extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking"
      ],
      rules: {
        "@typescript-eslint/explicit-function-return-types": "warn",
        "@typescript-eslint/no-unused-vars": "error",
        "@typescript-eslint/no-explicit-any": "error"
      }
    },
    {
      files: ["*.jsx", "*.tsx"],
      extends: ["plugin:react/recommended", "plugin:react-hooks/recommended"],
      rules: {
        "react/react-in-jsx-scope": "off",
        "react/prop-types": "off"
      }
    }
  ]
};
