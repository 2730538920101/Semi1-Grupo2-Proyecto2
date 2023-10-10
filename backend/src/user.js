const express = require('express');
const router = express.Router();
const aws = require('./controller_aws');
const util = require('./util');
const conn = require('./conexion');

/** Creacion de un usuario */
router.post('/register', aws.upload.single('PICTURE'), async (req, res) => {
    try {
        // Se obtiene los parametros que posee esta entidad
        const parametro = req.body;

        // Encriptacion de la contrasenia
        const hashedPassword = await util.hashPassword(parametro.APP_PASSWORD);

        // Subida de la foto
        aws.uploadFiletoS3(req.file, process.env.AWS_BUCKET_FOLDER_PROFILE, (err, data) => {
            if (err) {
                console.error('Error al subir el archivo de S3:', err);
                res.json({ success: false, result: "Ha ocurrido un error al subir el archivo" });
            } else {
                const url_archivo = data;
                const query = 'INSERT INTO APP_USER (FULL_NAME, EMAIL, DPI, APP_PASSWORD, PICTURE, USER_STATUS) VALUES (?, ?, ?, ?, ?, ?)';
                conn.query(query, [parametro.FULL_NAME, parametro.EMAIL, parametro.DPI, hashedPassword, url_archivo, "ACTIVO"], (err, result) => {
                    if (err) {
                        console.error('Error al insertar el usuario:', err);
                        res.json({ success: false, result: "Ha ocurrido un error al insertar el usuario" });
                    } else {
                        res.json({ success: true, result: "Usuario creado correctamente" });
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
router.post('/login', aws.upload.single('PICTURE'), async (req, res) => {

    // Se obtienen los parametros necesarios
    const correo = req.body.EMAIL;
    const contrasenia = req.body.APP_PASSWORD;

    const query = 'SELECT ID_USER, APP_PASSWORD FROM APP_USER WHERE EMAIL = ?';

    // Se ejecuta el query y se realiza la comparacion de contrasenia para verificar que el inicio de sesion sea correcto
    conn.query(query, [correo], async (err, result) => {

        if (err) {
            console.error('Error al obtener usuario:', err);
            res.json({ success: false, mensaje: "Ha ocurrido un error al obtener el usuario" });
        } else {

            if (result.length <= 0) {
                res.json({ success: false, mensaje: "Credenciales incorrectas" });
            } else {
                try {
                    const esCorrecta = await util.comparePassword(contrasenia, result[0].APP_PASSWORD);
                    if (esCorrecta) {
                        res.json({ success: true, mensaje: "Bienvenido" });
                    } else {
                        res.json({ success: false, mensaje: "Credenciales incorrectas" });
                    }
                } catch (error) {
                    console.error('Error al obtener o comparar la contraseña:', error);
                    res.json({ success: false, mensaje: "Ha ocurrido un error al obtener o comparar la contraseña" });
                }
            }
        }
    });

    // try {
    //     conn.query(query, [parametro.FULL_NAME, parametro.EMAIL, parametro.DPI, hashedPassword, url_archivo, "ACTIVO"], (err, result) => {
    //         if (err) {
    //             console.error('Error al insertar el usuario:', err);
    //             res.json({ success: false, result: "Ha ocurrido un error al insertar el usuario" });
    //         } else {
    //             res.json({ success: true, result: "Usuario creado correctamente" });
    //         }
    //     });
    //     // const result = await conn.query(query, [correo]);

    //     // if (result.length <= 0) {
    //     //     res.json({ success: false, mensaje: "Credenciales incorrectas" });
    //     // } else {
    //     //
    //     // }
    // } catch (error) {

    // }
});

module.exports = router;