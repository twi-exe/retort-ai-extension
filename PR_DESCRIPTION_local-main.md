feat: add Options page, secure key storage, CI and content-script fixes

Short summary
- Adds an Options page for managing the OpenRouter API key (plain + client-side AES-GCM encryption), fixes content-script filename/visibility logic, removes insecure hard-coded keys, and wires up CI + repository cleanups.

What changed (high-level)
- Added `public/options.html` — Options UI to:
  - Save a plain OpenRouter API key into `chrome.storage.local.openrouterApiKey`.
  - Encrypt an API key client-side with a passphrase (PBKDF2 + AES‑GCM) and store it in `chrome.storage.local.openrouterEncryptedApiKey` as { salt, iv, data } (base64).
  - Clear stored keys.
- Exposed the Options page in the manifest (`public/manifest.json` “options_ui`).
- Normalized and fixed the content script:
  - `src/content/ContentScript.js` — single canonical copy, fixed visible-element detection logic and length truncation to avoid API overload.
  - Added matching `public/contentScript.js` so built extension has the correct file in `dist/`.
- Removed hard-coded API key and updated popup code to rely on stored keys:
  - `src/api/openrouter.js` now accepts an `apiKey` parameter and throws a clear error when missing.
  - `src/popup/Popup.jsx` reads/writes key to `chrome.storage.local` (plain key flow).
- Build / packaging changes:
  - Removed dependency on static-copy plugin (now rely on `public/` for static files).
  - Added `.github/workflows/ci.yml` to run install, lint and build on pushes/PRs.
- Misc: README added/updated; removed redundant files; pinned React to 18.2.0 to avoid build issues.

How to test (quick)
1. Build locally:
   - `npm install`
   - `npm run build`
2. Load unpacked extension in Chrome/Edge from the `dist/` output folder.
3. Open Extension -> Options and:
   - Save a plain key, then try the popup flow and confirm API calls succeed (uses stored plain key).
   - Test encryption: paste a key and passphrase in Options -> Encrypt & Save — it stores encrypted payload (popup decryption UX is a follow-up).
4. Select text on a page, use the extension, and confirm the content extraction returns expected text.

Risks & notes
- Encryption is client-side only; the passphrase is not stored. Decrypting an encrypted key requires the passphrase.
- The popup currently reads the plain key from storage. Decryption + UX for encrypted keys is planned as a follow-up (not yet implemented here).
- Remote `main` had pre-existing commits — this PR is presented from `local-main` to avoid overwriting remote history.

Follow-ups (recommended)
1. Implement decryption flow in `src/popup/Popup.jsx` and a UX to prompt for passphrase when an encrypted key exists.
2. Add a small unit test for encryption/decryption round-trip and run it in CI.
3. Consider integrating a secure secret manager for stronger protection in production.
