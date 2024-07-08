import { jsonEditor } from "./index.js";

describe("JSON Editor", () => {
  it("should create a JSON editor", () => {
    const editor = jsonEditor();
    expect(editor.editorDiv).not.toBe(null);
  });

  it("should set and get JSON", () => {
    const editor = jsonEditor();
    const json = { name: "John", age: 30 };
    editor.setJson(json);
    expect(editor.getJson()).toEqual(json);
  });
});
