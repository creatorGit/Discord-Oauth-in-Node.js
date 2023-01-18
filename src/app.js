require('dotenv').config();
require("./strategies/discord")

const express = require('express');
const PORT = process.env.PORT || 5000;
const app = express();
const routes = require("./routes");

const passport = require("passport");
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors");
const Store = require("connect-mongo")(session);


app.use(cors({
    //アクセス許可するオリジン
    origin: ['http://localhost:3000'],
    //レスポンスヘッダーにAccess-Control-Allow-Credentials追加
    credentials: true,
}))

mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true,
    sslValidate: false,
}).then(() => {
    console.log("DBと接続中")
}).catch((err) => {
    console.log("MongoDBのエラーです")
    console.log(err)
});

app.use(session({
    secret: "secret",
    cookie: {
        maxAge: 60000 * 60 * 24 * 7,
        secure: true,
        sameSite: 'none'
    },
    resave: false,
    saveUninitialized: false,
    store: new Store({ mongooseConnection: mongoose.connection })
}));

app.set("trust proxy", 1);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api", routes);

app.use("/", (req, res) => {
  res.send("API is Working");
});

app.listen(process.env.PORT || 5000, () => {
    console.log(`App started on port ${PORT}`);
});