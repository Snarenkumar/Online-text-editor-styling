const apiBase = "http://localhost:5000";

// Load available templates in the dropdown
async function loadTemplates() {
    try {
        const response = await axios.get(`${apiBase}/templates`);
        const templates = response.data.templates;
        const templateSelect = document.getElementById("templateSelect");

        templateSelect.innerHTML = `<option value="">Select a template</option>`;
        templates.forEach(template => {
            templateSelect.innerHTML += `<option value="${template}">${template}</option>`;
        });
    } catch (error) {
        console.error("Failed to load templates:", error);
    }
}

// Load selected template into preview
async function loadTemplate() {
    const templateName = document.getElementById("templateSelect").value;
    if (!templateName) return;

    try {
        const response = await axios.get(`${apiBase}/templates/${templateName}`);
        document.getElementById("preview").innerHTML = response.data.content;
    } catch (error) {
        console.error("Failed to load template:", error);
        alert("Error loading template.");
    }
}

// Update preview based on user input
function updatePreview() {
    const backgroundColor = document.getElementById("backgroundColor").value;
    const headingText = document.getElementById("headingText").value;
    const headingColor = document.getElementById("headingColor").value;
    const buttonText = document.getElementById("buttonText").value;
    const buttonColor = document.getElementById("buttonColor").value;
    const buttonTextColor = document.getElementById("buttonTextColor").value;

    const updatedTemplate = `
        <div style="background-color: ${backgroundColor}; padding: 30px; text-align: center; font-family: Arial, sans-serif;">
            <h1 style="color: ${headingColor};">${headingText}</h1>
            <p>Hello <strong>[User]</strong>,</p>
            <p>We received a request to reset your password. Click the button below to set a new password.</p>
            <a href="[Reset_Link]" style="display: inline-block; background-color: ${buttonColor}; color: ${buttonTextColor}; padding: 12px 25px; text-decoration: none; border-radius: 5px;">${buttonText}</a>
            <p style="margin-top: 20px;">If you didn't request this, please ignore this email.</p>
            <p style="color: #888;">Stay safe, <br><strong>The [Company] Security Team</strong></p>
        </div>
    `;

    document.getElementById("preview").innerHTML = updatedTemplate;
}

// Save template to the server
async function saveTemplate() {
    const templateName = document.getElementById("templateSelect").value;
    if (!templateName) {
        alert("Please select a template to save.");
        return;
    }

    const templateContent = document.getElementById("preview").innerHTML;

    try {
        await axios.post(`${apiBase}/templates/${templateName}`, { content: templateContent });
        alert("Template saved successfully!");
    } catch (error) {
        console.error("Failed to save template:", error);
        alert("Failed to save template.");
    }
}

// Initialize templates on page load
window.onload = loadTemplates;
