const { ipcRenderer } = require("electron");

document.addEventListener("DOMContentLoaded", () => {
  const clock = document.getElementById("clock");
  console.log(clock, "clock");
  clock.addEventListener("mouseenter", () => {
    console.log("==mouseenter==");
    ipcRenderer.send("set-ignore-mouse-events", false);
  });
  clock.addEventListener("mouseleave", () => {
    console.log("==mouseleave==");
    ipcRenderer.send("set-ignore-mouse-events", true, { forward: true });
  });
});
