// =============================
// ABSENKU SMK v1.0
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
        "Minggu",
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu"
    ];

    const bulan = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember"
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
// Tombol Absen Masuk
// =============================

document
.getElementById("btnMasuk")
.addEventListener("click",function(){

    MODE="MASUK";

    document.getElementById("modeText").innerHTML="🟢 ABSEN MASUK";

    document.getElementById("modeText").className="success";

    document.getElementById("hasil").innerHTML=
    "Membuka kamera...";

    mulaiScanner();

});


// =============================
// Tombol Absen Pulang
// =============================

document
.getElementById("btnPulang")
.addEventListener("click",function(){

    MODE="PULANG";

    document.getElementById("modeText").innerHTML="🔴 ABSEN PULANG";

    document.getElementById("modeText").className="error";

    document.getElementById("hasil").innerHTML=
    "Membuka kamera...";

    mulaiScanner();

});


// =============================
// Menampilkan Hasil Scan
// =============================

function tampilHasil(
    nama,
    kode,
    status,
    jam
){

    document.getElementById("hasil").innerHTML=

    "<b>"+nama+"</b><br><br>"+

    "Kode : "+kode+

    "<br><br>"+

    "Status : "+status+

    "<br><br>"+

    jam;

}


// =============================
// Pesan Error
// =============================

function tampilError(teks){

    document.getElementById("hasil").innerHTML=

    "<span class='error'>"+teks+"</span>";

}

kirimKeServer("NKN001");
