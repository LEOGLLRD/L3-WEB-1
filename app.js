require("./auth/auth");
require("./database/database");

const routes = require("./routes/routes");
const secureRoute = require("./routes/secure-routes");
const express = require('express');
const app = express();
const passport = require('passport');
const port = 3000;
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', routes);


//Uniquement les personnes connectées (ayant un token), ont accès aux routes du fichier secure-routes
app.use('/users', passport.authenticate('jwt', { session: false }), secureRoute.usersRouter);
app.use('/add-file', passport.authenticate('jwt', { session: false }), secureRoute.fileRouter);
app.use('/profil', passport.authenticate('jwt', { session: false }), secureRoute.profilRouter);

//Gestion des erreurs
app.use(function (err, req, res, next) {

    res.status(err.status || 500);
    res.json({error: err});

});

//Ecoute du port 3000
app.listen(port, () => {
    console.log('Server started.')
});




