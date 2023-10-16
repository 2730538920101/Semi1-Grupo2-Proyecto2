const express = require('express');
const router = express.Router();
const bucket = require('./bucket_controller');
const cognito = require('./cognito_controller');
const util = require('./util');
const conn = require('./conexion');

/** Creacion de un usuario */
router.post('/register', bucket.upload.single('PICTURE'), async (req, res) => {
    try {
        // Se obtiene los parametros que posee esta entidad
        const parametro = req.body;

        // Encriptacion de la contrasenia
        const hashedPassword = await util.hashPassword(parametro.APP_PASSWORD);

        // Subida de la foto
        bucket.uploadFiletoS3(req.file, process.env.AWS_BUCKET_FOLDER_PROFILE, (err, data) => {
            if (err) {
                console.error('Error al subir el archivo de S3:', err);
                res.json({ success: false, result: "Ha ocurrido un error al subir el archivo" });
            } else {
                const url_archivo = data;
                const query = 'INSERT INTO APP_USER (FULL_NAME, EMAIL, DPI, APP_PASSWORD, PICTURE, USER_STATUS) VALUES (?, ?, ?, ?, ?, ?)';
                conn.query(query, [parametro.FULL_NAME, parametro.EMAIL, parametro.DPI, hashedPassword, url_archivo, "INACTIVO"], (err, result) => {
                    if (err) {
                        console.error('Error al insertar el usuario:', err);
                        res.json({ success: false, result: "Ha ocurrido un error al insertar el usuario" });
                    } else {

                        // Registro en cognito
                        const email = parametro.EMAIL;
                        const password = parametro.APP_PASSWORD;

                        // Lista de todos los atributos a ser enviados en cognito
                        const attributeList = cognito.listAtrributes('name', parametro.FULL_NAME, 'email', email, 'custom:dpi', parametro.DPI);

                        // Realizando registro de usuario en cognito
                        cognito.userPool.signUp(email, password, attributeList, null, (err, result) => {
                            if (err) {
                                console.error('Error al registrar usuario en Cognito:', err);
                                res.json({ success: false, result: "Ha ocurrido un error al registrar el usuario" });
                            } else {
                                res.json({ success: true, result: "Usuario creado correctamente" });
                            }
                        });
                    }
                });
            }
        });
    } catch (error) {
        console.error("Error al encriptar contraseña:", error);
        res.json({ success: false, result: "Ha ocurrido un error al encriptar la contraseña" });
    }
});

/** Verificacion del usuario */
router.post('/login', bucket.upload.single('PICTURE'), async (req, res) => {

    // Se obtienen los parametros necesarios
    const correo = req.body.EMAIL;
    const contrasenia = req.body.APP_PASSWORD;

    const authenticationData = {
        Username: correo,
        Password: contrasenia
    };

    const authenticationDetails = new cognito.AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

    const userData = {
        Username: correo,
        Pool: cognito.userPool
    };

    const cognitoUser = new cognito.AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (session) => {
            res.json({ success: true, mensaje: "Bienvenido", session: session });
        },
        onFailure: (err) => {
            console.error('Error al autenticar usuario:', err);
            res.json({ success: false, mensaje: "Credenciales incorrectas" });
        }
    });
});

module.exports = router;