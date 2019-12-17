const numberInput = document.querySelector('#number'),
    textInput = document.querySelector('#msg'),
    button = document.querySelector('#button'),
    response = document.querySelector('.response');

button.addEventListener('click', send, false);

const socket = io();
socket.on('sendStatus', (data) => {
    response.innerHTML = `<h4>Text message sent to ${data.number} </h4>`
})

function send() {
    const number = numberInput.value.replace(/\D/g, '');
    const text = textInput.value;

    fetch('/', {
        method: 'post',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({ number, text })
    })
        .then((res) => console.log(res))
        .catch(err => console.log(err));

}