const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

const renderURL = "https://vadrifts-server-pinger.onrender.com/";

function pingRender() {
  setInterval(async () => {
    try {
      const res = await axios.get(renderURL);
      console.log(`[+] Pinged Render | Status: ${res.status}`);
    } catch (err) {
      console.log(`[-] Failed to ping Render | ${err.message}`);
    }
  }, 45000);
}

app.get("/", (req, res) => {
  res.send("✅ Replit Ping Server is alive");
});

app.listen(PORT, () => {
  console.log(`✅ Replit server running`);
  pingRender();
});
