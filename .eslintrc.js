module.exports = {
  env: {
    node: true,
    browser: true,
    commonjs: true,
    es2021: true,
    jquery: true,
    jest: true,
    brownies: true,
  },
  extends: ["airbnb-base"],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    quotes: [2, "double", { avoidEscape: true }],
    "no-console": "off",
  },
};
