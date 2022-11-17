const passport = require("passport");
const { ExtractJwt } = require("passport-jwt/lib");
const JwtStrategy = require("passport-jwt/lib/strategy");
var LocalStrategy = require('passport-local').Strategy;


//On définie une stratégie locale pour le chemin /signup
passport.use('signup', new LocalStrategy(
    {
        emailField: 'email',
        passwordField: 'password'

    },

    async (email, password, done) => {

        try {
            const user = {

                email: email,
                password: password

            }
            return done(null, user);
        } catch (error) {
            done(error);
        }

    }
));


//On définie une stratégie locale pour le chemin /login
passport.use('login', new LocalStrategy(
    {
        pseudoField: 'pseudo',
        passwordField: 'password'
    },
    async (pseudo, password, done) => {

        try {
            const user = {
                pseudo: pseudo,
                password: password
            }

            if (!user) {
                return done(null, false, { message: "User not found !" });
            }

            return done(null, user, { message: "Logged in Successfully !" });
        } catch (error) {
            done(error);
        }

    }
));


//Pour toutes les routes qui n'ont pas été spécifiées, 
//on défénie la nécéssité d'un token (récupérer via l'url)
//pour pouvoir utiliser ces routes
passport.use(
    new JwtStrategy({
        secretOrKey: "TOP_SECRET",
        jwtFromRequest: ExtractJwt.fromUrlQueryParameter('secret_token')
    },
        async (token, done) => {
            try {
                return done(null, token.user);
            } catch (error) {
                done(error);
            }
        }
    )
);