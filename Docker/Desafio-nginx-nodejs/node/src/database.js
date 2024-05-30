const mysql = require("mysql2")
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
})

connection.connect((err) => {
    if(err) throw "Erro ao conectar ao banco. Detalhes: " + err
})

async function createPerson(name){
    return new Promise((resolve, reject) => {
        connection.query("INSERT INTO `people` VALUES (?)", [name], (err, result) => {
            if(err) reject("Erro ao inserir o nome na tabela. Detalhes: " + err)

            resolve(result)
        })
    })
}

async function findPerson(name){
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM `people` WHERE name LIKE ?", [`%${name}%`], (err, result) => {
            if(err) reject("Erro ao buscar o nome na tabela. Detalhes: " + err)

            resolve(result)
        })
    })
}

async function findPeople(){
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM `people`", (err, result) => {
            if(err) reject("Erro ao buscar os nomes na tabela. Detalhes: " + err)

            resolve(result)
        })
    })
}

module.exports = { createPerson, findPeople, findPerson }