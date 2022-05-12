const pool = require('../db/database');

const roleService = {
    create: async (role) => {
        let sql = 'INSERT INTO role (role_name) VALUES(?)';
        const [results, fields] = await pool.promise().execute(sql,
            [
                role.role_name
            ]
        );
        return results.insertId;
    },

    findById: async (id) => {
        let sql = 'SELECT * FROM role WHERE id = ?';
        const [results, fields] = await pool.promise().execute(sql, [id]);
        return results;
    },

    findAll: async () => {
        let sql = 'SELECT * FROM role';
        const [results, fields] = await pool.promise().execute(sql);
        return results;
    }
}

module.exports = roleService;