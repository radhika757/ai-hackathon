const {Pool} = import ('pg');

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "prodinsights",
    password: 'password',
    port: 5432
})