import { Editor } from "./editor.js";
//import styles from "./styles.css";

const jsonEditor = (styleJson) => {
  const editor = new Editor(styleJson);
  return editor;
};

export default jsonEditor;
