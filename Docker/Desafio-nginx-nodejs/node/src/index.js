const express = require('express')
const { createPerson, findPeople, findPerson } = require("./database")
const { geradorNome } = require("gerador-nome")
const app = express()
const port = 3000

const MAX_ATTEMPTS = 5

app.get('/', async (_req, res) => {
    try {
        let newPerson = geradorNome()
        let attempts = 0

        while((await findPerson(newPerson)).length > 0 && attempts < MAX_ATTEMPTS) {
            newPerson = geradorNome()
            attempts++
        }

        if(attempts < MAX_ATTEMPTS)
            await createPerson(newPerson)

        const users = await findPeople()

        res.send(
            `
                <h1>Full Cycle Rocks!</h1>
                <h2>Pessoas:</h2>
                <ul>
                    ${users.map(({name}) => `<li>${name}</li>`).join('')} 
                <ul>
            `
        )
    } catch (error) {
        console.log(error)
        res.send("<h1>Ocorreu um erro inesperado! Recarregue a página e tente novamente</h1>")
    }
})

app.listen(port, () => {
    console.log(`App rodando na porta ${port}`)
})