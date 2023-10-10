require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const url_model = require('./models/shortUrl')
const shortid = require('shortid')
const app = express()
const port = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI
const crypto = require('crypto');
const shortUrl = require('./models/shortUrl')



app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
    const shortUrls = await url_model.find()
    res.render('index', { shortUrls: shortUrls })
})

app.post('/shortUrls', async (req, res) => {
    const shortUrls = await url_model.find()
    const randomHex = crypto.randomBytes(8).toString('hex');
    await url_model.create({ full: req.body.fullUrl, short: randomHex })
    res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
    // console.log('S')
    const result = await url_model.findOne({ short: req.params.shortUrl })
    if (result == null) return res.status(404).send("Not Found")
    // console.log(result)
    result.clicks++
    await result.save()

    res.redirect(result.full)
})

app.listen(port, (req, res) => {
    const connection = mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    console.log(`database is connected at ${port} `)
})