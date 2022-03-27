var XMLHttpRequest = require("xhr2");
var xhr = new XMLHttpRequest();
const isValidDomainExtension = require("is-valid-domain-extension");
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

function isUrlSeachQuery(url) {
  let searchURLS = [
    "search.yahoo.com/search",
    "bing.com/search?q",
    "google.com/search?q",
    "wordpress.org/openverse/search/?q",
    "yandex.com/search/?",
    "duckduckgo.com/?q",
    "qwant.com/?q",
    "startpage.com/do/search?q",
    "wiki.com/results",
    "search.brave.com/search?q",
  ];
  for (let i = 0; i < searchURLS.length; i++) {
    if (url.includes(searchURLS[i])) {
      return true;
    }
  }
  return false;
}

app.post("/isUrlValid?", async function (req, res) {
  var url = req.body.url.trim();
  if (url.includes("https://") == false) {
    url = "https://" + url;
  }

  var isExtensionValid = await isValidDomainExtension(url);

  if (
    validURL(url) == false ||
    isExtensionValid == false ||
    isUrlSeachQuery(url)
  ) {
    res.json({
      bool: false,
    });
    return;
  }

  console.log("Requested Url ->", url);

  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.onreadystatechange = async function () {
    if (request.readyState === 4) {
      console.log("Status ->", request.status);
      if (request.status === 200) {
        res.json({
          bool: true,
        });
      } else if (["404", "403", "0", "999"].includes(request.status)) {
        res.json({
          bool: false,
        });
      }
    }
  };
  try {
    request.send();
  } catch {
    
    res.json({
      somethingWentWrong: true,
      bool: false,
    });
  }
});
