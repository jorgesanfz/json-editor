class Editor {
  constructor(styleJson = {}) {
    this.editorDiv = document.createElement("div");
    this.styleJson = styleJson;
    document.body.appendChild(this.editorDiv);
    console.log("Editor initialized");
    this.html = "";
  }

  setJson(json) {
    console.log("Setting JSON");
    this.html = "";
    this.editorDiv.innerHTML = this.build(json);
  }

  getJson() {
    const inputs = this.editorDiv.querySelectorAll("input");
    const json = {};
    inputs.forEach((input) => {
      const key = input.getAttribute("data-key");
      json[key] = input.value;
    });
    return json;
  }

  build(json, prefix = "", recursionIdentifier = 0) {
    console.log(
      "Building JSON Editor at recursion level:",
      recursionIdentifier
    );
    Object.keys(json).forEach((key) => {
      const fullKey = prefix ? `${prefix}[${key}]` : key;
      if (Array.isArray(json[key])) {
        this.buildArray(json[key], key, fullKey, recursionIdentifier);
      } else if (typeof json[key] === "object" && json[key] !== null) {
        this.buildObject(json[key], key, fullKey, recursionIdentifier);
      } else {
        this.buildPrimitive(json[key], key, fullKey);
      }
    });
    return this.html;
  }

  buildArray(array, key, fullKey, recursionIdentifier) {
    const uniqueId = `array-${fullKey.replace(/[\[\].]/g, "")}`;
    this.html += `<div style="margin-left: ${recursionIdentifier * 20}px">
                  <b>${key}</b>: 
                  <button onclick="Editor.toggleVisibility('${uniqueId}')">Toggle</button>
                  <div id="${uniqueId}" style="display: block;">`;
    array.forEach((item, index) => {
      this.buildSubobjects(item, index, fullKey, recursionIdentifier + 1);
    });
    this.html += `</div></div>`;
  }

  buildObject(object, key, fullKey, recursionIdentifier) {
    this.html += `<div style="margin-left: ${
      recursionIdentifier * 20
    }px">${key}: ${this.build(object, fullKey, recursionIdentifier + 1)}</div>`;
  }

  buildPrimitive(value, key, fullKey) {
    this.html += `<div><label for="${fullKey}">${key}:</label><input id="${fullKey}"
    data-key="${fullKey}" value="${value}"></div>`;
  }

  buildSubobjects(item, index, fullKey, recursionIdentifier) {
    const itemKey = `${fullKey}[${index}]`;
    if (typeof item === "object" && item !== null) {
      this.html += `<div>${this.build(
        item,
        itemKey,
        recursionIdentifier + 1
      )}</div>`;
    } else {
      this.html += `<div><input data-key="${itemKey}" value="${item}"></div>`;
    }
  }

  clearEditor() {
    this.editorDiv.innerHTML = "";
    console.log("Editor cleared");
  }

  updateJson(newJson) {
    const currentJson = this.getJson();
    const mergedJson = { ...currentJson, ...newJson };
    this.setJson(mergedJson);
    console.log("JSON updated");
  }

  static toggleVisibility(elementId) {
    const element = document.getElementById(elementId);
    if (element.style.display === "none") {
      element.style.display = "block";
    } else {
      element.style.display = "none";
    }
  }
}

window.Editor = Editor;

export { Editor };
