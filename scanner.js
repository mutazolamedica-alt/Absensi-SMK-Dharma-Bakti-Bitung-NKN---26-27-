// scanner.js
// ABSENKU SMK v1.0

let codeReader = null;
let kameraAktif = false;
let scanSedangDiproses = false;

async function mulaiScanner() {

    if (kameraAktif) return;

    kameraAktif = true;

    document.getElementById("hasil").innerHTML = "Membuka kamera...";

    codeReader = new ZXing.BrowserMultiFormatReader();

    try {

        const devices = await codeReader.listVideoInputDevices();

        if (devices.length === 0) {

            tampilError("Kamera tidak ditemukan");

            kameraAktif = false;

            return;

        }

        let cameraId = devices[0].deviceId;

        // Cari kamera belakang jika ada
        devices.forEach(device => {

            const label = device.label.toLowerCase();

            if (
                label.includes("back") ||
                label.includes("rear") ||
                label.includes("belakang")
            ) {

                cameraId = device.deviceId;

            }

        });

        codeReader.decodeFromVideoDevice(

            cameraId,

            "reader",

            (result, err) => {

                if (result) {

                    prosesQRCode(result.getText());

                }

            }

        );

    }

    catch (e) {

        tampilError(e);

        kameraAktif = false;

    }

}

function stopScanner() {

    if (codeReader) {

        codeReader.reset();

    }

    kameraAktif = false;

}

function prosesQRCode(kode) {

    if (scanSedangDiproses) return;

    scanSedangDiproses = true;

    document.getElementById("hasil").innerHTML =
        "Memproses...";

    // bunyi beep
    const audio = new Audio("beep.mp3");
    audio.play();

    kirimKeServer(kode);

}
