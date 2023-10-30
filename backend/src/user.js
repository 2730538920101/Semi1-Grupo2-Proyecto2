const express = require('express');
const router = express.Router();
const bucket = require('./bucket_controller');
const cognito = require('./cognito_controller');
const rekognition = require('./rekognition_controller');
const util = require('./util');
const conn = require('./conexion');

/*
NOTA: Para habilitar la opción de inicio de sesión de un usuario a través de una imagen,
es necesario que el usuario haya realizado al menos un inicio de sesión utilizando su contraseña previamente.
*/

/** Creacion de un usuario */
router.post('/register', bucket.upload.single('PICTURE'), async (req, res) => {
    try {
        // Se obtiene los parametros que posee esta entidad
        const parametro = req.body;

        // Encriptacion de la contrasenia
        const hashedPassword = await util.hashPassword(parametro.APP_PASSWORD);

        // Registro en cognito
        const email = parametro.EMAIL;
        const password = parametro.APP_PASSWORD;

        // Lista de todos los atributos a ser enviados en cognito
        const attributeList = cognito.listAtrributes('name', parametro.FULL_NAME, 'email', email, 'custom:dpi', parametro.DPI);

        // Realizando registro de usuario en cognito
        cognito.userPool.signUp(email, password, attributeList, null, (err, result) => {
            if (err) {
                console.error('Error al registrar usuario en Cognito:', err);
                res.json({ success: false, result: "Ha ocurrido un error al registrar el usuario - " + err.message });
            } else {
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

    // En el caso que no se proveea con un imagen, se realizara la validacion con cognito
    if (!req.file) {

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

                // Actualiza el estatus del usuario en el caso que no esta activo
                const query = "UPDATE APP_USER SET USER_STATUS = 'ACTIVO' WHERE EMAIL = ? AND USER_STATUS = 'INACTIVO'";
                conn.query(query, [correo], async (err, result) => {
                    if (err) {
                        console.error('Error al iniciar sesion del usuario:', err);
                        res.json({ success: false, result: "Ha ocurrido un error al iniciar sesion del usuario" });
                    } else {
                        const query = "SELECT ID_USER, FULL_NAME, EMAIL, DPI, PICTURE FROM APP_USER WHERE EMAIL = ? AND USER_STATUS = 'ACTIVO'";
                        conn.query(query, [correo], async (err, result) => {
                            if (err) {
                                console.error('Error al iniciar sesion del usuario:', err);
                                res.json({ success: false, result: "Ha ocurrido un error al iniciar sesion del usuario" });
                            } else {
                                res.json({ success: true, result: "Bienvenido", session: result });
                            }
                        });
                    }
                });
            },
            onFailure: (err) => {
                console.error('Error al autenticar usuario:', err);
                res.json({ success: false, result: "Credenciales incorrectas" });
            }
        });
    }
    // En el caso que se proveea con una imagen, se realizara la validacion con rekognition
    else {

        try {
            const query = "SELECT ID_USER, FULL_NAME, EMAIL, DPI, PICTURE FROM APP_USER WHERE EMAIL = ? AND USER_STATUS = 'ACTIVO'";
            conn.query(query, [correo], async (err, result) => {
                if (err) {
                    console.error('Error al iniciar sesion del usuario:', err);
                    res.json({ success: false, result: "Ha ocurrido un error al iniciar sesion del usuario" });
                } else {
                    if (result.length > 0) {
                        const isMatch = await rekognition.compareImages(result[0].PICTURE, req.file.buffer);
                        if (isMatch) {
                            res.json({ success: true, result: "Bienvenido", session: result });
                        } else {
                            res.json({ success: false, result: "Credenciales incorrectas" });
                        }
                    } else {
                        res.json({ success: false, result: "Credenciales incorrectas" });
                    }
                }
            });

        } catch (error) {
            console.error('Error al comparar imágenes:', error);
            res.json({ success: false, result: "Error al comparar imagenes" });
        }

    }
});

router.get('/friends', async (req, res) => {
    const ID_USER = req.query.ID_USER;

    try {
        const query = `
            SELECT af.ID_FRIEND, au.FULL_NAME, au.PICTURE
            FROM (
                SELECT REQUIRED_USER_ID AS ID_FRIEND
                FROM APP_FRIEND
                WHERE APPLICANT_USER_ID = ? AND APP_FRIEND_STATUS = 'Aceptada'
                UNION
                SELECT APPLICANT_USER_ID AS ID_FRIEND
                FROM APP_FRIEND
                WHERE REQUIRED_USER_ID = ? AND APP_FRIEND_STATUS = 'Aceptada'
            ) af
            INNER JOIN APP_USER au ON af.ID_FRIEND = au.ID_USER;
        `;
        conn.query(query, [ID_USER,ID_USER], async (err, result) => {
            if (err) {
                console.error('Error al optener a los amigos:', err);
                res.json({ success: false, result: "Error al optener a los amigos" });
            } else {
                res.json({ success: true, result: "Amigos optenidos exitosamente", friends: result });
            }
        });

    } catch (error) {
        console.error('Error al comparar imágenes:', error);
        res.json({ success: false, result: "Error al comparar imagenes" });
    }
});

router.get('/toconnect', async (req, res) => {

    // Se obtienen los parametros necesarios
    const ID_USER = req.query.ID_USER;

    try {
        const query = `
            -- Obtener APPLICANT_USER_ID cuando REQUIRED_USER_ID = ID_USER y APP_FRIEND_STATUS = "Enviada"
            SELECT AF.APPLICANT_USER_ID AS OTHER_ID, AU.FULL_NAME, AU.PICTURE, 'Enviada' AS APP_FRIEND_STATUS
            FROM APP_FRIEND AF
            JOIN APP_USER AU ON AF.APPLICANT_USER_ID = AU.ID_USER
            WHERE AF.REQUIRED_USER_ID = ? AND AF.APP_FRIEND_STATUS = 'Enviada'
            
            UNION
            
            -- Obtener REQUIRED_USER_ID cuando APPLICANT_USER_ID = ID_USER y APP_FRIEND_STATUS = "Esperando"
            SELECT AF.REQUIRED_USER_ID AS OTHER_ID, AU.FULL_NAME, AU.PICTURE, 'Esperando' AS APP_FRIEND_STATUS
            FROM APP_FRIEND AF
            JOIN APP_USER AU ON AF.REQUIRED_USER_ID = AU.ID_USER
            WHERE AF.APPLICANT_USER_ID = ? AND AF.APP_FRIEND_STATUS = 'Esperando'
            
            UNION
            
            -- Obtener usuarios que no tienen una combinación con ID ID_USER y cualquier otra
            SELECT ID_USER AS OTHER_ID, FULL_NAME, PICTURE, 'Enviar' AS APP_FRIEND_STATUS
            FROM APP_USER
            WHERE ID_USER <> ? AND ID_USER NOT IN (
                SELECT DISTINCT CASE
                    WHEN APPLICANT_USER_ID = ? THEN REQUIRED_USER_ID
                    WHEN REQUIRED_USER_ID = ? THEN APPLICANT_USER_ID
                END
                FROM APP_FRIEND
                WHERE APPLICANT_USER_ID = ? OR REQUIRED_USER_ID = ?
            );
        `;
        conn.query(query, [ID_USER,ID_USER,ID_USER,ID_USER,ID_USER,ID_USER,ID_USER], async (err, result) => {
            if (err) {
                console.error('Error al optener a los amigos:', err);
                res.json({ success: false, result: "Error al optener a los amigos" });
            } else {
                res.json({ success: true, result: "Amigos optenidos exitosamente", friends: result });
            }
        });

    } catch (error) {
        console.error('Error al comparar imágenes:', error);
        res.json({ success: false, result: "Error al comparar imagenes" });
    }
});

module.exports = router;