<!-- 创建一个窗口，加载网站 https://www.w3schools.com/html/tryit.asp?filename=tryhtml_iframe_height_width，然后去活动监视器中查看有多少渲染进程，结合 DOM 结构，尝试解释一下为什么？ -->

## 简要分析

页面的中包含了多个 iframe，利用 iframe 加载了多个资源，可以简单的理解加载一个 html 资源就会增加一个 renderer 进程

> 再加上本身的 loadURL 的页面会启动一个 renderer 进程；

> 开启的 openDevTools 也会启动一个 renderer 进程
