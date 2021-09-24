import * as mysql from 'mysql2';


const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    // limit opening connection to prevent instance overload
    connectionLimit: 1,
})

console.log(`connect to database successfully (host=${process.env.MYSQL_HOST})`)

export default pool;