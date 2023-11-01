const express = require('express');
const router = express.Router();
const bucket = require('./bucket_controller');
const cognito = require('./cognito_controller');
const rekognition = require('./rekognition_controller');
const util = require('./util');
const conn = require('./conexion');
const axios = require('axios');
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

/** Actualizacion de un usuario */
router.put('/update/:id_user', bucket.upload.single('PICTURE'), async (req, res) => {
    try {

        // Se obtienen los parametros necesarios
        const id_user = req.params.id_user;
        const { FULL_NAME, DPI, APP_PASSWORD } = req.body;

        // Error: No ha ajuntado la foto
        if (req.file === undefined || req.file == null) {
            res.json({ success: false, result: "Es necesario adjuntar una foto para actualizar el perfil." });
            return;
        } else if (APP_PASSWORD === undefined) {
            res.json({ success: false, result: "Se necesita la contraseña para realizar el cambio." });
            return;
        }

        // Proceso de actualizacion
        const query_select = 'SELECT PICTURE, APP_PASSWORD FROM APP_USER WHERE ID_USER = ?';
        conn.query(query_select, [id_user], (err, result) => {
            if (err) {
                console.error('Error al obtener al usuario:', err);
                res.json({ success: false, result: "Ha ocurrido un error al obtener al usuario" });
            } else {

                util.comparePassword(APP_PASSWORD, result[0].APP_PASSWORD)
                    .then(esCorrecta => {
                        if (esCorrecta) {

                            bucket.deleteFiletoS3(result[0].PICTURE, (err, data) => {
                                if (err) {
                                    console.error('Error al eliminar la imagen de S3:', err);
                                    res.json({ success: false, result: "Ha ocurrido un error al eliminar la imagen" });
                                } else {
                                    bucket.uploadFiletoS3(req.file, process.env.AWS_BUCKET_FOLDER_PROFILE, (err, data) => {
                                        if (err) {
                                            console.error('Error al subir el archivo de S3:', err);
                                            res.json({ success: false, result: "Ha ocurrido un error al subir el archivo" });
                                        } else {
                                            const url_imagen = data;
                                            const query = 'UPDATE APP_USER SET FULL_NAME = ?, DPI = ?, PICTURE = ? WHERE ID_USER = ?;';
                                            conn.query(query, [FULL_NAME, DPI, url_imagen, id_user], (err, result) => {
                                                if (err) {
                                                    console.error('Error al actualizar el usuario:', err);
                                                    res.json({ success: false, result: "Ha ocurrido un error al actualizar el usuario" });
                                                } else {
                                                    res.json({ success: true, result: "Usuario actualizado correctamente", PICTURE: url_imagen });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        } else {
                            res.json({ success: false, result: "Contraseña incorrecta" });
                        }
                    })
                    .catch(error => {
                        console.error('Error al comparar contraseñas:', error);
                        res.json({ success: false, result: "Ha ocurrido un error al desencriptar la contraseña" });
                    });
            }
        });

    } catch (error) {
        console.error("Error al actualizar los datos del usuario:", error);
        res.json({ success: false, result: "Ha ocurrido un error al actualizar los datos del usuario" });
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
        conn.query(query, [ID_USER, ID_USER], async (err, result) => {
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
            SELECT AF.APPLICANT_USER_ID AS OTHER_ID, AU.FULL_NAME, AU.PICTURE, 'Esperando' AS APP_FRIEND_STATUS
            FROM APP_FRIEND AF
            JOIN APP_USER AU ON AF.APPLICANT_USER_ID = AU.ID_USER
            WHERE AF.REQUIRED_USER_ID = ? AND AF.APP_FRIEND_STATUS = 'Enviada'

            UNION

            -- Obtener REQUIRED_USER_ID cuando APPLICANT_USER_ID = ID_USER y APP_FRIEND_STATUS = "Esperando"
            SELECT AF.REQUIRED_USER_ID AS OTHER_ID, AU.FULL_NAME, AU.PICTURE, 'Enviada' AS APP_FRIEND_STATUS
            FROM APP_FRIEND AF
            JOIN APP_USER AU ON AF.REQUIRED_USER_ID = AU.ID_USER
            WHERE AF.APPLICANT_USER_ID = ? AND AF.APP_FRIEND_STATUS = 'Enviada'

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
        conn.query(query, [ID_USER, ID_USER, ID_USER, ID_USER, ID_USER, ID_USER, ID_USER], async (err, result) => {
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

router.post('/friendrequest', async (req, res) => {
    const APPLICANT_USER_ID = req.body.APPLICANT_USER_ID;
    const REQUIRED_USER_ID = req.body.REQUIRED_USER_ID;
    try {
        const query = "INSERT INTO APP_FRIEND (APPLICANT_USER_ID, REQUIRED_USER_ID, APP_FRIEND_STATUS) VALUES (?, ?, 'Enviada');";
        conn.query(query, [APPLICANT_USER_ID, REQUIRED_USER_ID], async (err, result) => {
            if (err) {
                console.error('Error al enviar solicitud de amistad:', err);
                res.json({ success: false, result: "Error al enviar la solicitud de amistad" });
            } else {
                res.json({ success: true, result: "Solicitud enviada" });
            }
        });
    } catch (error) {
        console.error('Error al enviar la solicitud de amistad":', error);
        res.json({ success: false, result: "Error al enviar la solicitud de amistad" });
    }
});

router.put('/friendrequestaccept', async (req, res) => {
    const APPLICANT_USER_ID = req.body.APPLICANT_USER_ID;
    const REQUIRED_USER_ID = req.body.REQUIRED_USER_ID;
    try {
        const query = "UPDATE APP_FRIEND SET APP_FRIEND_STATUS = 'Aceptada' WHERE APPLICANT_USER_ID = ? AND REQUIRED_USER_ID = ?;";
        conn.query(query, [APPLICANT_USER_ID, REQUIRED_USER_ID], async (err, result) => {
            if (err) {
                console.error('Error al aceptar solicitud de amistad:', err);
                res.json({ success: false, result: "Error al aceptar la solicitud de amistad" });
            } else {
                res.json({ success: true, result: "Solicitud aceptada" });
            }
        });
    } catch (error) {
        console.error('Error al aceptar la solicitud de amistad":', error);
        res.json({ success: false, result: "Error al aceptar la solicitud de amistad" });
    }
});

router.put('/friendrequestreject', async (req, res) => {
    const APPLICANT_USER_ID = req.body.APPLICANT_USER_ID;
    const REQUIRED_USER_ID = req.body.REQUIRED_USER_ID;
    try {
        const query = "DELETE FROM APP_FRIEND WHERE APPLICANT_USER_ID = ? AND REQUIRED_USER_ID = ?;";
        console.log(query, APPLICANT_USER_ID, REQUIRED_USER_ID)
        conn.query(query, [APPLICANT_USER_ID, REQUIRED_USER_ID], async (err, result) => {
            if (err) {
                console.error('Error al rechazar solicitud de amistad:', err);
                res.json({ success: false, result: "Error al rechazar la solicitud de amistad" });
            } else {
                res.json({ success: true, result: "Solicitud rechazada" });
            }
        });
    } catch (error) {
        console.error('Error al rechazar la solicitud de amistad":', error);
        res.json({ success: false, result: "Error al rechazar la solicitud de amistad" });
    }
});

router.get('/chat', async (req, res) => {

    // Se obtienen los parametros necesarios
    const ID_USER = req.query.ID_USER;
    const ID_FRIEND = req.query.ID_FRIEND;

    try {
        const query = `
        SELECT
        CONTENT,
        APP_MESSAGE_DATE,
        CASE
            WHEN TRANSMITER = ? AND RECEIVER = ? THEN true
            WHEN TRANSMITER = ? AND RECEIVER = ? THEN false
        END AS isMine
        FROM APP_MESSAGE
        WHERE (TRANSMITER = ? AND RECEIVER = ?) OR (TRANSMITER = ? AND RECEIVER = ?)
        ORDER BY APP_MESSAGE_DATE;
        `;
        conn.query(query, [ID_USER, ID_FRIEND, ID_FRIEND, ID_USER, ID_USER, ID_FRIEND, ID_FRIEND, ID_USER], async (err, result) => {
            if (err) {
                console.error('Error al obtener los mensajes:', err);
                res.json({ success: false, result: "Error al obtener los mensajes" });
            } else {
                res.json({ success: true, result: "Mensajes obtenidos exitosamente", messages: result });
            }
        });

    } catch (error) {
        console.error('Error al obtener los mensajes:', error);
        res.json({ success: false, result: "Error al obtener los mensajes" });
    }
});

router.post('/mensajes', async (req, res) => {
    const ID_USER = req.body.ID_USER;
    const ID_FRIEND = req.body.ID_FRIEND;
    const CONTENT = req.body.CONTENT;
    try {
        const query = "INSERT INTO APP_MESSAGE (TRANSMITER, RECEIVER, CONTENT, APP_MESSAGE_DATE) VALUES (?, ?, ?, NOW());";
        conn.query(query, [ID_USER, ID_FRIEND, CONTENT], async (err, result) => {
            if (err) {
                console.error('Error al enviar mensaje:', err);
                res.json({ success: false, result: "Error al enviar mensaje" });
            } else {
                res.json({ success: true, result: "Mensaje enviado" });
            }
        });
    } catch (error) {
        console.error('Error al enviar mensaje:', error);
        res.json({ success: false, result: "Error al enviar mensaje" });
    }
});

router.post('/translate', async (req, res) => {
    console.log('Traduciendo mensaje:', req.body);
    try {
        const message = req.body.message;

        if (!message) {
            return res.status(400).send({ error: 'Se requiere el parámetro "message"' });
        }

        const response = await axios.post('https://dbnnpjlwse.execute-api.us-east-1.amazonaws.com/dev/traducir', {
            body: message
        });

        if (response.data.statusCode !== 200) {
            throw new Error('Error en el servicio de traducción');
        }

        const translatedMessage = JSON.parse(response.data.body);
        res.json(translatedMessage);

    } catch (error) {
        console.error('Error al traducir mensaje:', error);
        res.status(500).send({ error: error.message });
    }
});


module.exports = router;