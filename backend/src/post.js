const express = require('express');
const router = express.Router();
const bucket = require('./bucket_controller');
const conn = require('./conexion');

router.post('', bucket.upload.single('APP_POST_IMAGE'), async (req, res) => {
    try {
        // Se obtiene los parametros que posee esta entidad
        const { APP_USER_ID, APP_POST_DESCRIPTION } = req.body;

        // Subida de la foto
        bucket.uploadFiletoS3(req.file, process.env.AWS_BUCKET_FOLDER_PROFILE, (err, data) => {
            if (err) {
                console.error('Error al subir el archivo de S3:', err);
                res.json({ success: false, result: "Ha ocurrido un error al subir el archivo" });
            } else {
                const url_archivo = data;
                const fechaHoraActual = new Date();
                const query = 'INSERT INTO APP_POST (APP_USER_ID, APP_POST_IMAGE, APP_POST_DESCRIPTION, APP_POST_DATE) VALUES (?, ?, ?, ?)';
                conn.query(query, [APP_USER_ID, url_archivo, APP_POST_DESCRIPTION, fechaHoraActual], (err, result) => {
                    if (err) {
                        console.error('Error al crear un nuevo post:', err);
                        res.json({ success: false, result: "Ha ocurrido un error al crear un nuevo post" });
                    } else {
                        res.json({ success: true, result: "Nuevo post creado correctamente" });
                    }
                });
            }
        });
    } catch (error) {
        console.error("Error al crear un nuevo post:", error);
        res.json({ success: false, result: "Ha ocurrido un error al crear un nuevo post" });
    }
});

module.exports = router;