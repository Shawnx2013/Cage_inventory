const pool = require('../db/database');

const userService = {
    create: async (user) => {
        let sql = 'INSERT INTO user (username, type, password, role_id) VALUES (?, ?, ?, ?)';
        const [results, fields] = await pool.promise().execute(sql,
            [
                user.username,
                user.type,
                user.password,
                user.role_id
            ]
        );
        return results.insertId;
    },


    findById: async (id) => {
        let sql = 'SELECT * FROM user WHERE id = ?';
        const [results, fields] = await pool.promise().execute(sql, [id]);
        return results;
    },

    findByUsername: async (username) => {
        let sql = 'SELECT * FROM user WHERE username = ?';
        const [result, field] = await pool.promise().execute(sql,
            [
                username
            ]
        );
        return result;
    },

    findAll: async()  =>{
        let sql = 'SELECT * FROM user';
        const [results, fields] = await pool.promise().execute(sql);
        return results;
    }
}

module.exports = userService;