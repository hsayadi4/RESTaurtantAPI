const express = require('express');
const mysql = require('mysql');
const app = express();
const expressPort = 3000;

app.use(express.json());

const dataBase = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'root',
    database: 'restapi',  
});

dataBase.connect((err) => {
    if (err) {
        console.log('ERREUR DE CONNEXION À LA BASE DE DONNÉES !', err);
    } else {
        console.log('BRAVO, VOUS ÊTES CONNECTÉ À LA BASE DE DONNÉES !');
    }
});

app.listen(expressPort, () => {
    console.log('MON SERVEUR TOURNE SUR LE PORT :', expressPort);
});

app.get('/items', (req, res) => {
    const sql = 'SELECT * FROM items;';

    dataBase.query(sql, (err, results) => {  
        if (err) {
            return res.status(500).json({ error: 'ERREUR DU SERVEUR', details: err });
        } else {
            return res.status(200).json(results);
        }
    });
});

app.post('/items2', (req, res) => {
    const { name, price, id_category, description } = req.body;
    const sql = 'INSERT INTO items (name, price, id_category, description) VALUES (?, ?, ?, ?)';
    
    dataBase.query(sql, [name, price, id_category, description], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'ERREUR DU SERVEUR', details: err });
        } else {
            return res.status(201).json({ message: 'Item ajouté avec succès!', id: result.insertId });
        }
    });
});




app.put('/update/:id', (req, res) => {
    const { id } = req.params;
    const { name, price, id_category, description } = req.body;
    const sql = 'UPDATE items SET name = ?, price = ?, id_category = ?, description = ? WHERE id = ?';

    dataBase.query(sql, [name, price, id_category, description, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'ERREUR DU SERVEUR', details: err });
        } else if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Aucun item trouvé avec cet ID.' });
        } else {
            return res.status(200).json({ message: 'Item mis à jour avec succès!' });
        }
    });
});

app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM items WHERE id = ?';

    dataBase.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'ERREUR DU SERVEUR', details: err });
        } else if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Aucun item trouvé avec cet ID.' });
        } else {
            return res.status(200).json({ message: 'Item supprimé avec succès!' });
        }
    });
})