const express = require("express");
const fs = require("fs");
const path = require("path");
const mjml = require("mjml");

const app = express();
app.use(express.json());

// Route to list all MJML templates
app.get("/templates", (req, res) => {
    const templatesDir = path.join(__dirname, "templates");
    fs.readdir(templatesDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: "Failed to load templates." });
        }
        const templates = files.map(file => ({
            name: file.replace(".mjml", ""),
            path: `/templates/${file}`
        }));
        res.json({ templates });
    });
});

// Route to get a specific template's content
app.get("/templates/:name", (req, res) => {
    const templatePath = path.join(__dirname, "templates", `${req.params.name}.mjml`);
    if (!fs.existsSync(templatePath)) {
        return res.status(404).json({ error: "Template not found." });
    }
    const content = fs.readFileSync(templatePath, "utf8");
    res.json({ content });
});

// Route to render MJML template to HTML
app.get("/render/:name", (req, res) => {
    const templatePath = path.join(__dirname, "templates", `${req.params.name}.mjml`);
    if (!fs.existsSync(templatePath)) {
        return res.status(404).json({ error: "Template not found." });
    }
    const mjmlContent = fs.readFileSync(templatePath, "utf8");
    const htmlOutput = mjml(mjmlContent).html; // Convert MJML to HTML
    res.send(htmlOutput);
});

app.listen(5000, () => console.log("Server running on port 5000"));
