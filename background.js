const MENU_ID = "slik-paste-formatted";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: MENU_ID,
    title: "SLIK Paste: IFS Discrete Values",
    contexts: ["editable"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== MENU_ID || !tab?.id) return;
  chrome.scripting.executeScript({
    target: { tabId: tab.id, frameIds: info.frameId != null ? [info.frameId] : undefined },
    func: pasteFormatted
  });
});

function pasteFormatted() {
  // Parse spreadsheet-style text (tab cells, newline rows, Excel CSV quoting).
  // Returns a flat list of cells regardless of shape (1xN, Nx1, or NxM).
  function parseSpreadsheet(text) {
    const cells = [];
    let cur = "";
    let inQuotes = false;
    let atCellStart = true;
    let i = 0;
    while (i < text.length) {
      const c = text[i];
      if (inQuotes) {
        if (c === '"') {
          if (text[i + 1] === '"') { cur += '"'; i += 2; continue; }
          inQuotes = false; i++; continue;
        }
        cur += c; i++; continue;
      }
      if (atCellStart && c === '"') { inQuotes = true; atCellStart = false; i++; continue; }
      if (c === "\t") { cells.push(cur); cur = ""; atCellStart = true; i++; continue; }
      if (c === "\r" || c === "\n") {
        cells.push(cur); cur = ""; atCellStart = true;
        if (c === "\r" && text[i + 1] === "\n") i += 2; else i++;
        continue;
      }
      cur += c; atCellStart = false; i++;
    }
    cells.push(cur);
    return cells;
  }

  // Simple CSV split that respects double-quote groupings (for non-spreadsheet text).
  function splitCsv(text) {
    const out = [];
    let cur = "";
    let inQuotes = false;
    let atStart = true;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (inQuotes) {
        if (c === '"') {
          if (text[i + 1] === '"') { cur += '"'; i++; continue; }
          inQuotes = false; continue;
        }
        cur += c; continue;
      }
      if (atStart && c === '"') { inQuotes = true; atStart = false; continue; }
      if (c === ",") { out.push(cur); cur = ""; atStart = true; continue; }
      cur += c; atStart = false;
    }
    out.push(cur);
    return out;
  }

  (async () => {
    let text;
    try { text = await navigator.clipboard.readText(); }
    catch (e) { console.warn("SLIK Paste: clipboard read failed", e); return; }
    if (!text) return;

    let values;
    if (/[\t\r\n]/.test(text)) {
      // Looks like spreadsheet output (column, row, or 2-D range)
      values = parseSpreadsheet(text);
    } else if (text.includes(";")) {
      values = text.split(";");
    } else if (text.includes(",")) {
      values = splitCsv(text);
    } else {
      values = [text];
    }

    values = values
      .map(v => v.replace(/[\r\n\t]+/g, " ").trim())
      .filter(v => v.length > 0);

    if (values.length === 0) return;

    const formatted = values.map(v => `=${v}`).join(";") + ";";

    const el = document.activeElement;
    if (!el) return;

    const tag = el.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") {
      const start = el.selectionStart ?? el.value.length;
      const end = el.selectionEnd ?? el.value.length;
      const before = el.value.slice(0, start);
      const after = el.value.slice(end);
      const proto = tag === "INPUT" ? HTMLInputElement.prototype : HTMLTextAreaElement.prototype;
      const setter = Object.getOwnPropertyDescriptor(proto, "value").set;
      setter.call(el, before + formatted + after);
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
      const pos = start + formatted.length;
      try { el.setSelectionRange(pos, pos); } catch {}
    } else if (el.isContentEditable) {
      el.focus();
      document.execCommand("insertText", false, formatted);
    }
  })();
}
