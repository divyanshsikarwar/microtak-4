var urlExists = require("url-exists");

var XMLHttpRequest = require('xhr2');
var xhr = new XMLHttpRequest();
const axios = require("axios");
const express = require("express");
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const app = express();

var server = require("http").createServer(app);
server.listen(PORT, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("App listening at http://%s:%s", host, port);
});

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);
function validURL(str) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
}

app.post("/isUrlValid?", async function (req, res) {
  var url = req.body.url.trim();

  if (validURL(url) == false) {
    res.json({
      bool: false,
    });
    return;
  }

  console.log(url);

  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.onreadystatechange = function () {
    
    if (request.readyState === 4) {
      if (request.status === 200) {
        res.json({
          bool: true,
        });
        return
      }
    }
  };
  request.send();
  res.json({
    bool: false,
  });
  
});
