const editor = CodeMirror.fromTextArea(document.getElementById("editor-container"), {
    mode: "htmlmixed",
    lineNumbers: true,
    theme: "default",
});

const apiBase = "http://localhost:5000";

// 📌 Load templates into dropdown
async function loadTemplates() {
    try {
        const res = await axios.get(`${apiBase}/templates`);
        const templates = res.data.templates;
        const selector = document.getElementById("template-selector");

        selector.innerHTML = `<option value="">Select a template</option>`;
        templates.forEach(template => {
            const option = document.createElement("option");
            option.value = template;
            option.innerText = template;
            selector.appendChild(option);
        });
    } catch (error) {
        console.error("Failed to load templates:", error);
        alert("Failed to load templates. Check the console for details.");
    }
}

// 📌 Load selected template into CodeMirror editor
async function loadTemplate() {
    const templateName = document.getElementById("template-selector").value;
    if (!templateName) return;

    try {
        const res = await axios.get(`${apiBase}/templates/${templateName}`);
        editor.setValue(res.data.content); // Load content into CodeMirror
        renderHTML(); // Render the template immediately after loading
    } catch (error) {
        console.error("Failed to load template:", error);
        alert("Failed to load template. Check the console for details.");
    }
}

// 📌 Render HTML
async function renderHTML() {
    const htmlContent = editor.getValue();

    try {
        document.getElementById("preview").innerHTML = htmlContent;
    } catch (error) {
        console.error("Failed to render HTML:", error);
        alert("Failed to render HTML. Check the console for details.");
    }
}

// 📌 Save edited HTML
async function saveTemplate() {
    const templateName = document.getElementById("template-selector").value;
    if (!templateName) return alert("Select a template first");

    const updatedContent = editor.getValue();

    try {
        await axios.post(`${apiBase}/templates/${templateName}`, { content: updatedContent });
        alert("Template saved successfully!");
    } catch (error) {
        console.error("Failed to save template:", error);
        alert("Failed to save template. Check the console for details.");
    }
}

// 📌 Export HTML
function exportHTML() {
    const htmlContent = document.getElementById("preview").innerHTML;
    if (!htmlContent) return alert("No HTML content to export.");

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "template.html";
    a.click();
    URL.revokeObjectURL(url);
}

// 📌 Load templates on page load
loadTemplates();