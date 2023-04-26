/**
 * 主进程和渲染进程如何通信
 */

/**
 * 第一种
 * 同步的方式，会阻塞渲染 sendSync returnValue
 * 不推荐： 第一种同步的方式是非常不推荐的，因为在通信期间会阻塞整个渲染进程，导致用户的交互（点击按钮、链接，页面滚动等）无响应
 */
// function setTheme(type) {
//   const value = myAPI.ipcRenderer.sendSync("isDarkMode");
//   console.log("sendSync reply", value);
//   console.log(type);
// }

/**
 * 第二种
 * 异步回调的方式 send reply
 */

function setTheme(type) {
  myAPI.send("isDarkMode", "hello a");

  myAPI.on("isDarkMode", (event, arg) => {
    console.log("send reply", ...arg);
    // event.reply("heihei", "message from main process~");
  });
  console.log(type);
}

/**
 * 第三种
 * 异步回调的方式 invoke handle
 */

// function setTheme(type) {
//   myAPI.ipcRenderer.invoke("isDarkMode").then((res) => {
//     console.log("invoke handle", res);
//   });
//   console.log(type);
// }
