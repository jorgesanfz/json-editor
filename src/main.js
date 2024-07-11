import { Editor } from "./editor.js";

const jsonEditor = (styleJson) => {
  const editor = new Editor(styleJson);
  return editor;
};

export default jsonEditor;
