var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = 'en-US';

let p = document.createElement('p');
const words = document.querySelector('.words');
words.appendChild(p);

recognition.addEventListener('result', e => {
    const transcript = Array.from(e.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
        
        const pooScript = transcript.replace(/poop/gi, '💩');
        
        p.textContent = pooScript;
        if (e.results[0].isFinal) {
            p = document.createElement('p');
            words.appendChild(p);
        }
})

recognition.addEventListener('end', recognition.start);

recognition.start();
