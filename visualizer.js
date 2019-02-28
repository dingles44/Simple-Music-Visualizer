window.onload = function() {

    var file = document.getElementById("thefile");
    var audio = document.getElementById("audio");

    file.onchange = function() {
        var files = this.files;
        audio.src = URL.createObjectURL(files[0]);
        audio.load();
        audio.play();
        var context = new AudioContext();
        var src = context.createMediaElementSource(audio);
        var analyser = context.createAnalyser();

        var canvas = document.getElementById("canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        var ctx = canvas.getContext("2d");

        src.connect(analyser);
        analyser.connect(context.destination);

        //analyser.fftSize = 256;

        analyser.fftSize = 512;

        var bufferLength = analyser.frequencyBinCount;

        var dataArray = new Uint8Array(bufferLength);

        var WIDTH = canvas.width;
        var HEIGHT = canvas.height;

        var barHeight;
        var x = 0;

        function toRadians(angle){
            return angle * (Math.PI / 180);
        }



        function renderFrame() {
            requestAnimationFrame(renderFrame);



            ctx.beginPath();

            x = 0;

            analyser.getByteFrequencyData(dataArray);

            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, WIDTH, HEIGHT);


            for (var i = 0; i < bufferLength; i++) {



                var degreesPerDivision = 360 / (bufferLength);
                var radiansPerDivision = toRadians(degreesPerDivision);

                var yoffset = Math.pow((Math.sin((radiansPerDivision * (i))) * dataArray[i] + 1),1.2);
                var xoffset = 1.5 * (yoffset / (Math.tan(radiansPerDivision * (i))));



                ctx.moveTo(WIDTH / 2, HEIGHT / 2);

                ctx.lineTo(WIDTH /2 + xoffset, HEIGHT / 2 - yoffset +5);
                ctx.moveTo(WIDTH /2 , HEIGHT /2);
                ctx.lineTo(WIDTH /2 + xoffset, HEIGHT / 2 + yoffset -5);

                barHeight = dataArray[i];

                var r = barHeight + (25 * (i/bufferLength));
                var g = 100 * (i/bufferLength);
                var b = 0;

                ctx.strokeStyle = "rgb(" + r + "," + g + "," + b + ")";

                ctx.stroke();

            }

            console.log(bufferLength);


            ctx.closePath();
        }



        audio.play();
        renderFrame();
    };
};