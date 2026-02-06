import express from "express";
const app = express();
app.get("/", (req, res) => res.send("OK"));
app.listen(3001, () => console.log("Minimal server listening at http://localhost:3001"));
