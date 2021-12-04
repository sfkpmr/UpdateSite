// Load Node modules
var compression = require('compression');
var express = require('express');
const ejs = require('ejs');
var fs = require('fs');
const util = require('util');
const { url } = require('inspector');
const readFile = util.promisify(fs.readFile);
// Initialise Express
var app = express();
// Use Gzip compression
app.use(compression());
// Remove x-powered-by Express
app.disable('x-powered-by');
// Render static files
app.use('/static', express.static('static'))
app.use('/about', express.static('about'))
//app.use(express.static('static'));
app.use(express.static('software'));
// Set the view engine to ejs
app.set('view engine', 'ejs');
// Port website will run on
app.listen(8080);

console.log("Server listening on 8080")

app.get('/', async function (req, res) {

    const software = JSON.parse(fs.readFileSync('json/software.json', 'utf8'));

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

    const software = JSON.parse(fs.readFileSync('json/software.json', 'utf8'));

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

app.get('/api', (req, res) => {
    const software = JSON.parse(fs.readFileSync('json/software.json', 'utf8'));

    const filteredSoftware = software.map(({ guideURL, description, box, ...keepAttrs }) => keepAttrs)

    return res.send(filteredSoftware);
});

app.get('/api/:name', (req, res) => {
    const software = JSON.parse(fs.readFileSync('json/software.json', 'utf8'));

    if (!software.some(e => e.name === req.params.name)) {
        return res.send("No such software! Names are case sensitive, use spelling from https://www.wallen.co");
    }

    const querriedSoftware = software.find(e => e.name === req.params.name);
    delete querriedSoftware.guideURL;
    delete querriedSoftware.description;
    delete querriedSoftware.box;
    delete querriedSoftware.downloadURL;

    return res.send(querriedSoftware);
});

app.get('/api/:name/version', (req, res) => {
    const software = JSON.parse(fs.readFileSync('json/software.json', 'utf8'));

    if (!software.some(e => e.name === req.params.name)) {
        return res.send("No such software! Names are case sensitive, use spelling from https://www.wallen.co");
    }

    const querriedSoftware = software.find(e => e.name === req.params.name);
    delete querriedSoftware.name;
    delete querriedSoftware.releaseDate;
    delete querriedSoftware.releaseURL;
    delete querriedSoftware.guideURL;
    delete querriedSoftware.description;
    delete querriedSoftware.box;
    delete querriedSoftware.downloadURL;

    return res.send(Object.values(querriedSoftware));
});