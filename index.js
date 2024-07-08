import jsonEditor from "./src/main.js";

document.addEventListener("DOMContentLoaded", () => {
  const styleJson = {
    labelStyle: "margin-right: 10px; font-weight: bold;",
    inputStyle: "margin-bottom: 10px; padding: 5px;",
  };

  const editor = jsonEditor(styleJson); // Assuming jsonEditor is a factory function
  // Example usage
  editor.setJson({ key: { key2: { key4: {} } }, key3: ["value1", "value2"] });
  console.log(editor.getJson());
});
