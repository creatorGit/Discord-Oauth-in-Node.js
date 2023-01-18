const passport = require("passport");
const DiscordStrategy = require("passport-discord");
const User = require("../database/schema/User")

passport.serializeUser((user, done) => {
    console.log("しりあ")
    console.log("セッションに格納")
    return done(null, user.discordId)
});

passport.deserializeUser(async (discordId, done) => {
    try {
        console.log("でしりあa")
        console.log("req.userに格納")
        const user = await User.findOne({ discordId });
        return user ? done(null, user) : done(null, null);
    } catch (err) {
        console.log(err)
        return done(err, null)
    };
});

passport.use(
    new DiscordStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CLIENT_CALLBACK_URI,
        scope: ["identify"],
    },
        async (accessToken, refreshToken, profile, done) => {
            const { id, discriminator, username, avatar } = profile;
            console.log(id, discriminator, username, avatar)
            try {
                const findUser = await User.findOneAndUpdate(
                    { discordId: id },
                    {
                        discordTag: `${username}#${discriminator}`,
                        avatar,
                    },
                    // { accessToken, refreshToken },
                    { new: true }
                );
                if (findUser) {
                    console.log("User was found")
                    return done(null, findUser)
                } else {
                    const newUser = await User.create({
                        discordId: id,
                        discordTag: `${username}#${discriminator}`,
                        avatar,
                        // accessToken,
                        // refreshToken
                    });
                    console.log("New User")
                    return done(null, newUser)
                }
            } catch (err) {
                console.log(err)
                console.log("エラー")
                return done(err, null)
            };
        },
    )
);