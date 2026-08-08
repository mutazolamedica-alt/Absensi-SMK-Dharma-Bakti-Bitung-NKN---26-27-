//========================================
// scanner.js
// ABSENKU SMK v3.4
// html5-qrcode
//========================================

let html5QrCode = null;
let kameraAktif = false;


//========================================
// Sinkronisasi Status Scanner
//========================================

function setStatusKamera(status){

    kameraAktif = status;

    // Sinkronkan dengan script.js
    scannerAktif = status;

    updateTombolKamera();

}


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

        tombol.classList.remove(
            "nonaktif"
        );

        tombol.classList.add(
            "aktif"
        );

    }

    else{

        tombol.innerHTML =
            "📷 AKTIFKAN KAMERA";

        tombol.classList.remove(
            "aktif"
        );

        tombol.classList.add(
            "nonaktif"
        );

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

    /*
     * Jangan membuat scanner baru jika
     * scanner lama masih aktif.
     */

    if(
        kameraAktif ||
        html5QrCode
    ){

        return;

    }


    document.getElementById("hasil").innerHTML =
        "Membuka kamera...";


    const scanner =
        new Html5Qrcode("reader");


    html5QrCode = scanner;


    const config = {

        fps: 10,

        qrbox: {

            width: 250,

            height: 250

        }

    };


    scanner.start(

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

            // Error scanning normal.
            // Tidak perlu ditampilkan.

        }

    )


    .then(function(){

        /*
         * PENTING:
         * status baru aktif setelah kamera
         * benar-benar berhasil dibuka.
         */

        setStatusKamera(true);


        document.getElementById("hasil").innerHTML =
            "Kamera aktif. Silakan scan QR siswa.";

    })


    .catch(function(err){

        console.error(
            "Gagal membuka kamera:",
            err
        );


        /*
         * Bersihkan instance yang gagal.
         */

        try{

            scanner.clear();

        }

        catch(e){}


        html5QrCode = null;


        setStatusKamera(false);


        tampilError(
            "Tidak dapat membuka kamera."
        );

    });

}


//========================================
// Stop Scanner
//========================================

function stopScanner(){

    /*
     * Jika memang tidak ada scanner,
     * pastikan status tetap OFF.
     */

    if(!html5QrCode){

        setStatusKamera(false);

        return;

    }


    const scanner =
        html5QrCode;


    /*
     * Tandai sedang proses berhenti.
     * Jangan langsung membuat scanner baru
     * sebelum stop selesai.
     */

    scanner.stop()

    .then(function(){

        try{

            scanner.clear();

        }

        catch(e){

            console.log(
                "Clear scanner:",
                e
            );

        }


        /*
         * Baru setelah benar-benar berhenti,
         * kosongkan instance.
         */

        html5QrCode = null;


        setStatusKamera(false);


        document.getElementById("hasil").innerHTML =
            "Kamera dimatikan. Riwayat scan tetap tersimpan.";

    })


    .catch(function(err){

        console.error(
            "Gagal mematikan kamera:",
            err
        );


        /*
         * Jika stop gagal, kita tetap
         * periksa status sebenarnya.
         */

        kameraAktif = false;

        scannerAktif = false;

        updateTombolKamera();

    });

}


//========================================
// Tombol Kamera
//========================================

document.addEventListener(
    "DOMContentLoaded",
    function(){

        const tombol =
            document.getElementById(
                "btnKamera"
            );


        if(!tombol){

            return;

        }


        tombol.addEventListener(
            "click",
            function(){

                /*
                 * KAMERA AKTIF
                 * → MATIKAN
                 */

                if(kameraAktif){

                    stopScanner();

                }

                /*
                 * KAMERA MATI
                 * → AKTIFKAN
                 */

                else{

                    mulaiScanner();

                }

            }
        );


        /*
         * Kondisi awal.
         */

        kameraAktif = false;

        scannerAktif = false;

        html5QrCode = null;


        updateTombolKamera();

    }
);
