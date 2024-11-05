import db from '../conf/db.js';

/* CRUD - HOUSES CONTROLLER */
const addHouse = (req, res) => {
    const { address, city, state, price } = req.body;
    const query = `INSERT INTO houses (uuid, address, city, state, price) VALUES (uuid(), ?, ?, ?, ?)`;

    db.query(query, [address, city, state, price], (err, result) => {
        if (err) return res.status(500).json({ error: 'Erro ao adicionar a casa' });
        res.json(result);
    });
};

const getHouse = (req, res) => {
    const id = req.params.id;
    const query = `SELECT * FROM houses WHERE uuid = ?`;

    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Erro ao obter a casa' });
        res.json(result);
    });
};

const getClients = (req, res) => {

    // Get all clients
    let query = 'SELECT * FROM clients';

    if (req.query.search) {
        const search = req.query.search;
        query += ` WHERE address LIKE '%${search}%' OR city LIKE '%${search}%' OR state LIKE '%${search}%' OR price LIKE '%${search}%'`
    }

    if (req.query.sortKey && req.query.sortOrder) {
        const orderKey = req.query.sortKey;
        const orderValue = req.query.sortOrder;
        query += ' ORDER BY ' + orderKey + ' ' + orderValue
    } else {
        query += ' ORDER BY name asc'
    }
    const page = req.query.page;
    const limit = req.query.limit;
    const offset = (page - 1) * limit;
    query += ' LIMIT ' + limit + ' OFFSET ' + offset

    db.query(query, (err, result) => {
        if (err) res.status(500);
        db.query('SELECT COUNT(*) AS total FROM house', (err, count) => {
            if (err) res.status(500);
            res.json({ data: result, total: count[0].total });
        });
    });
}

const updateHouse = (req, res) => {
    const id = req.params.id;
    const { address, city, state, price } = req.body;
    const query = `UPDATE houses SET address = ?, city = ?, state = ?, price = ? WHERE uuid = ?`;

    db.query(query, [address, city, state, price, id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Erro ao atualizar a casa' });
        res.json(result);
    });
};

const deleteHouse = (req, res) => {
    const id = req.params.id;
    const query = `DELETE FROM houses WHERE uuid = ?`;

    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Erro ao deletar a casa' });
        res.json(result);
    });
};

export default { addHouse, getHouse, getHouses, updateHouse, deleteHouse };
