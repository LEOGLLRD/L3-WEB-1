
const db = require("../database/database");
const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");


router.post(
    '/signup',
    passport.authenticate('signup', { session: false }),
    async (req, res, next) => {

        //On verifie si l'username ou le mail est déjà attribué à quelqu'un
        //dans la base données. Le await permet d'attendre que la recherche dans 
        //la base de données soit terminée.

        //Si oui
        if (! await db.checkIfUserRegistered(req.query.username, req.query.email)) {

            //On enregistre le nouveau compte
            db.Register(req.query.username, req.query.email, req.query.name, req.query.lastname, req.query.password);

            //Et on envoie OK
            return res.json(
                {
                    message: 'OK',

                }
            );

        }

        //Si non
        else {

            //On envoie KO
            return res.json(
                {
                    message: 'KO',

                }
            );

        }

    }

);

router.get('/hello', function (req, res) {
    res.send('hello');
});

router.post(
    '/login',
    async (req, res, next) => {
        passport.authenticate(
            'login',
            async (err, user, info) => {
                try {
                    if (err || !user) {
                        const error = new Error('An error occured.');
                        return next(error);
                    }

                    //On vérifie si un compte existe avec le couple (username, password)

                    //Si oui
                    if (await db.checkIfUsernameAndPasswordMatches(req.query.username, req.query.password)) {

                        //On créer un token et on l'envoie en réponse
                        req.login(
                            user,
                            { session: false },
                            async (error) => {
                                if (error) { return next(error); }

                                const body = { _id: user.id, pseudo: user.pseudo };

                                //On créer un token, et on y lie un id et un pseudo
                                const token = jwt.sign({ user: body }, 'TOP_SECRET');

                                return res.json({ token });
                            }
                        );
                    }

                    //Si non
                    else {

                        //On retourne un message indiquant qu'aucun compte ne correspond
                        return res.json(
                            {
                                message: 'Bad credential/incorect user',
                            }
                        );
                    }
                } catch (error) {
                    return next(error);
                }
            }
        )(req, res, next);
    }
);



module.exports = router;
