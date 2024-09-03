const mysql = require('mysql2/promise');
const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());
port = 3000;


//express code
app.get('/api/artist/:artist_id/:album_id', async (req, res) => {
    try {
        const songs = await getSongs(req.params.album_id);
        const album = await getAlbum(req.params.artist_id, req.params.album_id);

        res.json({ songs, album });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



//sql code
let connection;

(async () => {
    try {
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: process.env.DB_PASS,
            database: 'artists',
        });

        console.log('Database connected successfully');

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (err) {
        console.error('Error connecting to the database:', err);
    }
})();

async function getSongs(album_id) {
    try {
        const [results] = await connection.query(`
            SELECT song.id, song.name, song.path
            FROM song
            INNER JOIN album ON song.album_id = album.id 
            WHERE album.id = ?
            ORDER BY song.id ASC;
            `, [album_id]
        ); 
        console.log('Query Results:', results);
        return results;
    } catch (err) {
        console.log(err);
    }
}

async function getAlbum(artist_id, album_id) {
    try {
        const [results] = await connection.query(`
            SELECT artist.name, album.name, album.year, album.album_cover
            FROM album
            INNER JOIN artist ON artist.id = album.artist_id
            WHERE album.id = ? AND artist.id = ?;
            `, [album_id, artist_id]
        );
    
        return results;
    } catch (err) {
        console.log(err);
    }
}



