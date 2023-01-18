const router = require("express").Router();
const passport = require("passport")

router.get("/discord", passport.authenticate("discord"), (req, res) => {
    res.send(req.user)
});

router.get("/discord/redirect", passport.authenticate("discord"), (req, res) => {
    res.redirect("http://localhost:3000/MyPage");
});

router.get("/status", (req, res) => {
    if (req.user) {
        console.log("正常")
        res.send(req.user)
    } else {
        console.log("Unauthorized")
        console.log(req.user)
        res.status(401).send("msg:Unauthorized")
    }
});

router.get('/signout', (req, res) => {
    req.session.passport.user = undefined;
    res.redirect("http://localhost:3000");
});

module.exports = router;