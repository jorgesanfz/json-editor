import jsonEditor from "./src/main.js";

document.addEventListener("DOMContentLoaded", () => {
  const styleJson = {
    backgroundColor: "red",
    fontSize: "16px",
    border: "1px solid black",
  };

  const editor = jsonEditor(styleJson);

  editor.setJson({
    key: { key2: { key4: { prueba: "prueba" } } },
    key3: ["value1", "value2"],
  });
  console.log(editor.getJson());
});
