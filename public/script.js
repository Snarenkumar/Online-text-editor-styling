const quill = new Quill('#editor', {
    theme: 'snow',
    placeholder: 'Start designing your email...',
    modules: {
        toolbar: [
            [{ font: [] }, { size: [] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ['blockquote', 'code-block'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            ['clean']
        ]
    }
});

// Load Templates
document.getElementById("templates").addEventListener("change", function() {
    const selectedTemplate = this.value;
    
    if (selectedTemplate === "blank") {
        quill.root.innerHTML = "";
    } else {
        fetch(`/templates/${selectedTemplate}.html`)
            .then(response => response.text())
            .then(html => quill.root.innerHTML = html);
    }
});

// Export as HTML
document.getElementById("exportHtml").addEventListener("click", function() {
    const emailHtml = quill.root.innerHTML;

    fetch("/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: emailHtml })
    })
    .then(response => response.json())
    .then(data => {
        const link = document.createElement("a");
        link.href = data.file;
        link.download = "email.html";
        link.click();
    });
});
