const pool = require('../db/database');

//Insert
const kitService = {
    create: async (kit) => {
        let conn;
        try{
            conn = await pool.promise().getConnection();
            await conn.beginTransaction();
            let sql = 'INSERT INTO kit (name, creator_id, description, count, long_term_loanable, location) VALUES (?, ?, ?, ?, ?, ?)';
            const [results, fields] = await conn.query(sql, 
                [
                    kit.name,
                    kit.creator_id,
                    kit.description,
                    kit.count,
                    kit.long_term_loanable,
                    kit.location
                ]
            );
            const kitId = results.insertId;
            await conn.query('INSERT INTO item_kit (item_id, kit_id) VALUES ?',
                [
                    kit.items.map((item) => [item, kitId])
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
        let sql = 'SELECT * FROM kit WHERE id = ?';
        const [results, fields] = await pool.promise().execute(sql, [id]);
        return results;
    },

    findItemsById: async (id) => {
        let sql = 'SELECT * FROM item_kit WHERE id = ?';
        const [results, fields] = await pool.promise().execute(sql, [id]);
        return results;
    },

    findAll: async () => {
        let sql = 'SELECT * FROM kit';
        const [results, fields] = await pool.promise().execute(sql);
        return results;
    },

    search: async (search_str) => {
        let sql = 'SELECT kit.id, kit.name, kit.creator_id, kit.description, kit.count, kit.long_term_loanable, kit.location ' +
        'FROM ' +
        'kit JOIN item_kit ON kit.id = item_kit.kit_id ' +
        'LEFT JOIN item ON item_kit.item_id = item.id ' +
        'WHERE CONCAT(kit.name, item.name, kit.description) LIKE ? ' +
        'GROUP BY kit.id';
        const [results, fields] = await pool.promise().execute(sql, ['%'+search_str+'%']);
        return results;
    },

    update: async (kit) => {
        let conn;
        try{
            conn = await pool.promise().getConnection();
            await conn.beginTransaction();
            let sql = 'UPDATE kit SET name = ?, creator_id = ?, description = ?, count = ?, long_term_loanable = ?, location = ? WHERE id = ?';
            const [results, fields] = await conn.query(sql, 
                [
                    kit.name,
                    kit.creator_id,
                    kit.description,
                    kit.count,
                    kit.long_term_loanable,
                    kit.location,
                    kit.id
                ]
            );
            await conn.query('DELETE FROM item_kit WHERE kit_id = ? ', [
                kit.id
            ]);
            await conn.query('INSERT INTO item_kit (item_id, kit_id) VALUES ?',
                [
                    kit.items.map((item_id) => [item_id, kit.id])
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

    delete: async (id) => {
        let conn;
        try{
            conn = await pool.promise().getConnection();
            await conn.beginTransaction();
            await conn.query('DELETE FROM item_kit WHERE kit_id = ? ', [
                id
            ]);
            const [results, fields] = await conn.query('DELETE FROM kit WHERE id = ?',[
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

module.exports = kitService;