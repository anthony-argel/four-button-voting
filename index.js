require('dotenv').config();
const compression = require('compression');
const helmet = require('helmet');
const express = require('express');
const app = express();
const path = require('path');
app.use(express.static('public'));
app.use(compression());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));
const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server);
const {DateTime} = require('luxon');

let greenCount = 0;
let blueCount = 0;
let redCount = 0;
let yellowCount = 0;
let greenResponse = 'green';
let blueResponse = 'blue';
let redResponse = 'red';
let yellowResponse = 'yellow';
let question = 'Which color do you like the most?';
let startTime = DateTime.now();

const getList = () => {
    return [
        greenResponse + ': ' + greenCount,
        blueResponse + ': ' + blueCount,
        redResponse + ': ' + redCount,
        yellowResponse + ': ' + yellowCount
    ]
}

const resetTimer = () => {
    startTime = DateTime.now();
}


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/views/admin.html');
})

app.post('/admin', (req, res) => {
    if(req.body.password !== process.env.password) {
        return res.sendStatus(403);
    }
    resetTimer();
    question = req.body.question;
    blueResponse = req.body.blueRes;
    greenResponse = req.body.greenRes;
    redResponse = req.body.redRes;
    yellowResponse = req.body.yellowRes;

    res.redirect('/');
})

setInterval(() => {
    io.emit('time', DateTime.now().diff(startTime).toFormat("hhhh'hrs' mm 'm' ss's'"));
}, 1000)

io.on('connection', socket => {
    io.emit('question', question);
    io.emit('counts', getList());
    io.emit('time', startTime.diffNow());

    socket.on('button pressed', (buttonName) => {
        if(buttonName === 'green-btn') {
            greenCount++;
        }
        else if(buttonName === 'blue-btn') {
            blueCount++;
        }
        else if(buttonName === 'red-btn') {
            redCount++;
        }
        else if(buttonName === 'yellow-btn') {
            yellowCount++;
        }

        io.emit('counts', getList);
    })
});

app.get('*', (req, res) => {
    res.redirect('/');
})

server.listen(process.env.PORT || 3000, () => {
    console.log('listening on *:3000 or ' + process.env.PORT);
});