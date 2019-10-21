const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');

const https = require('https');
const fs = require('fs');

const app = express();

//Load Routes
const auth = require('./routes/auth');
const login = require('./routes/login');

//Map global promise
mongoose.Promise = global.Promise;

//Connect to mongoose
mongoose.connect('mongodb://localhost/instaloop-dev', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {console.log('MongoDB Connected');})
.catch(err => console.log(err));

//MiddleWare
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

//Index Route
app.get('/', (req, res) => {
    var media = req.query.media;
    if (typeof media !== 'undefined' && media){
        media = JSON.parse(media);
        var str = '';
        var i = 0;

        for (let val of media){
            if (i >= 1){
                str += `<div class="carousel-item flex-item"><img class="flex-image img-fluid" src="${val.permalink}media/?size=l" alt="First slide"></div>`
            } else {
                str += `<div class="carousel-item active flex-item"><img class="flex-image img-fluid" src="${val.permalink}media/?size=l" alt="First slide"></div>`
            }
            i++;
        }

        res.render('index', {
            slideshow: str
        });
    } else {
        res.redirect('/login');
    }
    
});

//Use Routes
app.use('/auth', auth);
app.use('/login', login);

const port = 5000;

const credentials = {
    key: fs.readFileSync('./config/key.pem', 'utf8'),
    cert: fs.readFileSync('./config/server.crt', 'utf8')
  };

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

module.exports = httpsServer;


