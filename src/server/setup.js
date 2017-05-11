import uuid from 'node-uuid';
import Sql from './sql';


async function setup() {
    console.log(`Creating database...`);
    const sql = new Sql();
    await sql.open(true, true);
    console.log('db opened');
    await sql.run(`CREATE TABLE hello_table (id, first_column, second_column)`);
    await sql.run(`BEGIN TRANSACTION`);
    try {
        sql.run(`INSERT INTO hello_table VALUES (${uuid.v4()}, 'hello', 'goodbye')`)
        await sql.run(`COMMIT`);
    } catch (err) {
        console.log(err);
        await sql.run(`ROLLBACK`);
    }
    console.log('closing the db');
    sql.close();
}

try {
    setup();
} catch (err) {
    console.log(err);
}