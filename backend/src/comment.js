const express = require('express');
const router = express.Router();
const conn = require('./conexion');

// Crear un nuevo comentario
router.post('/coments', async (req, res) => {
    try {
        const { APP_POSTED_ID, APP_SENDER_ID, COMENT } = req.body;
        const query = 'INSERT INTO APP_COMENT (APP_POSTED_ID, APP_SENDER_ID, COMENT, APP_COMENT_DATE) VALUES (?, ?, ?, ?)';
        const APP_COMENT_DATE = new Date();

        conn.query(query, [APP_POSTED_ID, APP_SENDER_ID, COMENT, APP_COMENT_DATE], (err, result) => {
            if (err) {
                console.error('Error al crear el comentario:', err);
                res.json({ success: false, result: "Ha ocurrido un error al crear el comentario" });
            } else {
                res.json({ success: true, result: "Comentario creado correctamente" });
            }
        });
    } catch (error) {
        console.error('Error al crear el comentario:', error);
        res.json({ success: false, result: "Ha ocurrido un error al crear el comentario" });
    }
});

// Obtener todos los comentarios segun el ID del POST
router.get('/coments/:id', (req, res) => {
    const commentId = req.params.id;
    const query = 'SELECT * FROM APP_COMENT WHERE APP_POSTED_ID = ?';
    conn.query(query, [commentId], (err, result) => {
        if (err) {
            console.error('Error al obtener los comentarios:', err);
            res.json({ success: false, result: "Ha ocurrido un error al obtener los comentarios" });
        } else {
            res.json({ success: true, comentario: result[0] });
        }
    });
});

// Actualizar un comentario existente
router.put('/coments/:id', async (req, res) => {
    try {
        const commentId = req.params.id;
        const { COMENT, APP_COMENT_DATE } = req.body;
        const query = 'UPDATE APP_COMENT SET COMENT = ?, APP_COMENT_DATE = ? WHERE APP_COMENT_ID = ?';
        conn.query(query, [COMENT, APP_COMENT_DATE, commentId], (err, result) => {
            if (err) {
                console.error('Error al actualizar el comentario:', err);
                res.json({ success: false, result: "Ha ocurrido un error al actualizar el comentario" });
            } else {
                res.json({ success: true, result: "Comentario actualizado correctamente" });
            }
        });
    } catch (error) {
        console.error('Error al actualizar el comentario:', error);
        res.json({ success: false, result: "Ha ocurrido un error al actualizar el comentario" });
    }
});

// Eliminar un comentario
router.delete('/coments/:id', (req, res) => {
    const commentId = req.params.id;
    const query = 'DELETE FROM APP_COMENT WHERE APP_COMENT_ID = ?';
    conn.query(query, [commentId], (err, result) => {
        if (err) {
            console.error('Error al eliminar el comentario:', err);
            res.json({ success: false, result: "Ha ocurrido un error al eliminar el comentario" });
        } else {
            res.json({ success: true, result: "Comentario eliminado correctamente" });
        }
    });
});

module.exports = router;