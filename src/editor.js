class Editor {
  constructor(styleJson = {}) {
    this.editorDiv = document.createElement("div");
    this.styleJson = styleJson;
    document.body.appendChild(this.editorDiv);
    this.html = "";

    const defaultStyle = document.createElement("style");
    defaultStyle.innerHTML = `
      .indentation-0 { margin-left: 0; }
      .indentation-1 { margin-left: 20px; }
      .indentation-2 { margin-left: 40px; }
      .indentation-3 { margin-left: 60px; }
      .indentation-4 { margin-left: 80px; }
      div {
        width: 60%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        border-radius: 5px;
      /* 
        padding: 20px;
      border: 1px solid black;
      align-items: center;
      */
      }
    `;
    document.head.appendChild(defaultStyle);
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
      json[key] = input.value;
    });
    return json;
  }

  build(json, prefix = "", recursionIdentifier = 0) {
    const fragment = document.createDocumentFragment();
    Object.keys(json).forEach((key) => {
      const fullKey = prefix ? `${prefix}[${key}]` : key;
      const container = document.createElement("div");
      container.classList.add("indentation-" + recursionIdentifier);

      const keyContainer = document.createElement("span");
      keyContainer.innerHTML = `<b>${this.sanitizeHTML(key)}</b>: `;
      container.appendChild(keyContainer);

      const uniqueId = `element-${fullKey.replace(/[\[\].]/g, "")}`;
      const toggleButton = document.createElement("button");
      toggleButton.textContent = "Toggle";
      toggleButton.onclick = () => Editor.debounceToggleVisibility(uniqueId);
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

  static toggleVisibility(elementId) {
    const element = document.getElementById(elementId);
    if (element.style.display === "none") {
      element.style.display = "block";
    } else {
      element.style.display = "none";
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
}

window.Editor = Editor;

export { Editor };
