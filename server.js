// Load Node modules
var express = require('express');
const ejs = require('ejs');
var fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
// Initialise Express
var app = express();
// Remove x-powered-by 
app.disable('x-powered-by');
// Render static files
app.use(express.static('public'));
// Set the view engine to ejs
app.set('view engine', 'ejs');
// Port website will run on
app.listen(8080);

console.log("Server listening on 8080")

app.get('/', async function (req, res) {

    var software = JSON.parse(fs.readFileSync('json/software.json', 'utf8'));

    software.sort((a, b) => {

        let fa = a.name.toLowerCase();
        let fb = b.name.toLowerCase();

        if (fa < fb) {
            return -1;
        }
        if (fa > fb) {
            return 1;
        }
        return 0;

    });

    softwareArray = software,

        res.render('pages/index')

});

app.get('/mobile', async function (req, res) {

    var software = JSON.parse(fs.readFileSync('json/software.json', 'utf8'));

    software.sort((a, b) => {

        let fa = a.name.toLowerCase();
        let fb = b.name.toLowerCase();

        if (fa < fb) {
            return -1;
        }
        if (fa > fb) {
            return 1;
        }
        return 0;

    });

    softwareArray = software,

        res.render('pages/mobile')

});

//Ersätt med API
app.get('/', function (req, res) {
    res.render('public/text', {
    });
});

app.get('/', function (req, res) {
    res.render('css/text', {
    });
});

