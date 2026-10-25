const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'app_tareas',
    password: 'root',
    port: 5432,
});

const guardarDB = async (data) => {
    try {
        for (let tarea of data) {
            await pool.query(
                `INSERT INTO tareas (id, "desc", completado_en) 
                 VALUES ($1, $2, $3) 
                 ON CONFLICT (id) 
                 DO UPDATE SET "desc" = EXCLUDED."desc", completado_en = EXCLUDED.completado_en`,
                [tarea.id, tarea.desc, tarea.completadoEn]
            );
        }
    } catch (error) {
        console.log('Error al guardar en la BBDD:', error);
    }
}

const leerDB = async () => {
    try {
        const { rows } = await pool.query('SELECT * FROM tareas');
        if (rows.length === 0) return null;
        
        return rows.map(row => ({
            id: row.id,
            desc: row.desc,
            completadoEn: row.completado_en
        }));
    } catch (error) {
        console.log('Error al leer de la BBDD:', error);
        return null;
    }
}

module.exports = {
    guardarDB,
    leerDB
}