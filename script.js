// =============================
// ABSENKU SMK v2.0
// script.js
// =============================

let MODE = "";
let scannerAktif = false;

// =============================
// Update Jam
// =============================

function updateJam(){

    const sekarang = new Date();

    const hari=[
        "Minggu","Senin","Selasa","Rabu",
        "Kamis","Jumat","Sabtu"
    ];

    const bulan=[
        "Januari","Februari","Maret","April",
        "Mei","Juni","Juli","Agustus",
        "September","Oktober","November","Desember"
    ];

    document.getElementById("tanggal").innerHTML=

        hari[sekarang.getDay()] + ", " +

        sekarang.getDate()+" "+

        bulan[sekarang.getMonth()]+" "+

        sekarang.getFullYear();

    document.getElementById("jam").innerHTML=

        sekarang.toLocaleTimeString("id-ID");

}

setInterval(updateJam,1000);

updateJam();


// =============================
// Fungsi Tombol
// =============================

function aktifkanMode(mode){

    MODE=mode;

    document.getElementById("btnMasuk").disabled=true;
    document.getElementById("btnPulang").disabled=true;

    if(mode=="MASUK"){

        document.getElementById("modeText").innerHTML="🟢 ABSEN MASUK";
        document.getElementById("modeText").className="success";

    }else{

        document.getElementById("modeText").innerHTML="🔴 ABSEN PULANG";
        document.getElementById("modeText").className="error";

    }

    document.getElementById("hasil").innerHTML="Membuka kamera...";

    mulaiScanner();

}

document
.getElementById("btnMasuk")
.addEventListener("click",()=>{

    aktifkanMode("MASUK");

});

document
.getElementById("btnPulang")
.addEventListener("click",()=>{

    aktifkanMode("PULANG");

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
// Hasil
// =============================

function tampilHasil(

    nama,
    kode,
    status,
    jam

){

    sembunyiLoading();

    const box=document.getElementById("hasilBox");

    box.classList.remove("gagal");

    box.classList.add("berhasil");

    document.getElementById("hasil").innerHTML=

        "<h2>✅ BERHASIL</h2><br>"+

        "<b>"+nama+"</b><br><br>"+

        "Kode : "+kode+"<br>"+

        "Status : "+status+"<br>"+

        "Jam : "+jam;

    resetAplikasi();

}


// =============================
// Error
// =============================

function tampilError(teks){

    sembunyiLoading();

    const box=document.getElementById("hasilBox");

    box.classList.remove("berhasil");

    box.classList.add("gagal");

    document.getElementById("hasil").innerHTML=

        "<h2>❌ GAGAL</h2><br>"+

        teks;

    resetAplikasi();

}


// =============================
// Reset
// =============================

function resetAplikasi(){

    setTimeout(()=>{

        document.getElementById("btnMasuk").disabled=false;

        document.getElementById("btnPulang").disabled=false;

        document.getElementById("modeText").innerHTML="BELUM DIPILIH";

        document.getElementById("modeText").className="";

        stopScanner();

    },2500);

}
