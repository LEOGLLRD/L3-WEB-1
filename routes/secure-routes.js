
const express = require('express');

//Routes liées aux chemins /profil
const profilRouter = express.Router();

//Routes liées aux chemins /add-file
const fileRouter = express.Router();

//Routes liées aux chemins /users
const usersRouter = express.Router();

const db = require("../database/database");
const fs = require("fs");
const path = require("path");

profilRouter.get(
    '/',
    async (req, res, next) => {

        let profil = await db.getProfilFromPseudo(req.query.username);

        res.json({
            profil: profil,
        })
    }

);


fileRouter.post(
    '/',
    async (req, res, next) => {



        try {

            //Récupération du non du fichier
            var fileName = path.basename(req.query.filepath);
            var destPath = "./savedFiles/";

            console.log('filename :', fileName);

            //Copie du fichier à la destination
            fs.copyFile(String(req.query.filepath), (destPath.concat("", fileName)), (err) => {

                //Si erreur
                if (err) {
                    throw err;
                }

                //Si pas d'erreur
                else {
                    //Un fichier à été trouvé
                    console.log("File from :", req.query.filepath, "imported");
                    res.json({
                        message: "File imported ! "
                    });
                }
            });

        } catch (error) {
            console.error(error);
            res.json({
                message: "Error ! File not found ! "
            });
        }
    }
);

usersRouter.post(
    '/rm',
    async (req, res, next) => {

        //Verification si le token est lié à un compte admin
        if (await db.checkIfuserIsAdmin(req.user.pseudo)) {

            //Verification si le compte que l'on veut supprimer existe
            if (await db.checkIfUserRegistered(req.query.username, "")) {

                //Si existe on supprime
                db.deleteFromPseudo(req.query.username);
                res.json({
                    message: "Account deleted !"
                });
            }

            //Si n'existe pas message d'information
            else {
                res.json({
                    message: "The account you are trying to delete, doesn't exists !"
                });
            }
        }

        //Si le token n'est pas lié à un compte admin
        else {

            //Message qui indique que le compte n'est pas administrateur
            res.json({
                message: "You are not an administrator !"
            });
        }
    }
);

//Fonction permettante de copier un fichier à partir d'un 
//chemin source, et le coller à un chemin destination
function importFileFromPath(srcPath) {

    try {

        //Récupération du non du fichier
        var fileName = path.basename(srcPath);
        var destPath = "./savedFiles/";

        console.log('filename :', fileName);

        //Copie du fichier à la destination
        fs.copyFile(String(srcPath), (destPath.concat("", fileName)), (err) => {

            //Si erreur
            if (err) {
                throw err;
            }

            //Si pas d'erreur
            else {

                //Un fichier à été trouvé
                console.log("File from :", srcPath, "imported");
                return true;
            }
        });

    } catch (error) {
        console.error(error);
        return false;
    }


}



usersRouter.post(
    '/list',
    async (req, res, next) => {


        //Verification si le token est lié à un compte administrateur
        //Si oui
        if (await db.checkIfuserIsAdmin(req.user.pseudo)) {

            //On récupère tout les profiles utilisateurs
            let result = await db.getAllUsers();
            res.json(result);
        }

        //Si non
        else {

            //Message qui indique que le compte n'est pas administrateur
            res.json({

                message: 'You are not an administrator !'

            });

        }



    }
);

module.exports = { profilRouter, fileRouter, usersRouter };