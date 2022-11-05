const app = require("./app");
const mongoose = require("mongoose");

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (err) => {
  console.log("Uncaught exception");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then((connection) => {
  console.log("Connected to DB");
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`App is running at port ${PORT}`);
});
