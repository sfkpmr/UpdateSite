// Load Node modules
var compression = require('compression');
var express = require('express');
const ejs = require('ejs');
var fs = require('fs');
const util = require('util');
const { url } = require('inspector');
const readFile = util.promisify(fs.readFile);
const path = require('path');
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

app.get('/about', async function (req, res) {
    res.redirect("/")
});

app.get('/about/:name', async function (req, res) {
    const software = JSON.parse(fs.readFileSync('json/software.json', 'utf8'));

    try {
        const querriedSoftware = software.find(e => e.name === req.params.name);

        res.render('pages/about', { querriedSoftware });
    } catch {
        res.redirect("/")
    }
});

app.get('/api', (req, res) => {

    return res.sendFile(path.join(__dirname, '/api.html'));
});

app.get('/api/all', (req, res) => {
    const software = JSON.parse(fs.readFileSync('json/software.json', 'utf8'));

    const filteredSoftware = software.map(({ guideURL, description, box, ...keepAttrs }) => keepAttrs)

    return res.send(filteredSoftware);
});

app.get('/api/:name', (req, res) => {
    const software = JSON.parse(fs.readFileSync('json/software.json', 'utf8'));

    try {
        const querriedSoftware = software.find(e => e.name === req.params.name);

        delete querriedSoftware.guideURL;
        delete querriedSoftware.description;
        delete querriedSoftware.box;
        delete querriedSoftware.downloadURL;

        return res.send(querriedSoftware);
    } catch {
        res.status(404)
        res.send({ error: "No such software! More information: https://wallen.co/api" })
    }

});

app.get('/api/:name/version', (req, res) => {
    const software = JSON.parse(fs.readFileSync('json/software.json', 'utf8'));

    try {
        const querriedSoftware = software.find(e => e.name === req.params.name);

        delete querriedSoftware.name;
        delete querriedSoftware.releaseDate;
        delete querriedSoftware.releaseURL;
        delete querriedSoftware.guideURL;
        delete querriedSoftware.description;
        delete querriedSoftware.box;
        delete querriedSoftware.downloadURL;

        return res.send(querriedSoftware.releaseVersion);
    } catch {
        res.status(404)
        res.send({ error: "No such software! More information: https://wallen.co/api" })
    }

});

app.get('/ip', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    return res.send(ip);
});

app.use(express.static(path.join(__dirname, 'pages')));
// Handle HTTP 404
app.use(function (req, res) {
    const date = new Date();
    console.log(date.toLocaleDateString(), date.toLocaleTimeString() + " Bad URL: " + req.path);
    res.status(404).render('pages/404');
});

// Handle HTTP 500
app.use(function (error, req, res, next) {
    const date = new Date();
    console.log(date.toLocaleDateString(), date.toLocaleTimeString() + " " + error + " " + req.path);
    res.status(500).render('pages/500');
});