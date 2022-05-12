const pool = require('../db/database');

const checkoutService = {
    findAll: async () => {
        let sql = 'SELECT * FROM checkout';
        const [results, fields] = await pool.promise().execute(sql);
        return results;
    },

    findById: async (id) => {
        let sql = 'SELECT * FROM checkout WHERE id = ?';
        const [results, fields] = await pool.promise().execute(sql, [id]);
        return results;
    },

    findItemById: async (id) => {
        let sql = 'SELECT * FROM checkout_item WHERE checkout_id = ?';
        const [results, fields] = await pool.promise().execute(sql, [id]);
        return results;
    },

    findKitById: async (id) => {
        let sql = 'SELECT * FROM checkout_kit WHERE checkout_id = ?';
        const [results, fields] = await pool.promise().execute(sql, [id]);
        return results;
    },
}

module.exports = checkoutService;