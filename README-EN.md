# RP Folder Watcher

**Version: v1.0.1**

Premiere Pro Adobe CEP extension.  
Automatically imports images, videos, audio, PSD, AI, and other files into your project by monitoring a specified folder.

---

## 🆕 Changelog

### v1.0.1
- Improved detection of large file write completion to prevent premature import of incomplete files
- Import failures are no longer recorded in the history, making re-import easier

---

## 📦 Main Features

- Automatically imports files only after confirming file stability  
- Filter settings for each media type (image / video / audio / graphic)  
- Toggle import targets via UI checkboxes (settings saved in localStorage)  
- Already imported files are skipped to prevent duplicates  
- Project-specific settings (watched folders, etc.) and import history are managed/restored via JSON

---

## 🔧 Technical Overview

| File                   | Description                                      |
|------------------------|--------------------------------------------------|
| `index.html`           | UI panel                                         |
| `ext.js`               | CEP panel logic (fs.watch, import control, etc.) |
| `Importer.jsx`         | ExtendScript for actual import into Premiere Pro |
| `manifest.xml`         | Extension meta info (ID, supported versions, etc.)|
| `style.css`            | UI styling                                       |
| `projectFolderMap.json`| Watched folder settings per project              |
| `importedFilesMap.json`| Record of imported files                         |

---

## 📂 Directory Structure (Simplified)

```
RPFolderWatcher/
├── css/
├── CSXS/
├── jsx/
├── lib/
├── index.html
├── ext.js
├── importedFilesMap.json
├── projectFolderMap.json
├── LICENSE.md
├── LICENSE_us_en.md
└── README.md
```

---

## 🚀 System Requirements

- **Supported Software:** Adobe Premiere Pro (CEP extension compatible versions)  
- **Tested Version:** **Premiere Pro 25.1.0 (Build 73 / 2025)**  
- **Tested OS:** Windows 10  
- **Mac operation is untested.**

> 🔧 This extension does not require Node.js and runs entirely on Adobe CEP.

---

## 🐛 Enable Debug Mode (Windows)

To load Adobe CEP extensions, you need to enable debug mode in the Windows registry.

### Steps

1. Press **Windows Key + R** to open "Run"  
2. Enter `regedit` and click OK to launch the Registry Editor  
3. Navigate to:

   ```
   HKEY_CURRENT_USER\SOFTWARE\Adobe\CSXS.12
   ```

4. Add or edit the following two string values (`REG_SZ`) in the right pane:

   | Name              | Type    | Value      |
   |-------------------|---------|------------|
   | `PlayerDebugMode` | `REG_SZ`| `1`        |
   | `LogLevel`        | `REG_SZ`| `1` (optional) |

> `CSXS.12` may differ depending on your Adobe CC version.

---

## 🔧 Installation (Windows)

1. Open the following path:

   ```
   C:\Users\<YourUserName>\AppData\Roaming\Adobe\CEP\extensions\
   ```

2. Clone or download this repository as a ZIP,  
   and copy all contents into a folder named `RP-FolderWatcher` at the above location.

   The final structure should look like:

   ```
   C:\Users\<YourUserName>\AppData\Roaming\Adobe\CEP\extensions\RP-FolderWatcher\
       ├── index.html
       ├── ext.js
       ├── CSXS/
       ├── jsx/
       ├── ... (omitted)
   ```

3. Restart Premiere Pro and open `RP Folder Watcher` from "Window > Extensions".

---

## ⚠️ Notes

- All files in this project are **prohibited from redistribution or commercial use without the author's permission**.
- You may use or modify for personal use, but **redistribution or sale is prohibited**.
- For detailed license terms, see [`LICENSE.md`](./LICENSE.md) or [`LICENSE_us_en.md`](./LICENSE_us_en.md).

---

## 📜 License

© 2024 Ruprous  
This software is licensed under custom terms.  
See [`LICENSE.md`](./LICENSE.md) or [`LICENSE_us_en.md`](./LICENSE_us_en.md) for details.