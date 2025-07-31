require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let urlDatabase = [];

function isValidHttpUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

app.post("/api/shorturl", (req, res) => {
  console.log("Body: ", req.body);
  const { url } = req.body; // receive the body/URL

  if (!isValidHttpUrl(url)) {
    return res.json({ error: "invalid url" });
  } // check validity of URL

  const short_url = urlDatabase.length + 1; // assign short URL ID

  urlDatabase.push({ original_url: url, short_url: short_url }); // save or push to memory

  res.json({ original_url: url, short_url: short_url }); // display
});

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.get("/api/shorturl/:short_url", (req, res) => {
  const short = parseInt(req.params.short_url);
  const entry = urlDatabase.find((e) => e.short_url === short);

  if (!entry) return res.status(404).json({ error: "No short URL found" });
  res.redirect(entry.original_url);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
