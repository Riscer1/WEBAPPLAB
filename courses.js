const express = require("express");
const path = require("path");
const mysql = require("mysql");
const myconn = require("express-myconnection")

var app = express();
app.use(express.urlencoded())

app.set("views", path.join(__dirname, 'views'));
app.set("view engine", "pug");

var dbOpts = {
    host: "localhost",
    user: "root",
    password: "root",
    database: "node4",
    port: 3306
}

app.use(myconn(mysql, dbOpts, "pool"));

app.get("/", function(req, res) {
    res.render("start");
});

app.get("/list", function(req, res) {
    var coursesList;
    // wpisane na sztywno VVVVVV
    // var coursesList = [
    //     {name: "WebApps", note: "2"},
    //     {name: "Java", note: "3.5"},
    //     {name: "DB", note: "4"}
    // ]
    req.getConnection(function(error, conn) {
        conn.query("SELECT * FROM courses", function(err, rows) {
            coursesList = rows;
            res.render("list", {coursesList: coursesList});
        });
    });
});

app.get("/add", function(req, res) {
    res.render("add");
});

app.post("/add", function(req, res) {
    var data = {
        name: req.body.name,
        note: req.body.note
    }
    console.log(data)
    req.getConnection(function(error, conn) {
        conn.query("INSERT INTO courses SET ?", data, function(err, rows) {
            var message;
            if(err) {
                message = "Wystąpił błąd podczas dodawania";
            } else {
                message = "Dodano!";
            }
            res.render("add", {message: message});
        });
    });
});

app.get("/edit/(:id)", function(req, res) {
    var id = req.params.id;
    req.getConnection(function(error, conn) {
        conn.query("SELECT * FROM courses WHERE id=?", id, function(err, rows) {
            res.render("edit", {id: id, name: rows[0].name, note: rows[0].note});
        });
    });
});

app.post("/edit/(:id)", function(req, res) {
    var id = req.params.id;
    var data = {
        name: req.body.name,
        note: req.body.note
    }
    console.log(data)
    req.getConnection(function(error, conn) {
        conn.query("UPDATE courses SET ? WHERE id=" + id, data, function(err, rows) {
            var message;
            if(err) {
                message = "Wystąpił błąd podczas edycji";
            } else {
                message = "Zmieniono!";
            }
            res.render("edit", {id: id, name: req.body.name, note: req.body.note, message: message});
        });
    });
});

app.listen(3000);