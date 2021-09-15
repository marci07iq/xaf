import * as Utils from "../utils/utils.js";

class DataLoader {
    constructor() {

    }

    loadResource() {
        throw Error("overload");
    }

    loadKeyframes(name) {
        return this.loadResource(name).then(data => {
            let rows = data.split(/\r?\n/);
            let lines = [];
            //Clean empty rows.
            rows.forEach((row) => {
                if (row.length > 0) {
                    lines.push(row);
                }
            });
            return lines.map((line) => {
                let line_elems = line.split(" ");
                return line_elems.map((value) => Number(value));
            });
        });
    }

    loadMesh(name, scene) {
        return this.loadResource(name).then(data => {
            return BABYLON.SceneLoader.ImportMeshAsync("", "", "data:" + data, scene, null, ".obj");
        });
    }
}

class DataLoader_Folder extends DataLoader {
    constructor(data) {
        super();
        this.path = data.path;
    }

    init() {
        return Promise.resolve();
    }

    loadResource(name) {
        return Utils.Loader.loadTextfile(this.path + "/" + name, false);
    }
}

class DataLoader_ZIP extends DataLoader {
    constructor(data) {
        super();
        this.path = data.path;
    }

    init() {
        this.zip = new JSZip();

        return new JSZip.external.Promise((resolve, reject) => {
            JSZipUtils.getBinaryContent(this.path, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        }).then((data) => {
            return JSZip.loadAsync(data);
        }).then((loaded) => {
            this.contents = loaded;
            return Promise.resolve();
        });
    }

    loadResource(name) {
        return (this.contents.file(name)).async("string");
    }
}

export async function createDataLoader(data) {
    let res = undefined;
    switch (data.type) {
        case "folder":
            res = new DataLoader_Folder(data);
            break;
        case "zip":
            res = new DataLoader_ZIP(data);
            break;
    }

    await res.init();

    return res;
}