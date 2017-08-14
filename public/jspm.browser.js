SystemJS.config({
  baseURL: "/",
  production: true,
  paths: {
    "npm:": "jspm_packages/npm/",
    "github:": "jspm_packages/github/",
    "champion-select/": "src/"
  }
});
