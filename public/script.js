const question = document.getElementsByTagName('h2')[0];
const blueBtn = document.getElementsByClassName('blue-btn')[0];
const redBtn = document.getElementsByClassName('red-btn')[0];
const yellowBtn = document.getElementsByClassName('yellow-btn')[0];
const greenBtn = document.getElementsByClassName('green-btn')[0];
const time = document.getElementById('time');
const socket = io();

function emitButtonClick(buttonName) {
    if(buttonName === 'blue-btn' || buttonName === 'red-btn' || buttonName === 'green-btn' || buttonName === 'yellow-btn') {
        socket.emit('button pressed', buttonName);
    }
}

blueBtn.addEventListener('click', () => emitButtonClick('blue-btn'));
redBtn.addEventListener('click', () => emitButtonClick('red-btn'));
yellowBtn.addEventListener('click', () => emitButtonClick('yellow-btn'));
greenBtn.addEventListener('click', () => emitButtonClick('green-btn'));

socket.on('counts', counts => {
    greenBtn.textContent = counts[0];
    blueBtn.textContent = counts[1];
    redBtn.textContent = counts[2];
    yellowBtn.textContent = counts[3];
});

socket.on('question', q => {
    question.textContent = q;
    document.title = q + ' | Four Buttons'
});

socket.on('time', t => {
    time.textContent = t;
})
