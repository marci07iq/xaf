export function loadTextfile(filepath, split) {
    return new Promise((resolve, reject) => {
        let client = new XMLHttpRequest();
        client.open('GET', filepath);
        client.onreadystatechange = () => {
            if (client.readyState === XMLHttpRequest.DONE) {
                if (client.status === 0 || (client.status >= 200 && client.status < 400)) {
                    if (split) {
                        let rows = client.responseText.split(/\r?\n/);
                        let res = [];
                        //Clean empty rows.
                        rows.forEach((row) => {
                            if (row.length > 0) {
                                res.push(row);
                            }
                        })
                        resolve(res);
                    } else {
                        resolve(client.responseText);
                    }
                } else {
                    reject();
                }
            }

        };
        client.send();
    });
};

export function loadKeyframes(filepath) {
    return loadTextfile(filepath, true)
        .then((lines) => {
            return lines.map((line) => {
                let line_elems = line.split(" ");
                return line_elems.map((value) => Number(value));
            })
        });
};