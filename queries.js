const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgresql',
    host: 'postgresql.hackuser53.svc.cluster.local',
    database: 'sampledb',
    password: 'password',
    port: 5432,
});

const makeTable = (request,response) =>{
    pool.query( `CREATE TABLE IF NOT EXISTS users (
        ID SERIAL PRIMARY KEY,
        name VARCHAR(30),
        email VARCHAR(30)
      )`,(error,results)=>{
        if(error){
            throw error;
        }
        response.status(200).json(results);
    })
}

const insertDummyValues = (request,response)=>{
    pool.query("INSERT INTO users (name, email) VALUES ('Joe', 'joe@example.com'), ('Ruby', 'ruby@example.com');",(error,results)=>{
        if(error)   throw error;
        response.status(200).json(results);
    })
}

const getUsers = (request, response) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}
const getUserById = (request, response) => {
    const id = parseInt(request.params.id)
    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}
const createUser = (request, response) => {
    console.log("Requst Body",request.body);
    const {
        name,
        email
    } = request.body
    pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email], (error, result) => {
        if (error) {
            throw error
        }
        response.status(201).send(`User added`)
    })
}
const updateUser = (request, response) => {
    const id = parseInt(request.params.id)
    const {
        name,
        email
    } = request.body
    pool.query(
        'UPDATE users SET name = $1, email = $2 WHERE id = $3',
        [name, email, id],
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).send(`User modified with ID: ${id}`)
        }
    )
}
const deleteUser = (request, response) => {
    const id = parseInt(request.params.id)
    pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`User deleted with ID: ${id}`)
    })
}
module.exports = {
    makeTable,
    insertDummyValues,
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
}