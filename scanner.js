//========================================
// scanner.js
// ABSENKU SMK v3.1
// html5-qrcode
//========================================


let html5QrCode = null;
let kameraAktif = false;


//========================================
// Beep
//========================================

function bunyiBeep(){

    try{

        const ctx =
        new (window.AudioContext ||
        window.webkitAudioContext)();


        const osc =
        ctx.createOscillator();


        const gain =
        ctx.createGain();


        osc.connect(gain);

        gain.connect(ctx.destination);


        osc.type="sine";

        osc.frequency.value=1200;


        osc.start();


        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            ctx.currentTime+0.15
        );


        osc.stop(
            ctx.currentTime+0.15
        );


    }

    catch(e){}

}



//========================================
// Vibrasi
//========================================

function getar(){

    if(navigator.vibrate){

        navigator.vibrate(250);

    }

}



//========================================
// Mulai Scanner
//========================================


function mulaiScanner(){


    if(kameraAktif){

        return;

    }


    kameraAktif=true;


    document.getElementById("hasil").innerHTML =
    "Membuka kamera...";



    html5QrCode =
    new Html5Qrcode("reader");



    const config = {

        fps:10,

        qrbox:{
            width:250,
            height:250
        }

    };



    html5QrCode.start(

        {
            facingMode:"environment"
        },


        config,


        function(decodedText){


            if(scanSedangDiproses){

                return;

            }



            bunyiBeep();

            getar();



            hasilScanQR(decodedText);


        },


        function(errorMessage){

            // error scanning normal
            // tidak perlu ditampilkan

        }


    )

    .catch(function(err){


        console.error(err);


        kameraAktif=false;


        tampilError(
            "Tidak dapat membuka kamera."
        );


    });


}




//========================================
// Stop Scanner
//========================================


function stopScanner(){


    if(
        html5QrCode &&
        kameraAktif
    ){


        html5QrCode.stop()

        .then(()=>{


            html5QrCode.clear();


            kameraAktif=false;


        })


        .catch(err=>{

            console.log(err);

        });


    }


}
