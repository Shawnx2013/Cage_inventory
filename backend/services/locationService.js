const pool = require('../db/database');

const locationService = {
    create: async (location) => {
        let sql = 'INSERT INTO location (location) VALUES (?)';
        const [results, fields] = await pool.promise().execute(sql, 
            [
                location.location
            ]
        );
        return results.insertId;
    },

    findById: async (id) => {
        let sql = 'SELECT * FROM location WHERE id = ?';
        const [results, fields] = await pool.promise().execute(sql, [id]);
        return results;
    },

    findAll: async () => {
        let sql = 'SELECT * FROM location';
        const [results, fields] = await pool.promise().execute(sql);
        return results;
    },

    update: async (location) => {
        let sql = 'UPDATE location set location = ? WHERE id = ?';
        const [results, fields] = await pool.promise().execute(sql,
            [
                location.location,
                location.id
            ]    
        );
        return results;
    },

    delete: async (id) => {
        let sql = "DELETE FROM location WHERE id = ?";
        const [results, fields] = await pool.promise().execute(sql, [id]);
        return results;
    }
}

module.exports = locationService;