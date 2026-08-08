// ========================================
// ABSENKU SMK
// script.js
// SMK Dharma Bakti Bitung
// ========================================


let MODE = "";

let scannerAktif = false;

let scanSedangDiproses = false;


// ========================================
// RIWAYAT SCAN
// ========================================

let riwayatScan = [];

const STORAGE_RIWAYAT =
    "absenku_riwayat_hari_ini";


//========================================
// TANGGAL STORAGE
//========================================

function tanggalHariIni(){

    const sekarang = new Date();

    const tahun =
        sekarang.getFullYear();

    const bulan =
        String(
            sekarang.getMonth() + 1
        ).padStart(2,"0");

    const tanggal =
        String(
            sekarang.getDate()
        ).padStart(2,"0");


    return (
        tahun +
        "-" +
        bulan +
        "-" +
        tanggal
    );

}


//========================================
// SIMPAN RIWAYAT
//========================================

function simpanRiwayat(){

    try{

        const data = {

            tanggal: tanggalHariIni(),

            riwayat: riwayatScan

        };


        localStorage.setItem(

            STORAGE_RIWAYAT,

            JSON.stringify(data)

        );

    }

    catch(err){

        console.error(
            "Gagal menyimpan riwayat:",
            err
        );

    }

}


//========================================
// MUAT RIWAYAT
//========================================

function muatRiwayat(){

    try{

        const data =
            localStorage.getItem(
                STORAGE_RIWAYAT
            );


        if(!data){

            riwayatScan = [];

            renderRiwayat();

            return;

        }


        const hasil =
            JSON.parse(data);


        /*
         * Jika tanggal masih sama,
         * gunakan riwayat sebelumnya.
         */

        if(
            hasil &&
            hasil.tanggal === tanggalHariIni() &&
            Array.isArray(hasil.riwayat)
        ){

            riwayatScan =
                hasil.riwayat;

        }

        else{

            /*
             * Tanggal sudah berubah.
             * Mulai riwayat baru.
             */

            riwayatScan = [];

            localStorage.removeItem(
                STORAGE_RIWAYAT
            );

        }


        renderRiwayat();

    }

    catch(err){

        console.error(
            "Gagal memuat riwayat:",
            err
        );

        riwayatScan = [];

        renderRiwayat();

    }

}


// ========================================
// UPDATE JAM
// ========================================

function updateJam(){

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

        hari[sekarang.getDay()] +
        ", " +
        sekarang.getDate() +
        " " +
        bulan[sekarang.getMonth()] +
        " " +
        sekarang.getFullYear();


    document.getElementById("jam").innerHTML =

        sekarang.toLocaleTimeString(
            "id-ID",
            {
                hour12:false
            }
        );


    // ====================================
    // JAM ANALOG
    // ====================================

    const detik =
        sekarang.getSeconds();

    const menit =
        sekarang.getMinutes();

    const jam =
        sekarang.getHours();


    const derajatDetik =
        detik * 6;

    const derajatMenit =
        menit * 6 + detik * 0.1;

    const derajatJam =
        (jam % 12) * 30 +
        menit * 0.5;


    const jarumDetik =
        document.querySelector(".second");

    const jarumMenit =
        document.querySelector(".minute");

    const jarumJam =
        document.querySelector(".hour");


    if(jarumDetik){

        jarumDetik.style.transform =
            "rotate(" +
            derajatDetik +
            "deg)";

    }


    if(jarumMenit){

        jarumMenit.style.transform =
            "rotate(" +
            derajatMenit +
            "deg)";

    }


    if(jarumJam){

        jarumJam.style.transform =
            "rotate(" +
            derajatJam +
            "deg)";

    }

}


setInterval(updateJam,1000);

updateJam();

muatRiwayat();


// ========================================
// MODE ABSENSI
// ========================================

function aktifkanMode(mode){

    MODE = mode;


    const modeText =
        document.getElementById("modeText");

    const btnMode =
        document.getElementById("btnMode");


    if(mode==="MASUK"){

        modeText.innerHTML =
            "ABSEN MASUK";

        modeText.className =
            "success";


        btnMode.innerHTML =
            "GANTI KE MODE PULANG";


    }

    else{

        modeText.innerHTML =
            "ABSEN PULANG";

        modeText.className =
            "error";


        btnMode.innerHTML =
            "GANTI KE MODE MASUK";

    }


    document.getElementById("hasil").innerHTML =

        "Kamera siap. Silakan scan QR...";


    if(!scannerAktif){

        mulaiScanner();

    }

}



// ========================================
// TOMBOL MODE
// ========================================

document
.getElementById("btnMode")
.addEventListener(
    "click",
    function(){

        if(MODE===""){

            aktifkanMode("MASUK");

        }

        else if(MODE==="MASUK"){

            aktifkanMode("PULANG");

        }

        else{

            aktifkanMode("MASUK");

        }

    }
);



// ========================================
// LOADING
// ========================================

function tampilLoading(){

    document.getElementById("loading")
        .style.display="block";

}


function sembunyiLoading(){

    document.getElementById("loading")
        .style.display="none";

}



// ========================================
// HASIL BERHASIL
// ========================================

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

        "<div class='hasil-berhasil'>" +

        "<div class='hasil-check'>✓</div>" +

        "<div class='hasil-data'>" +

        "<div class='hasil-judul'>" +
        "ABSENSI BERHASIL!" +
        "</div>" +

        "<div class='hasil-nama'>" +
        nama +
        "</div>" +

        "<div class='hasil-detail'>" +
        "NIS : " +
        kode +
        "</div>" +

        "</div>" +

        "<div class='hasil-status'>" +

        "<span>" +
        "● " +
        status +
        "</span>" +

        "<span>" +
        "◷ " +
        jam +
        "</span>" +

        "</div>" +

        "</div>";


    // ====================================
    // MASUKKAN KE RIWAYAT
    // ====================================

    tambahRiwayat({

        nama:nama,

        kode:kode,

        status:status,

        jam:jam,

        berhasil:true

    });


    setTimeout(function(){

        document.getElementById("hasil").innerHTML =

            "Silakan scan QR berikutnya...";


        scanSedangDiproses = false;

    },1200);

}



// ========================================
// HASIL ERROR
// ========================================

function tampilError(teks){

    sembunyiLoading();


    const box =
        document.getElementById("hasilBox");


    box.classList.remove("berhasil");

    box.classList.add("gagal");


    document.getElementById("hasil").innerHTML =

        "<div class='hasil-gagal'>" +

        "<div class='hasil-error-icon'>×</div>" +

        "<div>" +

        "<div class='hasil-judul-error'>" +

        "ABSENSI GAGAL" +

        "</div>" +

        "<div class='hasil-pesan'>" +

        teks +

        "</div>" +

        "</div>" +

        "</div>";


    // ====================================
    // Jika error terjadi setelah QR scan
    // masukkan ke riwayat
    // ====================================

    if(scanSedangDiproses){

        const sekarang = new Date();


        tambahRiwayat({

            nama:"Scan gagal",

            kode:"-",

            status:"GAGAL",

            jam:
                sekarang.toLocaleTimeString(
                    "id-ID",
                    {
                        hour12:false
                    }
                ),

            berhasil:false,

            pesan:teks

        });

    }


    setTimeout(function(){

        document.getElementById("hasil").innerHTML =

            "Silakan scan QR berikutnya...";


        scanSedangDiproses = false;

    },1200);

}



// ========================================
// HASIL SCAN QR
// ========================================

function hasilScanQR(kode){

    if(scanSedangDiproses){

        return;

    }


    if(MODE===""){

        tampilError(
            "Silakan pilih mode absensi terlebih dahulu."
        );

        return;

    }


    scanSedangDiproses=true;


    tampilLoading();


    prosesAbsensi(
        kode,
        MODE
    );

}



// ========================================
// PROSES ABSENSI
// ========================================

function prosesAbsensi(
    kode,
    mode
){

    if(mode===""){

        tampilError(
            "Mode absensi belum dipilih."
        );

        return;

    }


    kirimKeServer(kode);

}



// ========================================
// TAMBAH RIWAYAT
// ========================================

function tambahRiwayat(data){

    riwayatScan.unshift(data);


    // Maksimal 300 riwayat di browser.
    // Cocok dengan jumlah siswa target.

    if(riwayatScan.length > 300){

        riwayatScan.pop();

    }

    simpanRiwayat();

    renderRiwayat();

}



// ========================================
// RENDER RIWAYAT
// ========================================

function renderRiwayat(){

    const list =
        document.getElementById("riwayatList");


    const kosong =
        document.getElementById("riwayatKosong");


    const jumlah =
        document.getElementById("jumlahScan");


    if(!list){

        return;

    }


    jumlah.innerHTML =
        riwayatScan.length;


    if(riwayatScan.length===0){

        kosong.style.display="block";

        list.innerHTML="";

        return;

    }


    kosong.style.display="none";


    list.innerHTML="";


    riwayatScan.forEach(function(item){

        const row =
            document.createElement("div");


        row.className =
            "riwayat-item " +
            (
                item.berhasil
                ? "riwayat-berhasil"
                : "riwayat-gagal"
            );


        const statusClass =
            item.berhasil
            ? "status-hadir"
            : "status-gagal";


        row.innerHTML =

            "<div class='riwayat-jam'>" +

                item.jam +

            "</div>" +


            "<div class='riwayat-identitas'>" +

                "<div class='riwayat-nama'>" +

                    item.nama +

                "</div>" +


                "<div class='riwayat-kode'>" +

                    (
                        item.kode !== "-"
                        ? "NIS : " + item.kode
                        : item.pesan || "Scan gagal"
                    ) +

                "</div>" +

            "</div>" +


            "<div class='riwayat-status " +
                statusClass +
            "'>" +

                item.status +

            "</div>";


        list.appendChild(row);

    });

}
