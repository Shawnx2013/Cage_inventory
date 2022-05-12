const pool = require('../db/database');

const itemService = {
    create: async (item) => {
        let conn;
        try{
            conn = await pool.promise().getConnection();
            await conn.beginTransaction();
            let sql = 'INSERT INTO item (name, type, description, version, long_term_loanable, location_id) VALUES (?, ?, ?, ?, ?, ?)';
            const [results, fields] = await conn.query(sql, 
                [
                    item.name,
                    item.type,
                    item.description,
                    item.version,
                    item.long_term_loanable,
                    item.location_id,
                ]
            );
            const itemId = results.insertId;
            await conn.query('INSERT INTO item_tag (item_id, tag_id) VALUES ?',
                [
                    item.tags.map((tag) => [itemId, tag])
                ]
            )
            await conn.commit();
            return results;
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    findById: async (id) => {
        let sql = 'SELECT * FROM item WHERE id = ?';
        const [results, fields] = await pool.promise().execute(sql, [id]);
        return results;
    },

    findTagsById: async (id) => {
        let sql = 'SELECT * FROM item_tag WHERE item_id = ?';
        const [results, fields] = await pool.promise().execute(sql, [id]);
        return results;
    },

    findAll: async () => {
        let sql = 'SELECT * FROM item';
        const [results, fields] = await pool.promise().execute(sql);
        return results;
    },

    search: async (search_str) => {
        let sql = 'SELECT item.id, item.name, item.type, item.description, item.version, item.long_term_loanable, item.location_id ' +
        'FROM ' + 
        'item LEFT JOIN item_tag ON item.id = item_tag.item_id ' +
        'LEFT JOIN tag ON item_tag.tag_id = tag.id ' +
        'WHERE CONCAT(name, type, description, tag_name) LIKE ? ' +
        'GROUP BY item.id';
        const [results, fields] = await pool.promise().execute(sql, ['%'+search_str+'%']);
        return results;
    },

    update: async (item) => {
        let conn;
        try{
            conn = await pool.promise().getConnection();
            await conn.beginTransaction();
            let sql = 'UPDATE item SET name = ?, type = ?, description = ?, version = ?, long_term_loanable = ?, location_id = ? WHERE id = ?';
            const [results, fields] = await conn.query(sql, 
                [
                    item.name,
                    item.type,
                    item.description,
                    item.version,
                    item.long_term_loanable,
                    item.location_id,
                    item.id
                ]
            );
            await conn.query('DELETE FROM item_tag WHERE item_id = ? ', [
                item.id
            ]);
            await conn.query('INSERT INTO item_tag (item_id, tag_id) VALUES ?',
                [
                    item.tags.map((tag) => [item.id, tag])
                ]
            );
            await conn.commit();
            return results;
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    delete: async (id) => {
        let conn;
        try{
            conn = await pool.promise().getConnection();
            await conn.beginTransaction();
            await conn.promise().query('DELETE FROM item_tag WHERE item_id = ? ', [
                id
            ]);
            const [results, fields] = await conn.promise().query('DELETE FROM item WHERE id = ?',[
                id
            ]);
            await conn.commit();
            return results;
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    }
}

module.exports = itemService;