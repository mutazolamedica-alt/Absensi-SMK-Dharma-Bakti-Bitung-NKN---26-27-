//========================================
// scanner.js
// ABSENKU SMK v2.0
//========================================

let codeReader = null;
let kameraAktif = false;
let scanSedangDiproses = false;

//========================================
// Bunyi Beep
//========================================

function bunyiBeep(){

    try{

        const ctx = new (window.AudioContext || window.webkitAudioContext)();

        const osc = ctx.createOscillator();

        const gain = ctx.createGain();

        osc.connect(gain);

        gain.connect(ctx.destination);

        osc.type = "sine";

        osc.frequency.value = 900;

        osc.start();

        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            ctx.currentTime + 0.15
        );

        osc.stop(ctx.currentTime + 0.15);

    }

    catch(e){}

}

//========================================
// Vibrasi
//========================================

function getar(){

    if(navigator.vibrate){

        navigator.vibrate(150);

    }

}

//========================================
// Scanner
//========================================

async function mulaiScanner(){

    if(kameraAktif) return;

    kameraAktif = true;

    scanSedangDiproses = false;

    document.getElementById("loading").style.display = "none";

    document.getElementById("hasil").innerHTML = "Membuka kamera...";

    codeReader = new ZXing.BrowserMultiFormatReader();

    try{

        const devices = await codeReader.listVideoInputDevices();

        if(devices.length===0){

            tampilError("Kamera tidak ditemukan");

            kameraAktif=false;

            return;

        }

let cameraId = devices[devices.length - 1].deviceId;

        // Cari kamera belakang

        for(const device of devices){

            const nama = (device.label || "").toLowerCase();

            if(
                nama.includes("back") ||
                nama.includes("rear") ||
                nama.includes("belakang")
            ){

                cameraId = device.deviceId;

                break;

            }

        }

        codeReader.decodeFromVideoDevice(

            cameraId,

            "reader",

        (result, err) => {

            if (err) return;

            if (!result) return;

            if (scanSedangDiproses) return;

            prosesQRCode(result.getText());

            }

        );

    }

catch(err){

    console.error(err);

    tampilError("Tidak dapat membuka kamera.");

    kameraAktif = false;

    scanSedangDiproses = false;

}

}

//========================================
// Stop Scanner
//========================================

function stopScanner(){

    if(codeReader){

        codeReader.reset();

    }

    kameraAktif=false;

}

//========================================
// QR
//========================================

function prosesQRCode(kode){

    if(scanSedangDiproses) return;

    scanSedangDiproses=true;

    bunyiBeep();

    getar();

    tampilLoading();

    kirimKeServer(kode);

}
