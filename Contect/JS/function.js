const observerOptions = { root: null, rootMargin: "0px", threshold: 0.7 };

function observerCallback(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
        entry.target.classList.replace('fadeOut', 'fadeIn');
        } else {
        entry.target.classList.replace('fadeIn', 'fadeOut');
        }
    });
}

const observer = new IntersectionObserver(observerCallback, observerOptions);

const fadeElms = document.querySelectorAll('.carousel-item');
fadeElms.forEach(el => observer.observe(el));


const slider = document.querySelector('#idcarousel-pointer');
let isDown = false;
let startX;
let scrollLeft;

slider.addEventListener('mousedown', e => {
    isDown = true;
    slider.classList.add('active');
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
});

slider.addEventListener('mouseleave', _ => {
    isDown = false;
    slider.classList.remove('active');
});

slider.addEventListener('mouseup', _ => {
    isDown = false;
    slider.classList.remove('active');
});

slider.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const SCROLL_SPEED = 2;
    const walk = (x - startX) * SCROLL_SPEED;
    slider.scrollLeft = scrollLeft - walk;
});

let Comandos = [
    { Pregunta:'hola',Respuesta:'Hola, en que te puedo ayudar!'},
    { Pregunta:'guardar ejecutar',Respuesta:'Que deseas guardar?!'},
    { Pregunta:'ayudar ayuda',Respuesta:'En que te puedo ayudar?!'}
];

if ("webkitSpeechRecognition" in window) {
    let speechRecognition = new webkitSpeechRecognition();
    speechRecognition.continuous = true;
    speechRecognition.interimResults = true;
    speechRecognition.lang = "es-MX";

    speechRecognition.onstart = () => {
        $("#status").show();
        speak('En que te puedo ayudar?')
    };

    speechRecognition.onerror = () => {
        $("#status").hide();
        speak('Adios')
        alert("Speech Recognition Error");
    };

    speechRecognition.onend = () => {
        $("#status").hide();
        speak('Adios');
        $("#final").html('<div class="item-conversacion">Texto</div>');
        console.log("Speech Recognition Ended");
    };

    speechRecognition.onresult = (event) => {
        let interim_transcript = "";
        let final_transcript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                final_transcript += event.results[i][0].transcript;
            } else {
                interim_transcript += event.results[i][0].transcript;
            } 
        }

        if(final_transcript.trim() != ""){
            $("#final").append(`<div class="item-conversacion">${final_transcript}</div>`);

            let FindComandos = fnc_BusquedaPregunta(final_transcript.replace('.','').toLowerCase())
            if(FindComandos.length > 0){
                speak(FindComandos[0].Respuesta);
            } else {
                speak('Ok Adios!');
            }
        }
        
    };

    $("#start").on('click',function(){
        speechRecognition.start();
    });

    $("#stop").on('click',function(){
        speechRecognition.stop();
    });
} else {
    alert("Speech Recognition Not Available");
}

function fnc_BusquedaPregunta(Comando) {
    let FindComandos = Comandos.filter(function(value) {
        return value.Pregunta.includes(Comando); 
    });
    console.log(FindComandos.length)
    return FindComandos;
}

function speak(text) {
	var msg = new SpeechSynthesisUtterance();
	msg.text = text;
	msg.volume = 1;
	msg.rate = 1;
	msg.pitch = 1;
    msg.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == "Microsoft LorenzoEsCL Online (Natural) - Spanish (Mexico)"; })[0];
	
	window.speechSynthesis.speak(msg);
}

$("#speak").on('click',function(){
    let speechMsgInput = $('#speech-msg').val();
	if (speechMsgInput.length > 0) {
		speak(speechMsgInput);
	}
});





//https://codepen.io/denic/pen/GRoOxbM