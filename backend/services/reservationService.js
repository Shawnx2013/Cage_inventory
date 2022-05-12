const pool = require('../db/database');

const reservationService = {
    create: async (reservation) => {
        let conn;
        try{
            conn = await pool.promise().getConnection();
            await conn.beginTransaction();
            const [results, fields] = await conn.query('INSERT INTO reservation (user_id, loan_start, loan_end) VALUES (?, ?, ?)',[
                reservation.user_id,
                reservation.loan_start,
                reservation.loan_end
            ])
            const reservationId = results.insertId;
            await conn.query('INSERT INTO reservation_item (item_id, reservation_id) VALUES ?', [
                reservation.items.map((item) => [item, reservationId])
            ])
            await conn.commit();
            return results;
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    createKitReservation: async (reservation) => {
        let conn;
        try{
            conn = await pool.promise().getConnection();
            await connection.beginTransaction();
            const [results, fields] = await conn.query('INSERT INTO reservation (user_id, loan_start, loan_end) VALUES (?, ?, ?)',[
                reservation.user_id,
                reservation.loan_start,
                reservation.loan_end
            ])
            const reservationId = results.insertId;
            await conn.query('INSERT INTO reservation_kit (kit_id, reservation_id) VALUES ?', [
                reservation.kit.map((kit) => [kit, reservationId])
            ])
            await connection.commit();
            return results;
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    updateKitReservation: async (reservation) => {
        let conn;
        try{
            conn = await pool.promise().getConnection();
            await connection.beginTransaction();
            const [results, fields] = await conn.query('UPDATE reservation SET user_id = ?, loan_start = ?, loan_end = ? WHERE id = ?',[
                reservation.user_id,
                reservation.loan_start,
                reservation.loan_end,
                reservation.id
            ]);
            await conn.query('DELETE FROM reservation_kit WHERE reservation_id = ? ', [
                reservation.id
            ]);
            await conn.query('INSERT INTO reservation_kit (kit_id, reservation_id) VALUES ?', [
                reservation.kit.map((kit) => [kit, reservationId])
            ]);
            await connection.commit();
            return results;
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    checkoutKitReservation: async (reservation) => {
        let conn;
        try{
            let id = reservation.id;
            conn = await pool.promise().getConnection();
            await connection.beginTransaction();
            const [results, fields] = await conn.query('INSERT INTO checkout (user_id, checkout_date, reservation_id) VALUES (? ,?, ?)', [
                reservation.user_id,
                reservation.checkout_date,
                reservation.reservation_id
            ])
            const insertId = results.insertId;
            await conn.query('INSERT INTO checkout_kit (kit_id, checkout_id) VALUES ?', [
                reservation.kits.map((kit) => [kit, insertId])
            ])
            await connection.commit();
            return res;
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    findById: async (id) => {
        let sql = 'SELECT * FROM reservation WHERE reservation.id = ?';
        const [results, fields] = await pool.promise().execute(sql, [id]);
        return results;
    },

    findItemReservedById: async (id) => {
        let sql = 'SELECT item_id from reservation_item WHERE reservation_id = ?';
        const [results, fields] = await pool.promise().execute(sql, [id]);
        return results;
    },

    findKitReservedById: async (id) => {
        let sql = 'SELECT kit_id from reservation_kit WHERE reservation_id = ?';
        const [results, fields] = await pool.promise().execute(sql, [id]);
        return results;
    },

    findAllByUserId: async (id) => {
        let sql = 'SELECT * FROM reservation WHERE user_id = ?';
        const [results, fields] = await pool.promise().execute(sql, [id]);
        return results;
    },

    findByItemId: async (id) => {
        let sql = 'SELECT reservation_id FROM reservation_item WHERE item_id = ?';
        const [results, fields] = await pool.promise().execute(sql, [id]);
        return results;
    },

    findByKitId: async (id) => {
        let sql = 'SELECT reservation_id FROM reservation_kit WHERE kit_id = ?';
        const [results, fields] = await pool.promise().execute(sql, [id]);
        return results;
    },

    findAll: async () => {
        let sql = 'SELECT * FROM reservation';
        const [results, fields] = await pool.promise().execute(sql);
        return results;
    },

    update: async (reservation) => {
        let conn;
        try{
            conn = await pool.promise().getConnection();
            await connection.beginTransaction();
            const [results, fields] = await conn.query('UPDATE reservation SET user_id = ?, loan_start = ?, loan_end = ? WHERE id = ?',[
                reservation.user_id,
                reservation.loan_start,
                reservation.loan_end,
                reservation.id
            ]);
            await conn.query('DELETE FROM reservation_item WHERE reservation_id = ? ', [
                reservation.id
            ]);
            await conn.query('INSERT INTO reservation_item (item_id, reservation_id) VALUES ?', [
                reservation.items.map((item) => [item, reservation.id])
            ]);
            await conn.commit();
            return results;
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    findCheckoutByReservationId: async (id) => {
        let sql = 'SELECT * FROM checkout WHERE reservation_id = ?';
        const [results, fields] = await pool.promise().execute(sql, [id]);
        return results;
    },

    checkoutItemReservation: async (checkout) => {
        let conn;
        try{
            conn = await pool.promise().getConnection();
            await conn.beginTransaction();
            const [results, fields] = await conn.query('INSERT INTO checkout (user_id, checkout_date, reservation_id) VALUES (? ,?, ?)', [
                checkout.user_id,
                checkout.checkout_date,
                checkout.reservation_id
            ])
            const insertId = results.insertId;
            await conn.query('INSERT INTO checkout_item (item_id, checkout_id) VALUES ?', [
                checkout.items.map((item) => [item, insertId])
            ])
            await conn.commit();
            return results;
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    deleteItemReservation: async (id) => {
        let conn;
        try{
            conn = await pool.promise().getConnection();
            await conn.beginTransaction();
            const [res, flds] = await conn.query('SELECT reservation_id FROM checkout WHERE id = ?', [id]);
            const reservation_id = res[0].reservation_id;
            await conn.query('DELETE FROM checkout_item WHERE checkout_id = ? ', [
                id
            ]);
            await conn.query('DELETE FROM checkout WHERE id = ?',[
                id
            ]);
            await conn.query('DELETE FROM reservation_item WHERE reservation_id = ? ', [
                reservation_id
            ]);
            const [results, fields] = await conn.query('DELETE FROM reservation WHERE id = ?',[
                reservation_id
            ]);
            await conn.commit();
            return results;
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    deleteKitReservation: async (id) => {
        let conn;
        try{
            conn = await pool.promise().getConnection();
            await conn.beginTransaction();
            await conn.query('DELETE FROM reservation_kit WHERE reservation_id = ? ', [
                id
            ]);
            const [results, fields] = await conn.query('DELETE FROM reservation WHERE id = ?',[
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
    },

    deleteReservationById: async (id) => {
        let connection;
        try{
            connection = await pool.promise().getConnection();
            await connection.beginTransaction();
            await connection.query('DELETE FROM reservation_item WHERE reservation_id = ? ', [
                id
            ]);
            const [results, fields] = await connection.query('DELETE FROM reservation WHERE id = ?',[
                id
            ]);
            await connection.commit();
            return results;
        } catch (error) {
            connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    
}

module.exports = reservationService;