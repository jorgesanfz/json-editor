class Editor {
  constructor(
    styleJson = {},
    onSave = () => console.log(this.getJson()),
    displayOutput = true
  ) {
    this.editorDiv = document.createElement("div");
    this.styleJson = styleJson;
    this.onSave = onSave;
    this.displayOutput = displayOutput;
    document.body.appendChild(this.editorDiv);
    this.html = "";

    const maxIndentationLevels = 10;
    let indentationStyles = "";
    for (let i = 0; i <= maxIndentationLevels; i++) {
      indentationStyles += `.indentation-${i} { margin-left: ${i * 20}px; }\n`;
    }

    this.defaultCss = `
      .editor-container {
        width: 100%;
        max-width: 800px;
        margin: 20px auto;
        font-family: Arial, sans-serif;
        font-size: 14px;
        color: #333;
      }

      .editor-container div {
        display: flex;
        flex-direction: column;
        margin-bottom: 10px;
      }

      .editor-container b {
        margin-right: 5px;
        font-weight: normal;
      }

      .editor-container input {
        padding: 5px;
        border: 1px solid #ccc;
        border-radius: 3px;
        font-size: 14px;
        width: 100%;
      }

      .button-container {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin: 20px 0;
      }

      .editor-container button {
        padding: 5px 10px;
        background-color: #007bff;
        border: none;
        border-radius: 3px;
        color: white;
        cursor: pointer;
        font-size: 14px;
      }

      .editor-container button:hover {
        background-color: #0056b3;
      }

      .add-buttons {
        display: flex;
        gap: 5px;
        margin-top: 10px;
      }

      .json-output {
        margin-top: 20px;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 3px;
        background-color: #f9f9f9;
        white-space: pre-wrap;
        font-family: monospace;
        width: 100%;
        max-width: 800px;
        margin: 20px auto;
      }
    `;

    const defaultStyle = document.createElement("style");
    defaultStyle.innerHTML = this.defaultCss;
    document.head.appendChild(defaultStyle);

    this.editorDiv.classList.add("editor-container");

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    const getJsonButton = document.createElement("button");
    getJsonButton.textContent = "Get JSON";
    getJsonButton.onclick = () => this.displayJson();
    buttonContainer.appendChild(getJsonButton);

    if (this.onSave) {
      const saveButton = document.createElement("button");
      saveButton.textContent = "Save JSON";
      saveButton.onclick = () => this.onSave(this.getJson());
      buttonContainer.appendChild(saveButton);
    }

    document.body.appendChild(buttonContainer);

    if (this.displayOutput) {
      this.jsonOutputDiv = document.createElement("div");
      this.jsonOutputDiv.classList.add("json-output");
      document.body.appendChild(this.jsonOutputDiv);
    }
  }

  setJson(json) {
    this.editorDiv.innerHTML = "";
    const content = this.build(json);
    this.editorDiv.appendChild(content);
  }

  getJson() {
    const inputs = this.editorDiv.querySelectorAll("input");
    const json = {};

    inputs.forEach((input) => {
      const key = input.getAttribute("data-key");
      const value = input.value;

      const parts = key.split(/[\[\]]+/).filter(Boolean);

      let current = json;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (i === parts.length - 1) {
          current[part] = value;
        } else {
          if (!current[part]) {
            current[part] = isNaN(parts[i + 1]) ? {} : [];
          }
          current = current[part];
        }
      }
    });

    return json;
  }

  build(json, prefix = "", recursionIdentifier = 0) {
    const fragment = document.createDocumentFragment();
    Object.keys(json).forEach((key) => {
      const fullKey = prefix ? `${prefix}[${key}]` : key;
      const container = document.createElement("div");
      container.classList.add("indentation-" + recursionIdentifier);

      this.applyStyles(container, key);

      const keyContainer = document.createElement("span");
      keyContainer.innerHTML = `<b>${this.sanitizeHTML(key)}</b>: `;
      container.appendChild(keyContainer);

      const uniqueId = `element-${fullKey.replace(/[\[\].]/g, "")}`;
      const toggleButton = document.createElement("button");
      toggleButton.textContent = "-";
      toggleButton.onclick = () => {
        Editor.toggleVisibility(uniqueId, toggleButton);
      };
      keyContainer.appendChild(toggleButton);

      const contentContainer = document.createElement("div");
      contentContainer.id = uniqueId;
      contentContainer.style.display = "block";

      if (Array.isArray(json[key])) {
        this.buildArray(
          json[key],
          fullKey,
          recursionIdentifier,
          contentContainer
        );
      } else if (typeof json[key] === "object" && json[key] !== null) {
        this.buildObject(
          json[key],
          fullKey,
          recursionIdentifier,
          contentContainer
        );
      } else {
        this.buildPrimitive(json[key], fullKey, contentContainer);
      }

      container.appendChild(contentContainer);
      fragment.appendChild(container);

      // Add the buttons to add new fields, objects, or arrays
      const addButtons = this.createAddButtons(fullKey, recursionIdentifier);
      container.appendChild(addButtons);
    });

    return fragment;
  }

  buildArray(array, fullKey, recursionIdentifier, container) {
    array.forEach((item, index) => {
      const itemContainer = document.createElement("div");
      this.buildSubobjects(
        item,
        index,
        fullKey,
        recursionIdentifier + 1,
        itemContainer
      );
      container.appendChild(itemContainer);
    });
  }

  buildObject(object, fullKey, recursionIdentifier, container) {
    const objectContainer = this.build(
      object,
      fullKey,
      recursionIdentifier + 1
    );
    container.appendChild(objectContainer);
  }

  buildPrimitive(value, fullKey, container) {
    container.innerHTML = `
      <input id="${fullKey}" data-key="${fullKey}" value="${this.sanitizeHTML(
      value
    )}">
    `;
  }

  buildSubobjects(item, index, fullKey, recursionIdentifier, container) {
    const itemKey = `${fullKey}[${index}]`;
    if (typeof item === "object" && item !== null) {
      const subObjectContainer = this.build(item, itemKey, recursionIdentifier);
      container.appendChild(subObjectContainer);
    } else {
      container.innerHTML = `<input data-key="${itemKey}" value="${this.sanitizeHTML(
        item
      )}">`;
    }
  }

  createAddButtons(prefix, recursionIdentifier) {
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("add-buttons");

    const addFieldButton = document.createElement("button");
    addFieldButton.textContent = "Add Field";
    addFieldButton.onclick = () => this.addField(prefix, recursionIdentifier);
    buttonContainer.appendChild(addFieldButton);

    const addObjectButton = document.createElement("button");
    addObjectButton.textContent = "Add Object";
    addObjectButton.onclick = () => this.addObject(prefix, recursionIdentifier);
    buttonContainer.appendChild(addObjectButton);

    const addArrayButton = document.createElement("button");
    addArrayButton.textContent = "Add Array";
    addArrayButton.onclick = () => this.addArray(prefix, recursionIdentifier);
    buttonContainer.appendChild(addArrayButton);

    return buttonContainer;
  }

  addField(prefix, recursionIdentifier) {
    const key = prompt("Enter the field name:");
    if (key) {
      const value = prompt("Enter the field value:");
      const json = this.getJson();
      const parts = prefix.split(/[\[\]]+/).filter(Boolean);

      let current = json;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (i === parts.length - 1) {
          current[part][key] = value;
        } else {
          current = current[part];
        }
      }

      this.setJson(json);
    }
  }

  addObject(prefix, recursionIdentifier) {
    const key = prompt("Enter the object name:");
    if (key) {
      const json = this.getJson();
      const parts = prefix.split(/[\[\]]+/).filter(Boolean);

      let current = json;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (i === parts.length - 1) {
          current[part][key] = {};
        } else {
          current = current[part];
        }
      }

      this.setJson(json);
    }
  }

  addArray(prefix, recursionIdentifier) {
    const key = prompt("Enter the array name:");
    if (key) {
      const json = this.getJson();
      const parts = prefix.split(/[\[\]]+/).filter(Boolean);

      let current = json;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (i === parts.length - 1) {
          current[part][key] = [];
        } else {
          current = current[part];
        }
      }

      this.setJson(json);
    }
  }

  applyStyles(element, key) {
    if (this.styleJson[key]) {
      const styles = this.styleJson[key];
      Object.keys(styles).forEach((styleKey) => {
        element.style[styleKey] = styles[styleKey];
      });
    }
  }

  clearEditor() {
    this.editorDiv.innerHTML = "";
  }

  updateJson(newJson) {
    const currentJson = this.getJson();
    const mergedJson = { ...currentJson, ...newJson };
    this.setJson(mergedJson);
  }

  static toggleVisibility(elementId, button) {
    const element = document.getElementById(elementId);
    if (element.style.display === "none") {
      element.style.display = "block";
      button.textContent = "-";
    } else {
      element.style.display = "none";
      button.textContent = "+";
    }
  }

  static debounce(func, wait = 300) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  static debounceToggleVisibility = Editor.debounce(Editor.toggleVisibility);

  sanitizeHTML(str) {
    const temp = document.createElement("div");
    temp.textContent = str;
    return temp.innerHTML;
  }

  displayJson() {
    const json = this.getJson();
    if (this.displayOutput) {
      this.jsonOutputDiv.textContent = JSON.stringify(json, null, 2);
    }
    if (this.onSave) {
      this.onSave(json);
    }
  }
}

window.Editor = Editor;

export { Editor };
