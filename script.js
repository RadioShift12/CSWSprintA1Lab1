const divs = document.querySelectorAll('div');
const button = document.querySelector('button');

divs.forEach(div => {
    div.addEventListener('click', (event) => {
        console.log(event.target.className);
        event.stopPropagation();
    });
});

button.addEventListener('click', () => {
    console.log('Checkout');
}, {once: true});