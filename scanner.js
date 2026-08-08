//========================================
// scanner.js
// ABSENKU SMK v3.2
// html5-qrcode
//========================================

let html5QrCode = null;
let kameraAktif = false;


//========================================
// Update Tombol Kamera
//========================================

function updateTombolKamera(){

    const tombol =
        document.getElementById("btnKamera");

    if(!tombol){
        return;
    }


    if(kameraAktif){

        tombol.innerHTML =
            "📷 MATIKAN KAMERA";

        tombol.classList.remove("nonaktif");

        tombol.classList.add("aktif");

    }

    else{

        tombol.innerHTML =
            "📷 AKTIFKAN KAMERA";

        tombol.classList.remove("aktif");

        tombol.classList.add("nonaktif");

    }

}


//========================================
// Beep
//========================================

function bunyiBeep(){

    try{

        const ctx =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();


        const osc =
            ctx.createOscillator();


        const gain =
            ctx.createGain();


        osc.connect(gain);

        gain.connect(ctx.destination);


        osc.type = "sine";

        osc.frequency.value = 1200;


        osc.start();


        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            ctx.currentTime + 0.15
        );


        osc.stop(
            ctx.currentTime + 0.15
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


    kameraAktif = true;

    updateTombolKamera();


    document.getElementById("hasil").innerHTML =
        "Membuka kamera...";


    html5QrCode =
        new Html5Qrcode("reader");


    const config = {

        fps: 10,

        qrbox: {

            width: 250,
            height: 250

        }

    };


    html5QrCode.start(

        {
            facingMode: "environment"
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


        kameraAktif = false;

        updateTombolKamera();


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

            html5QrCode = null;

            kameraAktif = false;

            updateTombolKamera();


            document.getElementById("hasil").innerHTML =
                "Kamera dimatikan. Riwayat scan tetap tersimpan.";

        })


        .catch(err=>{

            console.log(err);

        });

    }

    else{

        kameraAktif = false;

        updateTombolKamera();

    }

}


//========================================
// Tombol Kamera
//========================================

document.addEventListener(
    "DOMContentLoaded",
    function(){

        const tombol =
            document.getElementById("btnKamera");


        if(!tombol){

            return;

        }


        tombol.addEventListener(
            "click",
            function(){

                if(kameraAktif){

                    stopScanner();

                }

                else{

                    mulaiScanner();

                }

            }
        );


        updateTombolKamera();

    }
);
