import db from '../config/db.js';

export const findAll = async (filters = {}) => {
    // filters: { published, page, limit }
    const { published, page = 1, limit = 100 } = filters;
    const offset = (page - 1) * limit;

    let base = 'SELECT * FROM events';
    const where = [];
    const params = [];

    if (published !== undefined && (published === true || published === 'true' || published === '1')) {
        params.push(true);
        where.push(`published = $${params.length}`);
    }

    const whereClause = where.length ? ` WHERE ${where.join(' AND ')}` : '';
    const sql = `${base}${whereClause} ORDER BY starts_at ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const { rows } = await db.query(sql, params);
    return rows;
};

export const findById = async (id) => {
    const { rows } = await db.query('SELECT * FROM events WHERE id = $1', [id]);
    return rows[0];
};

export const create = async ({ title, description, location, starts_at, ends_at, metadata, published = true }) => {
    const { rows } = await db.query(
        'INSERT INTO events (title, description, location, starts_at, ends_at, metadata, published) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [title, description, location, starts_at, ends_at, metadata, published]
    );
    return rows[0];
};

export const update = async (
    id,
    { title, description, location, starts_at, ends_at, metadata, published }
) => {
    // Build dynamic updates to avoid overwriting with undefined
    const fields = [];
    const values = [];
    let idx = 1;

    if (title !== undefined) { fields.push(`title=$${idx++}`); values.push(title); }
    if (description !== undefined) { fields.push(`description=$${idx++}`); values.push(description); }
    if (location !== undefined) { fields.push(`location=$${idx++}`); values.push(location); }
    if (starts_at !== undefined) { fields.push(`starts_at=$${idx++}`); values.push(starts_at); }
    if (ends_at !== undefined) { fields.push(`ends_at=$${idx++}`); values.push(ends_at); }
    if (metadata !== undefined) { fields.push(`metadata=$${idx++}`); values.push(metadata); }
    if (published !== undefined) { fields.push(`published=$${idx++}`); values.push(published); }

    fields.push(`updated_at=NOW()`);

    const sql = `UPDATE events SET ${fields.join(', ')} WHERE id=$${idx} RETURNING *`;
    values.push(id);
    const { rows } = await db.query(sql, values);
    return rows[0];
};

export const remove = async (id) => {
    // Remove dependent rows (registrations, feedback) first to avoid FK constraint errors,
    // perform in a transaction to keep consistency.
    try {
        await db.query('BEGIN');
        await db.query('DELETE FROM event_feedback WHERE event_id = $1', [id]);
        await db.query('DELETE FROM event_registrations WHERE event_id = $1', [id]);
        const res = await db.query('DELETE FROM events WHERE id = $1 RETURNING *', [id]);
        await db.query('COMMIT');
        return res.rows[0] || null;
    } catch (err) {
        await db.query('ROLLBACK');
        throw err;
    }
};
