const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const recordedVideo = document.getElementById('recordedVideo');
const downloadLink = document.getElementById('downloadLink');

let mediaRecorder;
let recordedChunks = [];

startBtn.addEventListener('click', async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: 'screen' }
    });

    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = function(event) {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };

    mediaRecorder.onstop = function() {
        const blob = new Blob(recordedChunks, {
            type: 'video/webm'
        });
        recordedChunks = [];
        const url = URL.createObjectURL(blob);
        recordedVideo.src = url;

        // Show the download link and set the href to the Blob URL
        downloadLink.href = url;
        downloadLink.download = 'recording.webm';
        downloadLink.style.display = 'block';
        downloadLink.textContent = 'Download Recording';

        // Optionally, revoke the object URL after some time (e.g., after the download is complete)
        downloadLink.addEventListener('click', () => {
            setTimeout(() => URL.revokeObjectURL(url), 100);
        });
    };

    mediaRecorder.start();
    startBtn.disabled = true;
    stopBtn.disabled = false;
});

stopBtn.addEventListener('click', () => {
    mediaRecorder.stop();
    startBtn.disabled = false;
    stopBtn.disabled = true;
});
