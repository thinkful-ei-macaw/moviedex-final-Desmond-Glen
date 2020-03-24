require('dotenv').config();

const express = require('express')
const morgan = require('morgan')
console.log(process.env.API_TOKEN)
const app = express()
const store = require('./store')

const API_TOKEN = process.env.API_TOKEN


app.use(morgan('dev'))

function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' })
    }
    // move to the next middleware
    next()
}



function handleGetTypes(req, res) {
    let genre = req.query.genre
    console.log(genre)


    return res.json(store)
}

function handleGetMovies(req, res) {
    res.send('Hello Movies')
}

app.get('/movie', validateBearerToken, handleGetTypes)


const PORT = 8000

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})