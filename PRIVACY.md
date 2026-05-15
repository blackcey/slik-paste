# SLIK Paste — Privacy Policy

_Last updated: 14 May 2026_

SLIK Paste is a browser extension published by **SLIK Consulting Ltd** (United Kingdom). This policy explains what the extension does with your data. The short version: **it does not collect, store, or transmit anything**. The longer version is below.

## What data the extension accesses

When you right-click in an editable field on a web page and choose **"SLIK Paste: IFS Discrete Values"**, the extension does the following — and only the following — in that moment:

1. Reads the current text contents of your operating-system clipboard, using the browser's standard Clipboard API.
2. Parses the clipboard text into a list of values (auto-detecting the delimiter).
3. Inserts the reformatted text into the editable field you right-clicked on.

That is the entire data flow. It happens in your browser, on your machine, while the menu item is being clicked.

## What data the extension stores

**None.** SLIK Paste declares no storage permissions and writes nothing to disk, browser storage, sync, or cookies. Closing the tab or restarting the browser leaves no extension state behind.

## What data the extension transmits

**None.** SLIK Paste makes no network requests. It does not contact SLIK Consulting Ltd, Google, Microsoft, or any third party. There are no analytics, telemetry, crash reporting, or update beacons beyond the standard browser-managed extension auto-update mechanism.

## Permissions, explained

| Permission       | Why it's needed                                                                                       |
|------------------|-------------------------------------------------------------------------------------------------------|
| `contextMenus`   | Adds the right-click menu item that triggers the paste.                                               |
| `clipboardRead`  | Reads the clipboard text so it can be reformatted. Only read at the moment you click the menu item.  |
| `activeTab`      | Grants temporary access to the page you right-clicked on, so the reformatted text can be inserted.    |
| `scripting`      | Injects the formatting & paste code into the active tab when the menu item is clicked.                |

The extension does **not** request `<all_urls>` host access, `storage`, `tabs`, `history`, `cookies`, or any other broad permission.

## Children's privacy

SLIK Paste is a productivity tool aimed at business users. It is not directed at children and collects no information from anyone, including children under 13.

## Changes to this policy

If the extension's data handling ever changes, this policy will be updated and the "Last updated" date above will change. Material changes will also be reflected in the Chrome Web Store and Microsoft Edge Add-ons listings.

## Contact

Questions about this policy or the extension:

**SLIK Consulting Ltd**
Email: _privacy@slikconsulting.com_ _(replace with your real address before publishing)_
Website: https://www.slikconsulting.com
