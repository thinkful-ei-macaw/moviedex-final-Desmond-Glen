require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
console.log(process.env.API_TOKEN)
const app = express()
const store = require('./store')
const cors = require('cors')



app.use(morgan('dev'))
app.use(cors())

function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_KEY
    const authToken = req.get('Authorization')

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' })
    }
    // move to the next middleware
    next()
}



function handleGetTypes(req, res) {

    let filterData = [...store];
    console.log(req.query)

    if (!req.query.genre && !req.query.avg_vote && !req.query.country) {
        return res.status(404).json({ error: 'Not Found' })
    }

    if (req.query.genre) {
        filterData = filterData.filter(movie =>
            movie.genre.toLowerCase().includes(req.query.genre.toLowerCase()))
    };

    if (req.query.country) {
        filterData = filterData.filter(movie =>
            movie.country.toLocaleLowerCase().includes(req.query.country.toLowerCase()))
    }

    if (req.query.avg_vote) {
        filterData = filterData.filter(movie =>
            Number(movie.avg_vote) >= Number(req.query.avg_vote))
    }


    return res.json(filterData)
}


app.get('/movie', validateBearerToken, handleGetTypes)


const PORT = 8000
// const PORT = process.env.port || 8000

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})