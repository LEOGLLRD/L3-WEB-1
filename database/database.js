const { Sequelize, Op } = require("sequelize");


//Création de la variable de connexion avec les paramètres 
//de connexion du serveur
const sequelize = new Sequelize(

    'progwebserveur',
    'root',
    '',

    {

        host: "127.0.0.1",
        dialect: 'mysql'

    }

);

Connection();

//Création de la table users et définition des attributs
const Users = sequelize.define("users", {


    idUsers: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    email: {
        type: Sequelize.DataTypes.STRING(45),
        allowNull: false
    },

    pseudo: {
        type: Sequelize.DataTypes.STRING(45),
        allowNull: false
    },

    name: {
        type: Sequelize.DataTypes.STRING(45),
        allowNull: false
    },

    lastName: {
        type: Sequelize.DataTypes.STRING(45),
        allowNull: false
    },

    password: {
        type: Sequelize.DataTypes.STRING(45),
        allowNull: false
    },

    isAdmin: {
        type: Sequelize.DataTypes.TINYINT,
        defaultValue: 0
    }

});

sequelize.sync().then(() => {
    console.log("Table created successfuly !");

}).catch((error) => {
    console.error("Unable to create table :", error);

});

//Fonction permettant l'enregistrement d'un nouveau compte
function Register(pseudo, email, name, lastname, password) {

    sequelize.sync().then(() => {

        Users.create({
            pseudo: pseudo,
            email: email,
            name: name,
            lastName: lastname,
            password: password

        }).then(res => {
            console.log(res);
        }).catch((error) => {
            console.error('Failed to create a new record : ', error);

        });

    }).catch((error) => {
        console.error("Unable to create record : ", error);

    });

};

/*Fonction retournant vrai ou faux en fonction de si
le pseudo ou l'username sont déjà utilisés.
*/
async function checkIfUserRegistered(pseudoVar, emailVar) {

    try {

        let result = await Users.findOne({

            /*On cherche les tuples ayant pour pseudo celui reçu, ou
            ayant pour mail celui reçu aussi.
            */
            where: {
                [Op.or]: [
                    { pseudo: String(pseudoVar) },
                    { email: String(emailVar) }
                ],
            },
        });

        //Si un reésultat est trouvé 
        if (result) {
            //On return true
            return true;
        } else {
            //Sinon false
            return false;
        };


    } catch (error) {
        console.log(error);
        return true;

    }



}

//Fonction verifiant si un compte ayant pour pseudo : pseudoVar 
//et password : passwordVar, existe
async function checkIfUsernameAndPasswordMatches(pseudoVar, passwordVar) {

    try {

        let result = await Users.findOne({

            /*On cherche les tuples ayant pour pseudo celui reçu, ou
            ayant pour mail celui reçu aussi.
            */
            where: {
                pseudo: String(pseudoVar),
                password: String(passwordVar)
            },
        });

        //Si un résultat est trouvé 
        if (result) {
            //On return true
            return true;
        } else {
            //Sinon false
            return false;
        };


    } catch (error) {
        console.log(error);
        return false;

    }



}

//Fonction retournant le profil utilisateur d'un utilisateur
//en fonction de son pseudo
async function getProfilFromPseudo(pseudo) {

    try {

        let result = await Users.findOne({

            /*On cherche les tuples ayant pour pseudo celui reçu
            */
            where: {
                pseudo: String(pseudo),
            },
        });

        //Si un résultat est trouvé 
        if (result) {
            //On return le profil
            const profil = {

                pseudo: result.pseudo,
                email: result.email,
                name: result.name,
                lastname: result.lastName

            }
            return profil;
        } else {
            //Sinon false
            return null;
        };


    } catch (error) {
        console.log(error);
        return false;

    }


}

//Fonction retournant vrai ou faux si le compte
//associé à pseudoVar est administrateur ou non
async function checkIfuserIsAdmin(pseudoVar) {

    try {

        let result = await Users.findOne({

            /*On cherche les tuples ayant pour pseudo celui reçu, et
            ayant la valeur isAdmin à 1
            */
            where: {
                pseudo: String(pseudoVar),
                isAdmin: 1
            },
        });

        //Si un résultat est trouvé 
        if (result) {
            //On return true
            return true;
        } else {
            //Sinon false
            return false;
        };


    } catch (error) {
        console.log(error);
        return false;

    }

}

//Fonction supprimant le compte ayant pour pseudo : pseudoVar
async function deleteFromPseudo(pseudoVar) {

    try {

        Users.destroy(
            {
                where:
                    { pseudo: pseudoVar }
            })
            // destroy the album with an ID specified in the parameters of our HTTP request
            .then(count => {

                if (!count) {
                    return false;
                }
                else return true;

            }).catch((err) => {
                console.error(err);

            }); // your error handler here

    } catch (error) {
        console.error(error);
    }


}

//Fonction permettant la connexion à la base de données
function Connection() {

    sequelize.authenticate().then(() => {
        console.log("Connection has been established successfuly !");
    }).catch((error) => {
        console.error("Unable to connect to the database : ", error);
    });

};

//Fonction retournant tout les profiles utilisateurs 
async function getAllUsers() {

    try {
        let result = await Users.findAll({
            attributes: ['name', 'lastname', 'email', 'pseudo'],
            raw: true
        }).catch((err) => {
            console.error(err);
            return {};
        });

        return result;

    } catch (error) {
        return {};
    }


}

module.exports = { Register, checkIfUserRegistered, getAllUsers, deleteFromPseudo, checkIfUsernameAndPasswordMatches, getProfilFromPseudo, checkIfuserIsAdmin, sequelize, Sequelize, Users }; 