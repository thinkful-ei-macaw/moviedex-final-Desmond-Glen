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

    let { genre, country, avg_vote } = req.query
    let key, val;
    for (let k in req.query) {
        key = k
        val = req.query[k]
    }
    console.log(key)
    console.log(val)
    let filterData = [...store];

    // val = val.split(" ").map(w => w[0].toUpperCase).join(" ")
    // val.charAt(0).toUpperCase() + val.slice(1)
    let wordArray = val.split(" ");
    for (let i = 0; i < wordArray.length; i++) {
        wordArray[i] = wordArray[i].charAt(0).toUpperCase() + wordArray[i].slice(1)
    }

    val = wordArray.join(" ")



    filterData = filterData.filter(data => data[key] === val)

    // let genre = req.query.genre
    // console.log(avg_vote)
    // console.log(country)
    // console.log(genre)
    return res.json(filterData)
}


app.get('/movie', validateBearerToken, handleGetTypes)


const PORT = 8000

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})