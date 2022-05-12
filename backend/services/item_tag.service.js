const pool = require('../db/database');

const itemTagService = {
    create: async (item_tag) => {
        let sql = 'INSERT INTO tag (tag_name) VALUES (?)';
        const [results, fields] = await pool.promise().execute(sql, 
            [
                item_tag.tag_name
            ]
        );
        return results.insertId;
    },

    findById: async (id) => {
        let sql = 'SELECT * FROM tag WHERE id = ?';
        const [results, fields] = await pool.promise().execute(sql, [id]);
        return results;
    },

    findAll: async () => {
        let sql = 'SELECT * FROM tag';
        const [results, fields] = await pool.promise().execute(sql);
        return results;
    },

    // search: async (search_str) => {
    //     let sql = 'SELECT * FROM item_tag WHERE CONCAT(tag_name) LIKE ?';
    //     const [results, fields] = await pool.promise().execute(sql, ['%'+search_str+'%']);
    //     return results;
    // },

    update: async (item_tag) => {
        let sql = 'UPDATE tag SET id = ?, tag_name = ? WHERE id = ?';
        const [results, fields] = await pool.promise().execute(sql,
            [
                item_tag.id,
                item_tag.tag_name
            ]
        );
        return results;
    },

    //Delete
    delete: async (id) => {
        let sql = 'DELETE FROM tag WHERE id = ?';
        const [results, fields] = await pool.promise().execute(sql, [id]);
        return results;
    }
}

module.exports = itemTagService;