"use strict";

const fs = require("fs/promises");
const fsSync = require("fs");
const path = require("path");
const mammoth = require("mammoth");
const JSZip = require("jszip");
const { PDFParse } = require("pdf-parse");

const BASE = path.resolve(__dirname, "..");
const EXPORT_DATE = "2026-04-01";

/**
 * Remove leading blockquote source line(s) from generated MD.
 * @param {string} md
 * @returns {string}
 */
function stripSourceHeader(md) {
  const lines = md.split("\n");
  let i = 0;
  while (i < lines.length && (lines[i].startsWith(">") || lines[i].trim() === "")) {
    i += 1;
  }
  return lines.slice(i).join("\n").trimStart();
}

/**
 * @param {string} filePath
 * @param {string} sourceLabel
 * @returns {Promise<void>}
 */
async function writeDocxMarkdown(filePath, sourceLabel) {
  const result = await mammoth.convertToMarkdown({ path: filePath });
  const header =
    `> **Աղբյուր.** \`${sourceLabel}\` — Markdown արտահանում (mammoth)։ ${EXPORT_DATE}։\n\n` +
    (result.messages.length
      ? `> _Նախազգուշացումներ._ ${result.messages.map((m) => m.message).join("; ")}\n\n`
      : "");
  const outPath = filePath.replace(/\.docx$/i, ".md");
  await fs.writeFile(outPath, header + result.value, "utf8");
  console.log("OK docx ->", path.relative(BASE, outPath));
}

/**
 * @param {string} filePath
 * @param {string} sourceLabel
 * @returns {Promise<void>}
 */
async function writePdfMarkdown(filePath, sourceLabel) {
  const buf = fsSync.readFileSync(filePath);
  const parser = new PDFParse({ data: buf });
  const textResult = await parser.getText();
  await parser.destroy();
  const body =
    textResult.text
      .replace(/\r\n/g, "\n")
      .split("\n")
      .map((line) => line.trimEnd())
      .join("\n") + "\n";
  const header =
    `> **Աղբյուր.** \`${sourceLabel}\` — տեքստի արտահանում (pdf-parse)։ ${EXPORT_DATE}։\n\n`;
  const outPath = filePath.replace(/\.pdf$/i, ".md");
  await fs.writeFile(outPath, header + body, "utf8");
  console.log("OK pdf ->", path.relative(BASE, outPath));
}

/**
 * Decode minimal XML/HTML entities in ODT-derived text.
 * @param {string} s
 * @returns {string}
 */
function decodeBasicEntities(s) {
  return s
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&"); // &amp; must be last to avoid double-unescaping (e.g. &amp;lt; → &lt; → <)
}

/**
 * @param {string} filePath
 * @param {string} sourceLabel
 * @returns {Promise<void>}
 */
async function writeOdtMarkdown(filePath, sourceLabel) {
  const zip = await JSZip.loadAsync(fsSync.readFileSync(filePath));
  const content = zip.file("content.xml");
  if (!content) {
    throw new Error(`content.xml not found in ${filePath}`);
  }
  const xml = await content.async("string");
  let text = xml
    .replace(/<text:h[^>]*outline-level="1"[^>]*>/g, "\n\n# ")
    .replace(/<text:h[^>]*outline-level="2"[^>]*>/g, "\n\n## ")
    .replace(/<text:h[^>]*outline-level="3"[^>]*>/g, "\n\n### ")
    .replace(/<text:h[^>]*>/g, "\n\n## ")
    .replace(/<text:p[^>]*>/g, "\n\n")
    .replace(/<text:line-break\/>/g, "\n")
    .replace(/<text:tab\/>/g, "\t");
  text = text.replace(/<[^>]+>/g, "");
  text = decodeBasicEntities(text);
  text = text.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
  const header =
    `> **Աղբյուր.** \`${sourceLabel}\` — տեքստի արտահանում (ODT content.xml)։ ${EXPORT_DATE}։\n\n`;
  const outPath = filePath.replace(/\.odt$/i, ".md");
  await fs.writeFile(outPath, header + text, "utf8");
  console.log("OK odt ->", path.relative(BASE, outPath));
}

/**
 * @param {string} dir
 * @param {string} ext
 * @returns {string | undefined}
 */
function findFileByExt(dir, ext) {
  const names = fsSync.readdirSync(dir);
  return names.find((n) => n.toLowerCase().endsWith(ext));
}

async function main() {
  const ameria = path.join(BASE, "AmeriaBank");
  await writeDocxMarkdown(
    path.join(ameria, "vPOS_Eng_3.1.docx"),
    "vPOS_Eng_3.1.docx"
  );
  await writeDocxMarkdown(
    path.join(ameria, "vPOS_Arm_3.1.docx"),
    "vPOS_Arm_3.1.docx"
  );

  const idramNew = path.join(BASE, "IDram", "Idram Merchant API New.pdf");
  await writePdfMarkdown(idramNew, "Idram Merchant API New.pdf");

  const idramOldDocx = path.join(
    BASE,
    "IDram",
    "Idram old",
    "IdramMerchantAPI_16102025.docx"
  );
  await writeDocxMarkdown(idramOldDocx, "Idram old/IdramMerchantAPI_16102025.docx");

  const fastShiftExtracted = path.join(BASE, "FastShift", "_extracted_fastshift");
  const fastMd = findFileByExt(fastShiftExtracted, ".md");
  if (fastMd) {
    const src = path.join(fastShiftExtracted, fastMd);
    const body = await fs.readFile(src, "utf8");
    const header =
      `> **Աղբյուր.** \`Fast Shift archive26-02-09.zip\` (${fastMd})։ ${EXPORT_DATE}։\n\n`;
    const out = path.join(BASE, "FastShift", "Fast_Shift_archive_26-02-09.md");
    await fs.writeFile(out, header + body, "utf8");
    console.log("OK zip bundle ->", path.relative(BASE, out));
  }

  const telExtracted = path.join(BASE, "TelCell", "_extracted_telcell");
  const telOdt = findFileByExt(telExtracted, ".odt");
  const telDocx = findFileByExt(telExtracted, ".docx");
  if (telOdt) {
    await writeOdtMarkdown(
      path.join(telExtracted, telOdt),
      `Telcell API archive26-02-09.zip / ${telOdt}`
    );
  }
  if (telDocx) {
    await writeDocxMarkdown(
      path.join(telExtracted, telDocx),
      `Telcell API archive26-02-09.zip / ${telDocx}`
    );
  }

  if (telOdt || telDocx) {
    const parts = [];
    const headerMain =
      `> **Աղբյուր.** \`Telcell API archive26-02-09.zip\` — միասնական Markdown։ ${EXPORT_DATE}։\n\n---\n\n`;
    if (telOdt) {
      const mdPath = path.join(telExtracted, telOdt.replace(/\.odt$/i, ".md"));
      const md = await fs.readFile(mdPath, "utf8");
      parts.push("## WEB / ODT\n\n" + stripSourceHeader(md));
    }
    if (telDocx) {
      const mdPath = path.join(telExtracted, telDocx.replace(/\.docx$/i, ".md"));
      const md = await fs.readFile(mdPath, "utf8");
      parts.push("## API DOCX\n\n" + stripSourceHeader(md));
    }
    const out = path.join(BASE, "TelCell", "Telcell_API_archive_26-02-09.md");
    await fs.writeFile(out, headerMain + parts.join("\n\n---\n\n"), "utf8");
    console.log("OK telcell combined ->", path.relative(BASE, out));
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
