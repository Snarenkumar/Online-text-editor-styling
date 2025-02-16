// Initialize CodeMirror with HTML syntax highlighting
const editor = CodeMirror.fromTextArea(document.getElementById("editor-container"), {
    mode: "htmlmixed",  
    lineNumbers: true,
    theme: "dracula",   
    autoCloseTags: true,
    autoCloseBrackets: true
});

// Check if running locally (for testing)
const apiBase = window.location.hostname === "localhost" ? "http://localhost:5050" : "https://your-live-api.com";  

// 📌 Load Templates into Dropdown
async function loadTemplates() {
    try {
        const res = await axios.get(`${apiBase}/templates`);
        const templates = res.data.templates;
        const selector = document.getElementById("template-selector");

        // Reset options
        selector.innerHTML = `<option value="">Select a template</option>`;
        templates.forEach(template => {
            const option = document.createElement("option");
            option.value = template;
            option.innerText = template;
            selector.appendChild(option);
        });
    } catch (error) {
        console.error("Failed to load templates:", error);
        alert("Failed to load templates.");
    }
}

// 📌 Load Selected Template into Editor
async function loadTemplate() {
    const templateName = document.getElementById("template-selector").value;
    if (!templateName) return;

    try {
        const res = await axios.get(`${apiBase}/templates/${templateName}`);
        editor.setValue(res.data.content);  
        renderHTML();  
    } catch (error) {
        console.error("Failed to load template:", error);
        alert("Failed to load template.");
    }
}

// 📌 Render HTML in Preview Panel
function renderHTML() {
    const htmlContent = editor.getValue();
    document.getElementById("preview").innerHTML = sanitizeHTML(htmlContent);
}

// 📌 Prevent XSS & Ensure Safe HTML Rendering
function sanitizeHTML(html) {
    return html.replace(/<script.*?>.*?<\/script>/gi, "").replace(/on\w+=".*?"/g, "");  
}

// 📌 Export Rendered HTML
function exportHTML() {
    const htmlContent = editor.getValue();
    if (!htmlContent) return alert("No HTML content to export.");

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "template.html";
    a.click();
    URL.revokeObjectURL(url);
}

// 📌 Load Templates on Page Load
loadTemplates();
