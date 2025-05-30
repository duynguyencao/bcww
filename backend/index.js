const express = require("express");
const app = express();
const cors = require("cors");
const dbConnect = require("./db/dbConnect");
const UserRouter = require("./routes/UserRouter");
const PhotoRouter = require("./routes/PhotoRouter");
const session = require("express-session");

const path = require("path");
app.use('/images', express.static(path.join(__dirname, "images")));

dbConnect();

app.use(cors({
    origin: true,
    credentials: true,
}));

app.use(
    session({
        secret: "duy",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24
        }
    })
)

app.use(express.json());
app.use("/api/user", UserRouter);
app.use("/api/photo", PhotoRouter);

app.get("/", (request, response) => {
    response.send({ message: "Hello from photo-sharing app API!" });
});

app.listen(8081, () => {
    console.log("server listening on port 8081");
});