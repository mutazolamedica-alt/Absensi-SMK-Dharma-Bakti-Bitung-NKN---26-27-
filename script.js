// =============================
// ABSENKU SMK v3.0
// script.js
// =============================

let MODE = "";
let scannerAktif = false;

// =============================
// Update Jam
// =============================

function updateJam() {

    const sekarang = new Date();

    const hari = [
        "Minggu","Senin","Selasa","Rabu",
        "Kamis","Jumat","Sabtu"
    ];

    const bulan = [
        "Januari","Februari","Maret","April",
        "Mei","Juni","Juli","Agustus",
        "September","Oktober","November","Desember"
    ];

    document.getElementById("tanggal").innerHTML =
        hari[sekarang.getDay()] + ", " +
        sekarang.getDate() + " " +
        bulan[sekarang.getMonth()] + " " +
        sekarang.getFullYear();

    document.getElementById("jam").innerHTML =
        sekarang.toLocaleTimeString("id-ID");

}

setInterval(updateJam,1000);
updateJam();


// =============================
// MODE
// =============================

function aktifkanMode(mode){

    MODE = mode;

    if(mode==="MASUK"){

        document.getElementById("modeText").innerHTML =
            "🟢 ABSEN MASUK";

        document.getElementById("modeText").className =
            "success";

        document.getElementById("btnMode").innerHTML =
            "GANTI KE MODE PULANG";

    }else{

        document.getElementById("modeText").innerHTML =
            "🔴 ABSEN PULANG";

        document.getElementById("modeText").className =
            "error";

        document.getElementById("btnMode").innerHTML =
            "GANTI KE MODE MASUK";

    }

    document.getElementById("hasil").innerHTML =
        "Membuka kamera...";

    if(!scannerAktif){

        mulaiScanner();

    }

}


// =============================
// Tombol Mode
// =============================

document.getElementById("btnMode").addEventListener("click",function(){

    if(MODE===""){

        aktifkanMode("MASUK");

    }

    else if(MODE==="MASUK"){

        aktifkanMode("PULANG");

    }

    else{

        aktifkanMode("MASUK");

    }

});


// =============================
// Loading
// =============================

function tampilLoading(){

    document.getElementById("loading").style.display="block";

}

function sembunyiLoading(){

    document.getElementById("loading").style.display="none";

}


// =============================
// Berhasil
// =============================

function tampilHasil(
    nama,
    kode,
    status,
    jam
){

    sembunyiLoading();

    const box =
        document.getElementById("hasilBox");

    box.classList.remove("gagal");
    box.classList.add("berhasil");

    document.getElementById("hasil").innerHTML =

        "<h2>✅ BERHASIL</h2><br>" +

        "<b>"+nama+"</b><br><br>" +

        "Kode : "+kode+"<br>" +

        "Status : "+status+"<br>" +

        "Jam : "+jam;

    setTimeout(function(){

        document.getElementById("hasil").innerHTML =
            "Silakan scan QR berikutnya...";

        scanSedangDiproses = false;

    },1200);

}


// =============================
// Error
// =============================

function tampilError(teks){

    sembunyiLoading();

    const box =
        document.getElementById("hasilBox");

    box.classList.remove("berhasil");
    box.classList.add("gagal");

    document.getElementById("hasil").innerHTML =

        "<h2>❌ GAGAL</h2><br>" +

        teks;

    setTimeout(function(){

        document.getElementById("hasil").innerHTML =
            "Silakan scan QR berikutnya...";

        scanSedangDiproses = false;

    },1200);

}
