const express = require("express")
const path = require("path")
const fs = require("fs")

let app = express();
let PORT = process.env.PORT ||3000;

fs.writeFile(path.join(__dirname, "db/db.json"), "[]", function (err) {
    if (err) {
        return console.log(err);
    }
    console.log("success cleared storage")

})

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/notes", function (req, res) {
    res.sendfile(path.join(__dirname, "public/notes.html"))
});
app.get("/api/notes", function (req, res) {
    fs.readFile(path.join(__dirname, "db/db.json"), "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        data = JSON.parse(data)
        res.send(data);

    })
});
app.post("/api/notes", function (req, res) {
    fs.readFile(path.join(__dirname, "db/db.json"), "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        };
        data = JSON.parse(data)
        data.push(req.body)
        fs.writeFile(path.join(__dirname, "db/db.json"), JSON.stringify(data), function (err) {
            if (err) {
                return console.log(err);
            }
            res.send(data);
        })

    })
});
app.delete("/api/notes/:note", function (req, res) {
    fs.readFile(path.join(__dirname, "db/db.json"), "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        let remove = req.params.note;
        data = JSON.parse(data)
        let result = data.filter(data => data.title !== remove);
        fs.writeFile(path.join(__dirname, "db/db.json"), JSON.stringify(result), function (err) {
            if (err) {
                return console.log(err);
            }
        })
        res.send(data);
    });
})

app.listen(PORT, function () {
    console.log("App listening on port" + PORT)
})