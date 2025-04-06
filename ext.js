//Copyright (c) 2024 Ruprous

let csInterface = null;

function log(msg) {
  const full = `[LOG] ${msg}`;
  const logList = document.getElementById("log-list");
  if (logList) {
    const line = document.createElement("div");
    line.textContent = full;
    logList.appendChild(line);

    logList.scrollTop = logList.scrollHeight;
  }
}


function loadJSX(fileName) {
  const extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION) + "/jsx/";
  csInterface.evalScript(`$.evalFile("${extensionRoot + fileName}.jsx")`);
}

function saveFilterSettings() {
  const filters = {
    image: document.getElementById("filter-image")?.checked ?? true,
    video: document.getElementById("filter-video")?.checked ?? true,
    audio: document.getElementById("filter-audio")?.checked ?? true,
    graphic: document.getElementById("filter-graphic")?.checked ?? true
  };
  localStorage.setItem("mediaFilters", JSON.stringify(filters));
}

function loadFilterSettings() {
  const filters = JSON.parse(localStorage.getItem("mediaFilters") || "{}");
  if (filters.image !== undefined) document.getElementById("filter-image").checked = filters.image;
  if (filters.video !== undefined) document.getElementById("filter-video").checked = filters.video;
  if (filters.audio !== undefined) document.getElementById("filter-audio").checked = filters.audio;
  if (filters.graphic !== undefined) document.getElementById("filter-graphic").checked = filters.graphic;
}

function registerFilterCheckboxEvents() {
  ["filter-image", "filter-video", "filter-audio", "filter-graphic"].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("change", saveFilterSettings);
    }
  });
}

let newlyImportedFiles = [];
function notifyBatchImportedFiles() {
  if (newlyImportedFiles.length === 0) return;
  const message = "✅ Imported: " + newlyImportedFiles.join(", ");
  log(message);
  newlyImportedFiles = [];
}

document.addEventListener("DOMContentLoaded", () => {
  csInterface = new CSInterface();

  loadFilterSettings();
  registerFilterCheckboxEvents();

  function safeImport(normalized, filename, mediaType) {
    try {
      let attempts = 0;
      const maxAttempts = 10;
      const checkInterval = 500;
  
      const checkStability = () => {
        try {
          const size1 = fs.statSync(normalized).size;
  
          setTimeout(() => {
            const size2 = fs.statSync(normalized).size;
  
            if (size1 === size2) {
              log(`📁 File stable: ${filename}`);
  
              // インポート実行
              setTimeout(() => {
                csInterface.evalScript(
                  `importFileFromPathWithBin("${normalized}", "${mediaType}")`,
                  (result) => {
                    if (result === "true") {
                      if (!isFileAlreadyImported(projectPathKey, normalized)) {
                        markFileAsImported(projectPathKey, normalized);
                        setTimeout(notifyBatchImportedFiles, 300);
                      } else {
                        log(`⏩ Already imported (skipped): ${filename}`);
                      }
                    } else {
                      log(`❌ Import failed, not recorded: ${filename}`);
                    }
                  }
                );
              }, 300);
            } else {
              attempts++;
              if (attempts < maxAttempts) {
                log(`⏳ File still writing: ${filename} (retry ${attempts})`);
                checkStability();
              } else {
                log(`❌ Gave up waiting: ${filename}`);
              }
            }
          }, checkInterval);
        } catch (e) {
          log(`❌ Failed to stat: ${filename} (${e.message})`);
        }
      };
  
      checkStability();
    } catch (e) {
      log(`❌ safeImport error: ${e.message}`);
    }
  }
  
  
  
  loadJSX("PPRO/Importer");

  const fs = require("fs");
  const path = require("path");
  const saveFilePath = path.join(csInterface.getSystemPath(SystemPath.EXTENSION), "projectFolderMap.json");
  const importedMapPath = path.join(csInterface.getSystemPath(SystemPath.EXTENSION), "importedFilesMap.json");

  const SUPPORTED_EXTS = [
    ".png", ".jpg", ".jpeg", ".gif", ".webp", ".psd", ".ai",
    ".mp4", ".mov", ".avi",
    ".mp3", ".wav"
  ];
  const isSupportedFile = (filename) => {
    return SUPPORTED_EXTS.includes(path.extname(filename).toLowerCase());
  };

  function getMediaTypeFromExt(ext) {
  ext = ext.toLowerCase();
  if ([".png", ".jpg", ".jpeg", ".gif", ".webp", ".bmp"].includes(ext)) return "image";
  if ([".mp4", ".mov", ".avi", ".mkv"].includes(ext)) return "video";
  if ([".mp3", ".wav", ".aac", ".flac"].includes(ext)) return "audio";
  if ([".psd", ".ai"].includes(ext)) return "graphic";
  return null;
}


  const chooseBtn = document.getElementById("choose-folder");
  const toggleBtn = document.getElementById("toggle-watch");
  const clearBtn = document.getElementById("clear-folder");
  const pathDisplay = document.getElementById("folder-path");
  const statusDisplay = document.getElementById("status");

  let currentFolder = null;
  let isWatching = false;
  let projectPathKey = null;
  let watcher = null;
  let importedFilesMap = {};

  function updateStatus() {  
 
    statusDisplay.textContent = `Watching: ${isWatching ? "ON" : "OFF"}`;
    toggleBtn.textContent = isWatching ? "Stop Watching" : "Start Watching";
    toggleBtn.style.backgroundColor = isWatching ? "#4caf50" : "#2c2c2c";
  }
  
  

  const openFolderInExplorer = (path) => {
    csInterface.evalScript(`Folder("${path}").execute();`);
  };

  const getProjectPath = async () => {
    return new Promise((resolve) => {
      csInterface.evalScript("app.project.path", (result) => {
        if (result && result !== "undefined") {
          resolve(result);
        } else {
          resolve(null);
        }
      });
    });
  };

  const loadFolderForProject = (path) => {
    const savedMap = JSON.parse(localStorage.getItem("projectFolderMap") || "{}");
    return savedMap[path] || null;
  };

  const saveFolderForProject = (path, folder) => {
    const savedMap = JSON.parse(localStorage.getItem("projectFolderMap") || "{}");
    savedMap[path] = folder;
    localStorage.setItem("projectFolderMap", JSON.stringify(savedMap));
    exportFolderMapToFile();
  };

  const removeFolderForProject = (path) => {
    const savedMap = JSON.parse(localStorage.getItem("projectFolderMap") || "{}");
    delete savedMap[path];
    localStorage.setItem("projectFolderMap", JSON.stringify(savedMap));
    exportFolderMapToFile();
  };

  const exportFolderMapToFile = () => {
    const savedMap = JSON.parse(localStorage.getItem("projectFolderMap") || "{}");
    fs.writeFileSync(saveFilePath, JSON.stringify(savedMap, null, 2), "utf8");
    //log("Exported folder map to projectFolderMap.json");
  };

  const importFolderMapFromFile = () => {
    if (fs.existsSync(saveFilePath)) {
      const data = fs.readFileSync(saveFilePath, "utf8");
      localStorage.setItem("projectFolderMap", data);
      //log("Imported folder map from projectFolderMap.json");
    }
  };

  const loadImportedMap = () => {
    try {
      if (fs.existsSync(importedMapPath)) {
        importedFilesMap = JSON.parse(fs.readFileSync(importedMapPath, "utf8"));
      }
    } catch (e) {
      log("⚠ Failed to load importedFilesMap.json: " + e.message);
      importedFilesMap = {};
    }
  };

  const saveImportedMap = () => {
    try {
      fs.writeFileSync(importedMapPath, JSON.stringify(importedFilesMap, null, 2), "utf8");
    } catch (e) {
      log("⚠ Failed to save importedFilesMap.json: " + e.message);
    }
  };

  const isFileAlreadyImported = (projectKey, filePath) => {
    const imported = importedFilesMap[projectKey] || [];
    return imported.includes(filePath);
  };

  const markFileAsImported = (projectKey, filePath) => {
    if (!importedFilesMap[projectKey]) {
      importedFilesMap[projectKey] = [];
    }
    importedFilesMap[projectKey].push(filePath);
    saveImportedMap();

    const filename = path.basename(filePath);
    newlyImportedFiles.push(filename);
  };

  const startWatchingFolder = (folderPath) => {
  
    if (watcher) watcher.close();
  
    const isTypeEnabled = (mediaType) => {
      const filterId = `filter-${mediaType}`;
      const checkbox = document.getElementById(filterId);
      return checkbox ? checkbox.checked : false;
    };
  
    try {
      watcher = fs.watch(folderPath, { encoding: "utf8" }, (eventType, filename) => { 
        if (eventType === "rename" && isSupportedFile(filename)) {
          const fullPath = path.join(folderPath, filename);
          const normalized = fullPath.replace(/\\/g, "/");
  
          if (isFileAlreadyImported(projectPathKey, normalized)) {
            log("⏩ Already imported: " + filename);
            return;
          }
  
          const ext = path.extname(filename).toLowerCase();
          const mediaType = getMediaTypeFromExt(ext);
  
          if (!isTypeEnabled(mediaType)) {
            log(`⛔ Skipped by filter: ${filename}`);
            return;
          }
          safeImport(normalized, filename, mediaType);
  
          if (!isFileAlreadyImported(projectPathKey, normalized)) {
            markFileAsImported(projectPathKey, normalized);
          }
          setTimeout(notifyBatchImportedFiles, 300);
        }
      });
  
    } catch (e) {
      log("❌ fs.watch failed: " + e.message);
    }
  
    try {
      const files = fs.readdirSync(folderPath);
      files.forEach((file) => {
        if (isSupportedFile(file)) {
          const fullPath = path.join(folderPath, file);
          const normalized = fullPath.replace(/\\/g, "/");
  
          if (isFileAlreadyImported(projectPathKey, normalized)) {
            log("⏩ Skipped (already imported): " + file);
            return;
          }
  
          const ext = path.extname(file).toLowerCase();
          const mediaType = getMediaTypeFromExt(ext);
  
          if (!isTypeEnabled(mediaType)) {
            log(`⛔ Skipped by filter: ${file}`);
            return;
          }
  
          safeImport(normalized, file, mediaType);
        }
      });
      setTimeout(notifyBatchImportedFiles, 500);
    } catch (e) {
      log("❌ readdirSync failed: " + e.message);
    }
  };
  
  
  

  const stopWatchingFolder = () => {
    if (watcher) {
      watcher.close();
      watcher = null;
      //log("Stopped watching folder.");
    }
  };

  importFolderMapFromFile();
  loadImportedMap();

  getProjectPath().then((path) => {
    if (!path) {
      log("⚠️ Project not saved yet.");
      pathDisplay.textContent = "⚠️ Save your project to enable folder linking.";
      return;
    }

    projectPathKey = path;
    //log("Project path: " + projectPathKey);

    const restored = loadFolderForProject(projectPathKey);
    if (restored) {
      currentFolder = restored;
      log("Restored folder: " + restored);
      pathDisplay.innerHTML = `Folder: <span id="open-folder" style="text-decoration: underline; cursor: pointer;">${restored}</span>`;
      document.getElementById("open-folder").addEventListener("click", () => {
        openFolderInExplorer(currentFolder);
      });
    }
  });

  chooseBtn.addEventListener("click", () => {
    const result = window.cep.fs.showOpenDialog(false, true, "Select a folder to watch", null, null);

    if (result && result.data && result.data.length > 0) {
      currentFolder = result.data[0];
      //log(`Selected folder: ${currentFolder}`);

      pathDisplay.innerHTML = `Folder: <span id="open-folder" style="text-decoration: underline; cursor: pointer;">${currentFolder}</span>`;
      document.getElementById("open-folder").addEventListener("click", () => {
        openFolderInExplorer(currentFolder);
      });

      saveFolderForProject(projectPathKey, currentFolder);
    } else {
      log("Folder selection was cancelled");
    }
  });

  toggleBtn.addEventListener("click", () => {
    if (!currentFolder) {
      alert("Please choose a folder first.");
      
      return;
    }

    isWatching = !isWatching;
    updateStatus();

    if (isWatching) {
      startWatchingFolder(currentFolder);
    } else {
      stopWatchingFolder();
    }

    //log(`Watching ${isWatching ? "started" : "stopped"}`);
  });

  clearBtn.addEventListener("click", () => {
    if (!projectPathKey) {
      alert("No project key available.");
      return;
    }

    if (!confirm("Clear the selected folder for this project?")) return;

    removeFolderForProject(projectPathKey);
    delete importedFilesMap[projectPathKey];
    saveImportedMap();

    currentFolder = null;
    stopWatchingFolder();
    pathDisplay.textContent = "※ No folder selected";
    log("Cleared saved folder and import history for this project");
  });

  updateStatus();
});

