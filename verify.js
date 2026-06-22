const fs = require('fs');
const path = require('path');
const vm = require('vm');

const baseDir = 'c:\\Users\\fazil\\OneDrive\\Desktop\\SkillBridge';

function getFiles(dir, files = []) {
    const list = fs.readdirSync(dir);
    for (const file of list) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            if (file !== 'node_modules' && file !== '.git' && file !== '.gemini' && file !== '.agents') {
                getFiles(fullPath, files);
            }
        } else {
            files.push(fullPath);
        }
    }
    return files;
}

const allFiles = getFiles(baseDir);
const htmlFiles = allFiles.filter(f => f.endsWith('.html'));
const jsFiles = allFiles.filter(f => f.endsWith('.js'));
const cssFiles = allFiles.filter(f => f.endsWith('.css'));

console.log(`Found ${htmlFiles.length} HTML files, ${jsFiles.length} JS files, and ${cssFiles.length} CSS files.`);

let errors = [];

// Helper to record errors
function reportError(file, message) {
    errors.push({ file: path.relative(baseDir, file), message });
}

// 1. Verify JS files syntax
for (const file of jsFiles) {
    try {
        const code = fs.readFileSync(file, 'utf8');
        new vm.Script(code);
        console.log(`[JS PASS] ${path.relative(baseDir, file)}`);
    } catch (e) {
        reportError(file, `Syntax error: ${e.message}\n${e.stack}`);
    }
}

// 2. Verify HTML files links and inline scripts
// Standard DOM/HTML parser using simple regex or node builtins if possible, to avoid needing npm install.
// Let's implement a simple parser for href, src, and inline scripts.
for (const file of htmlFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const dirOfFile = path.dirname(file);

    // Validate JS syntax of inline scripts
    const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    while ((match = scriptRegex.exec(content)) !== null) {
        const scriptContent = match[1].trim();
        // Check if it's not an external script (which won't have body)
        // Note: some script tags have both src and content, though rare. If it has src, we check it later.
        if (scriptContent) {
            try {
                // If it's a module, vm.Script might complain about import/export, but standard HTML files usually use classic script unless type="module"
                new vm.Script(scriptContent, { filename: file });
            } catch (e) {
                // Ignore errors related to module-level syntax if any, but since this is static HTML let's see
                reportError(file, `Inline script syntax error: ${e.message}\nSource snippet:\n${scriptContent.slice(0, 100)}`);
            }
        }
    }

    // Validate src and href links
    // Match src="..." or href="..."
    const linkRegex = /(src|href)=["']([^"']+)["']/gi;
    while ((match = linkRegex.exec(content)) !== null) {
        const attribute = match[1];
        const link = match[2];

        // Skip absolute URLs, mailto, tel, hash-only
        if (link.startsWith('http://') || link.startsWith('https://') || link.startsWith('mailto:') || link.startsWith('tel:') || link.startsWith('#') || link.startsWith('javascript:')) {
            continue;
        }

        // Clean link from query parameters or hashes (e.g. "style.css?v=2" or "index.html#contact")
        const cleanLink = link.split('?')[0].split('#')[0];
        if (!cleanLink) continue;

        // Resolve path relative to the file
        const absolutePath = path.resolve(dirOfFile, cleanLink);

        if (!fs.existsSync(absolutePath)) {
            reportError(file, `Broken link in ${attribute}="${link}": target does not exist at absolute path: ${absolutePath}`);
        }
    }
}

console.log("\n=== VERIFICATION RESULTS ===");
if (errors.length === 0) {
    console.log("SUCCESS: No broken links or syntax errors found!");
} else {
    console.log(`Found ${errors.length} error(s):`);
    errors.forEach((err, i) => {
        console.log(`\n[${i + 1}] File: ${err.file}\nError: ${err.message}`);
    });
}
