//Copyright (c) 2024 Ruprous
function importFileFromPath(filePath) {
    if (!app.project) {
        return;
    }

    var file = new File(filePath);

    if (!file.exists) {
        return;
    }

    try {
        app.project.importFiles(
            [file.fsName],          // string path
            true,                   // suppress UI
            app.project.rootItem,   // target bin
            false                   // not numbered stills
        );
    } catch (e) {
        $.writeln("⚠️ importFiles error: " + e.toString());
    }
}

function findOrCreateBinByName(binName) {
    var root = app.project.rootItem;
    for (var i = 0; i < root.children.numItems; i++) {
        if (root.children[i].name === binName && root.children[i].type === ProjectItemType.BIN) {
            return root.children[i];
        }
    }
    return root.createBin(binName);
}

function importFileFromPathWithBin(path, binName) {
    if (!app.project) return false;

    var file = new File(path);
    if (!file.exists) return false;

    try {
        var targetBin = findOrCreateBinByName(binName);
        return app.project.importFiles(
            [file.fsName],
            true,
            targetBin,
            false
        );
    } catch (e) {
        $.writeln("⚠️ importFileFromPathWithBin error: " + e.toString());
        return false;
    }
}
