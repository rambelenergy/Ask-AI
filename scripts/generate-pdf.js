const { marked } = require('marked');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const INPUT = path.resolve(ROOT, 'docs/NEXT_PHASE_LIVE_PRICES_ALGERIA_MAP.md');
const OUTPUT = path.resolve(ROOT, 'docs/NEXT_PHASE_LIVE_PRICES_ALGERIA_MAP.pdf');

const md = fs.readFileSync(INPUT, 'utf-8');

// Configure marked for better rendering
marked.setOptions({
  gfm: true,
  breaks: false,
});

const htmlContent = marked.parse(md);

const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Phase 2a — Live Prices & Algeria Project Map Interactive</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,400..700;1,14..32,400..700&family=Newsreader:ital,opsz,wght@0,16..72,400..700;1,16..72,400..700&display=swap');

  :root {
    --navy: #0f172a;
    --green: #0d9488;
    --line: #e2e8f0;
    --muted: #64748b;
    --bg: #f8fafc;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    font-size: 11pt;
    line-height: 1.75;
    color: var(--navy);
    background: #fff;
    max-width: 800px;
    margin: 0 auto;
    padding: 40px 48px;
  }

  /* Cover / Title Page */
  h1 {
    font-family: 'Newsreader', Georgia, serif;
    font-size: 28pt;
    font-weight: 700;
    color: var(--navy);
    border-bottom: 4px solid var(--green);
    padding-bottom: 18px;
    margin-bottom: 12px;
    line-height: 1.2;
  }

  h2 {
    font-family: 'Newsreader', Georgia, serif;
    font-size: 16pt;
    font-weight: 700;
    color: var(--navy);
    margin-top: 36px;
    margin-bottom: 14px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--line);
    page-break-after: avoid;
  }

  h3 {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 12.5pt;
    font-weight: 700;
    color: var(--green);
    margin-top: 28px;
    margin-bottom: 10px;
    page-break-after: avoid;
  }

  h4 {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 11.5pt;
    font-weight: 600;
    color: var(--navy);
    margin-top: 22px;
    margin-bottom: 8px;
    page-break-after: avoid;
  }

  p {
    margin-bottom: 10px;
    orphans: 3;
    widows: 3;
  }

  a {
    color: var(--green);
    text-decoration: none;
  }

  /* Code blocks — monospace styling */
  code {
    font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
    font-size: 9pt;
    background: #f1f5f9;
    padding: 2px 5px;
    border-radius: 3px;
    color: #1e293b;
  }

  pre {
    background: #f8fafc;
    border: 1px solid var(--line);
    border-left: 3px solid var(--green);
    border-radius: 6px;
    padding: 14px 16px;
    margin: 14px 0;
    overflow-x: auto;
    font-size: 9pt;
    line-height: 1.6;
    white-space: pre-wrap;
    word-break: break-word;
    page-break-inside: avoid;
  }

  pre code {
    background: none;
    padding: 0;
    border-radius: 0;
  }

  /* Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 16px 0;
    font-size: 9.5pt;
    page-break-inside: avoid;
  }

  th {
    background: var(--navy);
    color: #fff;
    font-weight: 600;
    text-align: left;
    padding: 8px 12px;
    font-size: 9pt;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  td {
    padding: 7px 12px;
    border-bottom: 1px solid var(--line);
    vertical-align: top;
  }

  tr:nth-child(even) td {
    background: #f8fafc;
  }

  /* Blockquotes */
  blockquote {
    border-left: 4px solid var(--green);
    margin: 16px 0;
    padding: 12px 18px;
    background: #f0fdfa;
    border-radius: 0 6px 6px 0;
    color: #115e59;
    page-break-inside: avoid;
  }

  blockquote p { margin-bottom: 6px; }

  /* Lists */
  ul, ol {
    margin: 10px 0 10px 24px;
  }

  li {
    margin-bottom: 4px;
  }

  /* Horizontal rules */
  hr {
    border: none;
    border-top: 1px solid var(--line);
    margin: 28px 0;
  }

  /* Strong / bold */
  strong {
    color: var(--navy);
    font-weight: 700;
  }

  /* Inline code in headers */
  h2 code, h3 code, h4 code {
    font-size: inherit;
  }

  /* Metadata line */
  .meta-line {
    color: var(--muted);
    font-size: 9.5pt;
    margin-bottom: 24px;
  }

  /* Badge-like styling for inline status/version */
  .badge {
    display: inline-block;
    background: var(--green);
    color: #fff;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 9pt;
    font-weight: 600;
  }

  /* Page breaks before major sections */
  h2 { page-break-before: auto; }
  h2:not(:first-of-type) { page-break-before: auto; }

  /* Print-specific */
  @media print {
    body {
      max-width: 100%;
      padding: 0;
      font-size: 10pt;
    }

    h1 { font-size: 24pt; }
    h2 { font-size: 14pt; page-break-after: avoid; }
    h3 { font-size: 12pt; page-break-after: avoid; }

    pre, table, blockquote {
      page-break-inside: avoid;
    }

    @page {
      margin: 25mm 20mm 25mm 20mm;
      @top-center {
        content: "RamBelEnergy.com — Phase 2a Planning Document";
        font-family: 'Inter', sans-serif;
        font-size: 8pt;
        color: var(--muted);
      }
      @bottom-center {
        content: "Page " counter(page) " of " counter(pages);
        font-family: 'Inter', sans-serif;
        font-size: 8pt;
        color: var(--muted);
      }
    }

    @page :first {
      @top-center { content: none; }
    }
  }
</style>
</head>
<body>
${htmlContent}
</body>
</html>`;

// Write debug HTML
fs.writeFileSync(path.resolve(ROOT, 'docs/NEXT_PHASE_LIVE_PRICES_ALGERIA_MAP.html'), fullHtml);

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  const page = await browser.newPage();

  // Set content directly
  await page.setContent(fullHtml, {
    waitUntil: 'networkidle0',
    timeout: 30000,
  });

  console.log('Generating PDF...');
  await page.pdf({
    path: OUTPUT,
    format: 'A4',
    margin: {
      top: '25mm',
      bottom: '25mm',
      left: '20mm',
      right: '20mm',
    },
    displayHeaderFooter: true,
    headerTemplate: `
      <div style="font-family: 'Inter', sans-serif; font-size: 8pt; color: #64748b; text-align: center; width: 100%; padding: 4px 0; border-bottom: 1px solid #e2e8f0;">
        RamBelEnergy.com — Phase 2a Planning Document
      </div>`,
    footerTemplate: `
      <div style="font-family: 'Inter', sans-serif; font-size: 8pt; color: #64748b; text-align: center; width: 100%; padding: 4px 0; border-top: 1px solid #e2e8f0;">
        Page <span class="pageNumber"></span> of <span class="totalPages"></span>
      </div>`,
    printBackground: true,
    preferCSSPageSize: true,
  });

  await browser.close();
  console.log(`✅ PDF generated: ${OUTPUT}`);
  console.log(`   Size: ${(fs.statSync(OUTPUT).size / 1024).toFixed(1)} KB`);
})();
