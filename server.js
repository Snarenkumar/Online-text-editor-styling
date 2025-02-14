const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const templatesDir = path.join(__dirname, "templates");

// Ensure templates directory exists
if (!fs.existsSync(templatesDir)) {
    fs.mkdirSync(templatesDir);
}

// Fetch all templates
app.get("/templates", (req, res) => {
    fs.readdir(templatesDir, (err, files) => {
        if (err) return res.status(500).json({ error: "Failed to load templates." });
        const templates = files.map(file => file.replace(".html", ""));
        res.json({ templates });
    });
});

// Fetch a specific template
app.get("/templates/:name", (req, res) => {
    const templatePath = path.join(templatesDir, `${req.params.name}.html`);
    if (!fs.existsSync(templatePath)) return res.status(404).json({ error: "Template not found." });

    const content = fs.readFileSync(templatePath, "utf8");
    res.json({ content });
});

// Save an updated template
app.post("/templates/:name", (req, res) => {
    const templatePath = path.join(templatesDir, `${req.params.name}.html`);
    if (!req.body.content) return res.status(400).json({ error: "No content provided." });

    fs.writeFileSync(templatePath, req.body.content, "utf8");
    res.json({ message: "Template updated successfully!" });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    