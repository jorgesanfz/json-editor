// vite.config.js
export default {
  build: {
    lib: {
      entry: "index.js",
      name: "JsonEditor",
      fileName: (format) => `json-editor.${format}.js`,
    },
    rollupOptions: {
      external: ["document"],
    },
  },
};
