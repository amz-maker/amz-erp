import { pgCurrent } from "config/db-config";


export async function dbConnectTest() {

    try {
        const qr = await pgCurrent.query(`
            SELECT 1, 2, 3
        `);
        return qr.rows;

    } catch(err) {
        return null;
    }
}