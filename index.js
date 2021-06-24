const compression = require('compression');
const helmet = require('helmet');
const express = require('express');
const app = express();
app.use(express.static('css'));
app.use(compression());
app.use(helmet());
const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server);
const {DateTime} = require('luxon');

let greenCount = 0;
let blueCount = 0;
let redCount = 0;
let yellowCount = 0;

const startTime = DateTime.now();

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

setInterval(() => {
    io.emit('time', DateTime.now().diff(startTime).toFormat("hhhh'hrs' mm 'm' ss's'"));
}, 1000)

io.on('connection', socket => {
    io.emit('question', "Which color do you like the most?");
    io.emit('counts', [greenCount, blueCount, redCount, yellowCount]);
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

        io.emit('counts', [greenCount, blueCount, redCount, yellowCount]);
    })
});

app.get('*', (req, res) => {
    res.redirect('/');
})

server.listen(process.env.PORT || 3000, () => {
    console.log('listening on *:3000 or ' + process.env.PORT);
});