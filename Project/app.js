const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const Nexmo = require('nexmo');
const socketio = require('socket.io');

// Init Nexmo
const nexmo = new Nexmo({
    apiKey: '4dc05159',
    apiSecret: 'adXWW4e0cOvQNFnN'
});

//Init app
const app = express();

// Template Engine setup
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

// Public folder setup
app.use(express.static(__dirname + '/public'));

// Body Parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Index route
app.get('/', (req, res) => {
    res.render('index');
});

// Catch form submit
app.post('/', (req, res) => {
    // res.send(req.body);
    // console.log(req.body);
    const number = req.body.number;
    const text = req.body.text;

    nexmo.message.sendSms("Nexmo", number , text, {
        type: "unicode"
      }, (err, responseData) => {
        if (err) {
          console.log(err, 'error');
        } else {
          console.dir(responseData, 'success data');
            // Get data from response data
            const data = {
                id: responseData.messages[0]['message-id'],
                number: responseData.messages[0]['to']
            }

            // Emit to client 
            io.emit('sendStatus', data);
        }
    })
});

// Define port
const port = 3000;

// Start server
const server = app.listen(port, () => console.log(`server working in ${port}`));

// Connect to socket.io
const io = socketio(server);
io.on('connection', (socket) => {
    console.log('connected');
    io.on('disconnect', () => {
        console.log('disconnected');
    })
})