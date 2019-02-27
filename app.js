const http = require("http");
const fs = require("fs");
const path = require("path");

http
  .createServer((request, response) => {
    let filePath = "." + request.url;
    if (filePath == "./") {
      filePath = "./index.html";
    }

    var extname = String(path.extname(filePath)).toLowerCase();
    var mimeTypes = {
      ".html": "text/html",
      ".js": "text/javascript",
      ".css": "text/css",
      ".json": "application/json",
      ".png": "image/png",
      ".jpg": "image/jpg",
      ".gif": "image/gif",
      ".wav": "audio/wav",
      ".mp4": "video/mp4",
      ".woff": "application/font-woff",
      ".ttf": "application/font-ttf",
      ".eot": "application/vnd.ms-fontobject",
      ".otf": "application/font-otf",
      ".svg": "application/image/svg+xml"
    };

    var contentType = mimeTypes[extname] || "application/octet-stream";

    fs.readFile(filePath, (error, content) => {
      if (error) {
        if (error.code == "ENOENT") {
          fs.readFile("./404.html", (error, content) => {
            response.writeHead(200, { "Content-Type": contentType });
            response.end(content, "utf-8");
          });
        } else {
          response.writeHead(500);
          response.end(
            "Sorry, check with the site admin for error: " +
              error.code +
              " ..\n"
          );
          response.end();
        }
      } else {
        response.writeHead(200, { "Content-Type": contentType });
        response.end(content, "utf-8");
      }
    });
  })
  .listen(8000);
console.log("Server running at localhost:8000/");
