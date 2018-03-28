module.exports = {
  root: true,
  parser: "babel-eslint",
  parserOptions: {
    sourceType: "module"
  },
  plugins: ["html", "prettier"],
  rules: {
    "prettier/prettier": "error"
  }
};
