const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const takePhotoButton = document.querySelector('#takePhoto');

const getVideo = () => {
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
        .then(localMediaStream => {
            video.srcObject = localMediaStream;
            video.play();
        })
        .catch(err => {
            console.log('Something gone wrong: ', err);
        });
}

const paintToCanvas = () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    return setInterval(() => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);

        //pixels = redEffect(pixels);
        //pixels = rgbSplit(pixels);
        pixels = greenScreen(pixels);
        ctx.putImageData(pixels, 0, 0);
    }, 16);
};

const takePhoto = () => {
    snap.currentTime = 0;
    snap.play();

    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'handsome');
    link.innerHTML = `<img src="${data}" alt="Handsome" />`;
    strip.insertBefore(link, strip.firstChild);
    
}

const redEffect = (pixels) => {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i] = pixels.data[i] + 100;
    }
    return pixels;
};

const rgbSplit = (pixels) => {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i - 150] = pixels.data[i];
        pixels.data[i + 500] = pixels.data[i + 1];
        pixels.data[i + 550] = pixels.data[i + 2];
    }
    return pixels;
};

const greenScreen = (pixels) => {
    const levels = {};

    document.querySelectorAll('.rgb input').forEach((input) => {
        levels[input.name] = input.value;
    });

    for (let i = 0; i < pixels.data.length; i += 4) {
        red= pixels.data[i];
        green = pixels.data[i + 1];
        blue = pixels.data[i + 2];
        alpha = pixels.data[i + 3];

        if (
            red >= levels.rmin && red >= levels.rmax
            && green >= levels.gmin && green >= levels.gmax
            && blue >= levels.bmin && blue >= levels.bmax
        ) {
            // I messed around with all being random, but didnt know if that
            // crossed into the eppileptic zone or not, so I just left the code here commented.
            //pixels.data[i] = Math.random() * 255;
            //pixels.data[i + 1] = Math.random() * 255;
            //pixels.data[i + 2] = Math.random() * 255;
            //pixels.data[i + 3] = Math.random() * 255;
            pixels.data[i+3] = 0;
        }
    }
    return pixels;
};


getVideo();

video.addEventListener('canplay', paintToCanvas);

takePhotoButton.addEventListener('click', takePhoto);
