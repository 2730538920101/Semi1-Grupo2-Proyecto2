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

// Obtener todos los post con sus respectivos comentarios
router.get('/:id_usuario', (req, res) => {

    const id_usuario = req.params.id_usuario;
    const query = `SELECT 
    ap.APP_POST_ID AS ID_POST, 
    ap.APP_POST_IMAGE AS IMAGE_POST, 
    ap.APP_POST_DESCRIPTION, 
    DATE_FORMAT(ap.APP_POST_DATE, '%d:%m:%Y %H:%i') AS APP_POST_DATE,
    au.ID_USER AS ID_USER_POST, 
    au.FULL_NAME AS FULL_NAME_USER_POST, 
    au.PICTURE AS IMAGE_USER_POST,
    JSON_ARRAYAGG(JSON_OBJECT(
        'APP_COMENT_ID', ac.APP_COMENT_ID,
        'COMENT', ac.COMENT,
        'APP_COMENT_DATE', DATE_FORMAT(ac.APP_COMENT_DATE, '%d:%m:%Y %H:%i'),
        'ID_USER_COMENT', au2.ID_USER,
        'FULL_NAME_USER_COMENT', au2.FULL_NAME,
        'IMAGE_USER_COMENT', au2.PICTURE
    )) AS COMENTS
FROM APP_POST ap
INNER JOIN APP_USER au ON au.ID_USER = ap.APP_USER_ID
LEFT JOIN APP_COMENT ac ON ac.APP_POSTED_ID = ap.APP_POST_ID
LEFT JOIN APP_USER au2 ON au2.ID_USER = ac.APP_SENDER_ID
WHERE (ap.APP_USER_ID IN (?, (SELECT af.REQUIRED_USER_ID FROM APP_FRIEND af WHERE af.APPLICANT_USER_ID = ? AND af.APP_FRIEND_STATUS = "Aceptada")))
    OR (ap.APP_USER_ID IN (SELECT af.APPLICANT_USER_ID FROM APP_FRIEND af WHERE af.REQUIRED_USER_ID = ? AND af.APP_FRIEND_STATUS = "Aceptada"))
GROUP BY ID_POST
ORDER BY ap.APP_POST_DATE DESC;
;
`;
    conn.query(query, [id_usuario, id_usuario, id_usuario], (err, result) => {
        if (err) {
            console.error('Error al obtener los post:', err);
            res.json({ success: false, result: "Ha ocurrido un error al obtener los post" });
        } else {
            res.json({ success: true, result: result });
        }
    });
});

module.exports = router;