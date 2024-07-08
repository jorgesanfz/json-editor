class Editor {
  constructor(styleJson = {}) {
    this.editorDiv = document.createElement("div");
    this.styleJson = styleJson; // Store the style JSON
    document.body.appendChild(this.editorDiv);
    console.log("Editor initialized");
  }

  setJson(json) {
    console.log("Setting JSON");
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
    let html = "";
    console.log(
      "Building JSON Editor at recursion level:",
      recursionIdentifier
    );
    Object.keys(json).forEach((key) => {
      const fullKey = prefix ? `${prefix}[${key}]` : key;
      if (Array.isArray(json[key])) {
        html += `<div style="margin-left: ${
          recursionIdentifier * 20
        }px"><b>${key}</b>: <div>`;
        json[key].forEach((item, index) => {
          const itemKey = `${fullKey}[${index}]`;
          if (typeof item === "object" && item !== null) {
            // Increment or update the recursion identifier for subobjects
            html += `<div>${this.build(
              item,
              itemKey,
              recursionIdentifier + 1
            )}</div>`;
          } else {
            html += `<div><input data-key="${itemKey}" value="${item}"></div>`;
          }
        });
        html += `</div></div>`;
      } else if (typeof json[key] === "object" && json[key] !== null) {
        // Handle objects similarly, incrementing or updating the recursion identifier
        html += `<div style="margin-left: ${
          recursionIdentifier * 20
        }px">${key}: ${this.build(
          json[key],
          fullKey,
          recursionIdentifier + 1
        )}</div>`;
      } else {
        // For primitive types, just create an input element
        html += `<div><label for="${fullKey}">${key}:</label><input id="${fullKey}" data-key="${fullKey}" value="${json[key]}"></div>`;
      }
    });
    return html;
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
}

export { Editor };
