require("dotenv/config")

require("./db")

const express = require("express")
const app = express()

require("./config")(app)

app.locals.siteTitle = 'AuthApp_'

require('./config/session.config')(app)         // sesion

const index = require("./routes/index")
app.use("/", index)

require("./error-handling")(app)

module.exports = app