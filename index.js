import jsonEditor from "./src/main.js";

document.addEventListener("DOMContentLoaded", () => {
  const editor = jsonEditor(); // Assuming jsonEditor is a factory function
  // Example usage
  editor.setJson({ key: { key2: "value" } });
  console.log(editor.getJson());
});
