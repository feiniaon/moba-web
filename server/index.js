const express = require("express")

const app = express()

app.set('secret', 'iu234ui234358')

app.use('/uploads', express.static(__dirname+'/uploads'))
app.use(express.json())
app.use(require('cors')())


require('./plugins/db')(app)
require('./routes/admin')(app)
require('./routes/web')(app)


app.listen(3000, () =>{
    console.log('app listening on port')
})