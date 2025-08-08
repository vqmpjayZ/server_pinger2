const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

const serverAURL = "https://vadrifts-server-pinger.onrender.com";

let isRunning = false;
let stats = {
  totalPings: 0,
  successfulPings: 0,
  failedPings: 0,
  uptime: Date.now(),
  lastPingTime: null,
  lastPingStatus: null
};

async function pingServerA() {
  try {
    const startTime = Date.now();
    const res = await axios.get(`${serverAURL}/ping`, { 
      timeout: 10000,
      headers: { 'User-Agent': 'RenderKeepAlive/1.0' }
    });
    const responseTime = Date.now() - startTime;
    
    stats.totalPings++;
    stats.successfulPings++;
    stats.lastPingTime = Date.now();
    stats.lastPingStatus = 'success';
    
    console.log(`[✅] Pinged Server A | Status: ${res.status} | ${responseTime}ms`);
    return true;
  } catch (err) {
    stats.totalPings++;
    stats.failedPings++;
    stats.lastPingTime = Date.now();
    stats.lastPingStatus = 'failed';
    
    console.log(`[❌] Failed to ping Server A | ${err.message}`);
    return false;
  }
}

function startPinging() {
  if (isRunning) return;
  isRunning = true;
  
  console.log("🚀 Starting ping cycle to Server A...");
  
  setInterval(async () => {
    await pingServerA();
  }, 30000);
}

app.get("/", (req, res) => {
  res.json({
    status: "✅ Server B - Ping Server is running",
    uptime: Math.floor((Date.now() - stats.uptime) / 1000),
    stats: stats,
    target: serverAURL,
    isActive: isRunning,
    lastPing: stats.lastPingTime ? new Date(stats.lastPingTime).toISOString() : null
  });
});

app.get("/ping", (req, res) => {
  res.json({
    status: "pong",
    timestamp: Date.now(),
    server: "B"
  });
});

app.get("/stats", (req, res) => {
  res.json({
    ...stats,
    uptime: Math.floor((Date.now() - stats.uptime) / 1000),
    successRate: stats.totalPings > 0 ? ((stats.successfulPings / stats.totalPings) * 100).toFixed(2) + '%' : '0%',
    lastPingAgo: stats.lastPingTime ? Math.floor((Date.now() - stats.lastPingTime) / 1000) + 's' : 'never'
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server B running on port ${PORT}`);
  console.log(`🎯 Target: ${serverAURL}`);
  
  setTimeout(startPinging, 10000);
});
