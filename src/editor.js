class Editor {
  constructor() {
    this.editorDiv = document.createElement("div");

    // Removed the textarea from here since we'll be generating input fields dynamically
    document.body.appendChild(this.editorDiv);
    console.log("Editor initialized");
  }

  setJson(json) {
    console.log("Setting JSON");
    // Directly use the build method to generate HTML and set it as innerHTML of the editorDiv
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

  build(json, prefix = "") {
    let html = "";
    console.log("Building JSON Editor");
    Object.keys(json).forEach((key) => {
      const fullKey = prefix ? `${prefix}[${key}]` : key;
      if (
        typeof json[key] === "object" &&
        json[key] !== null &&
        !Array.isArray(json[key])
      ) {
        html += `<div><b>${key}</b>: ${this.build(json[key], fullKey)}</div>`;
      } else {
        html += `<div><b>${key}</b>: <input data-key="${fullKey}" value="${json[key]}"></div>`;
      }
    });
    return html;
  }
}

export { Editor };
