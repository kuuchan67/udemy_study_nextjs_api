const express = require("express");
const app = express();
const authRoute = require("./routers/auth");
const postsRoute = require("./routers/posts");
const usersRoute = require("./routers/users");
const cors = require("cors");

const port = 5000;


// test
// app.get("/", (req, res) => {
//     res.send("<h1>hello</h1>");
// });

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/posts", postsRoute);
app.use("/api/users", usersRoute);


app.listen(port, () => console.log(`server is runnninng on port ${port}`));