const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routers/auth");
const bookRoutes = require("./routers/book");
const borrowRoutes = require("./routers/api.borrow");
const app = express();

app.use(cors());
app.use(bodyParser.json());
connectDB();

app.use("/api/auth", authRoutes);
app.use("/api", bookRoutes);
app.use("/api/borrow", borrowRoutes);

app.listen(5000, () => {
    console.log(`Server is running on http://localhost:${5000}`);
});
