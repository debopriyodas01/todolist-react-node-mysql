const express = require("express");
const cors = require("cors");

const { TodoRouter } = require("./routers/todos");
const { migrate } = require("./utils/db");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", TodoRouter);

const PORT = process.env.PORT || 8080;

async function start() {
  try {
    await migrate();

    app.listen(PORT, () => {
      console.log(`Server listening on ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to initialize database");
    console.error(err);
    process.exit(1);
  }
}

start();
