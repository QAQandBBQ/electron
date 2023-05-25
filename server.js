const Koa = require("koa");

const port = 3030;
function createServer(port) {
  const app = new Koa();
  app.use((ctx, next) => {
    ctx.body = {
      success: true,
      port,
    };
  });
  app.listen(port, () => {
    console.log(`The server is running http://localhost:${port}`);
  });
}

createServer(port);

const port1 = 4000;
createServer(port1);

// const port1 = 4000;
// app.listen(port1, () => {
//   console.log(`The server is running http://localhost:${port1}`);
// });
