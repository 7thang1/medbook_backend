const express = require('express');
const bodyParser = require('body-parser');
require("dotenv").config();
const mysql = require("mysql2");
const config = require("./src/config/configDatabase");
const connection = mysql.createConnection(config);
connection.connect((error) => {
    if (error) {
        console.error("Loi ket noi: ", error);
        return;
    }
    console.log("Ket noi thanh cong");
});

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (request, response) => {
    console.log(`URL: ${request.url}`);
    response.send("Hello, Server!");
});

// app.get("/users", (req, res) => {
//     connection.query('SELECT * FROM user', (error, results) => {
//     if (error){
//         console.error('Loi truy van: ', error);
//         res.status(500).json({message: 'Loi truy van'});
//         return;
//     }
//     res.json(results);
//     });
// });

app.use("/api/user", require("./src/routes/userAPI"));
app.use("/api/doctor", require("./src/routes/doctorAPI"));
app.use("/api/patient", require("./src/routes/patientAPI"));
app.use;
app.listen(PORT, () => {
  console.log("App running on port: " + PORT);
});