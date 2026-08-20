// ========================================
// ABSENKU SMK
// script.js
// SMK Dharma Bakti Bitung
// ========================================

// ========================================
// LOGIN WEB ABSENSI
// KEAMANAN LEVEL 1
// ========================================

// ========================================
// AKUN 1 - WALI / GURU
// ========================================

const USERNAME_WALI =
    "wali";

const PASSWORD_WALI =
    "123456";


// ========================================
// AKUN 2 - SISWA
// FULL ACCESS SAMA DENGAN WALI
// ========================================

const USERNAME_SISWA =
    "siswa";

const PASSWORD_SISWA =
    "nautika10";


// ========================================
// CEK LOGIN
// ========================================

function prosesLogin(){

    const usernameInput =
        document.getElementById(
            "loginUsername"
        );

    const passwordInput =
        document.getElementById(
            "loginPassword"
        );

    const error =
        document.getElementById(
            "loginError"
        );

    const tombol =
        document.getElementById(
            "btnLogin"
        );


    if(
        !usernameInput ||
        !passwordInput ||
        !error ||
        !tombol
    ){

        return;

    }


    const username =
        usernameInput.value
            .trim();

    const password =
        passwordInput.value;


    // ====================================
    // VALIDASI KOSONG
    // ====================================

    if(
        username === "" ||
        password === ""
    ){

        error.innerHTML =
            "Username dan password wajib diisi.";

        return;

    }


    // ====================================
    // VALIDASI AKUN
    // ====================================

    const loginBenar =

        (
            username ===
            USERNAME_WALI &&

            password ===
            PASSWORD_WALI
        )

        ||

        (
            username ===
            USERNAME_SISWA &&

            password ===
            PASSWORD_SISWA
        );


    if(!loginBenar){

        error.innerHTML =
            "Username atau password salah.";

        passwordInput.value =
            "";

        passwordInput.focus();

        return;

    }


    // ====================================
    // LOGIN BERHASIL
    // ====================================

    error.innerHTML =
        "";

    tombol.disabled =
        true;

    tombol.innerHTML =
        "MEMBUKA...";


    const loginScreen =
        document.getElementById(
            "loginScreen"
        );


    if(loginScreen){

        loginScreen.style.opacity =
            "0";

        loginScreen.style.transition =
            "opacity .25s ease";


        setTimeout(
            function(){

                loginScreen.style.display =
                    "none";

            },
            250
        );

    }

}


// ========================================
// PASANG EVENT LOGIN
// ========================================

function pasangLogin(){

    const tombol =
        document.getElementById(
            "btnLogin"
        );

    const username =
        document.getElementById(
            "loginUsername"
        );

    const password =
        document.getElementById(
            "loginPassword"
        );


    if(
        !tombol ||
        !username ||
        !password
    ){

        return;

    }


    tombol.addEventListener(
        "click",
        prosesLogin
    );


    // Enter pada username
    username.addEventListener(
        "keydown",
        function(event){

            if(
                event.key ===
                "Enter"
            ){

                event.preventDefault();

                password.focus();

            }

        }
    );


    // Enter pada password
    password.addEventListener(
        "keydown",
        function(event){

            if(
                event.key ===
                "Enter"
            ){

                event.preventDefault();

                prosesLogin();

            }

        }
    );


    // Fokus otomatis ke username
    setTimeout(
        function(){

            username.focus();

        },
        100
    );

}


window.addEventListener(
    "load",
    pasangLogin
);

let MODE = "";

let scannerAktif = false;

let scanSedangDiproses = false;


// ========================================
// RIWAYAT SCAN
// ========================================

let riwayatScan = [];


// ========================================
// PENYIMPANAN RIWAYAT
// ========================================

const STORAGE_RIWAYAT =
    "absenku_riwayat_harian";


// ========================================
// TANGGAL HARI INI
// ========================================

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


// ========================================
// SIMPAN RIWAYAT KE LOCAL STORAGE
// ========================================

function simpanRiwayat(){

    try{

        const data = {

            tanggal:
                tanggalHariIni(),

            riwayat:
                riwayatScan

        };


        localStorage.setItem(

            STORAGE_RIWAYAT,

            JSON.stringify(data)

        );

    }

    catch(error){

        console.error(
            "Gagal menyimpan riwayat:",
            error
        );

    }

}


// ========================================
// MUAT RIWAYAT DARI LOCAL STORAGE
// ========================================

function muatRiwayat(){

    try{

        const tersimpan =
            localStorage.getItem(
                STORAGE_RIWAYAT
            );


        // Belum ada riwayat tersimpan

        if(!tersimpan){

            riwayatScan = [];

            renderRiwayat();

            return;

        }


        const data =
            JSON.parse(tersimpan);


        // Pastikan data valid

        if(
            !data ||
            !Array.isArray(data.riwayat)
        ){

            riwayatScan = [];

            localStorage.removeItem(
                STORAGE_RIWAYAT
            );

            renderRiwayat();

            return;

        }


        // ====================================
        // CEK TANGGAL
        // ====================================

        if(
            data.tanggal ===
            tanggalHariIni()
        ){

            riwayatScan =
                data.riwayat;

        }

        else{

            /*
             * Tanggal sudah berubah.
             * Riwayat lama tidak ditampilkan
             * sebagai riwayat hari ini.
             */

            riwayatScan = [];


            localStorage.removeItem(
                STORAGE_RIWAYAT
            );

        }


        renderRiwayat();

    }

    catch(error){

        console.error(
            "Gagal membaca riwayat:",
            error
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
        menit * 6 +
        detik * 0.1;


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


// ========================================
// JALANKAN JAM
// ========================================

setInterval(
    updateJam,
    1000
);

updateJam();


// ========================================
// MUAT RIWAYAT SAAT WEB DIBUKA
// ========================================

muatRiwayat();


// ========================================
// MODE ABSENSI
// ========================================

function aktifkanMode(mode){

    MODE = mode;


    const modeText =
        document.getElementById(
            "modeText"
        );


    const btnMode =
        document.getElementById(
            "btnMode"
        );


    if(mode === "MASUK"){

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


    document.getElementById(
        "hasil"
    ).innerHTML =

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

        if(MODE === ""){

            aktifkanMode("MASUK");

        }

        else if(MODE === "MASUK"){

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

    document.getElementById(
        "loading"
    ).style.display = "block";

}


function sembunyiLoading(){

    document.getElementById(
        "loading"
    ).style.display = "none";

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
        document.getElementById(
            "hasilBox"
        );


    box.classList.remove(
        "gagal"
    );


    box.classList.add(
        "berhasil"
    );


    document.getElementById(
        "hasil"
    ).innerHTML =

        "<div class='hasil-berhasil'>" +

        "<div class='hasil-check'>" +
        "✓" +
        "</div>" +

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


    setTimeout(
        function(){

            document.getElementById(
                "hasil"
            ).innerHTML =

                "Silakan scan QR berikutnya...";


            scanSedangDiproses = false;

        },
        1200
    );

}


// ========================================
// HASIL ERROR
// ========================================

function tampilError(teks){

    sembunyiLoading();


    const box =
        document.getElementById(
            "hasilBox"
        );


    box.classList.remove(
        "berhasil"
    );


    box.classList.add(
        "gagal"
    );


    document.getElementById(
        "hasil"
    ).innerHTML =

        "<div class='hasil-gagal'>" +

        "<div class='hasil-error-icon'>" +
        "×" +
        "</div>" +

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

        const sekarang =
            new Date();


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


    setTimeout(
        function(){

            document.getElementById(
                "hasil"
            ).innerHTML =

                "Silakan scan QR berikutnya...";


            scanSedangDiproses = false;

        },
        1200
    );

}


// ========================================
// HASIL SCAN QR
// ========================================

function hasilScanQR(kode){

    if(scanSedangDiproses){

        return;

    }


    if(MODE === ""){

        tampilError(

            "Silakan pilih mode absensi terlebih dahulu."

        );

        return;

    }


    scanSedangDiproses = true;


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

    if(mode === ""){

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

    /*
     * Masukkan data terbaru
     * ke bagian paling atas.
     */

    riwayatScan.unshift(
        data
    );


    /*
     * Maksimal 300 riwayat
     * tersimpan di perangkat.
     */

    if(
        riwayatScan.length > 300
    ){

        riwayatScan.pop();

    }


    /*
     * SIMPAN KE PERANGKAT
     */

    simpanRiwayat();


    /*
     * TAMPILKAN KE LAYAR
     */

    renderRiwayat();

}


// ========================================
// RENDER RIWAYAT
// ========================================

function renderRiwayat(){

    const list =
        document.getElementById(
            "riwayatList"
        );


    const kosong =
        document.getElementById(
            "riwayatKosong"
        );


    const jumlah =
        document.getElementById(
            "jumlahScan"
        );


    if(!list){

        return;

    }


    jumlah.innerHTML =
        riwayatScan.length;


    if(
        riwayatScan.length === 0
    ){

        kosong.style.display =
            "block";


        list.innerHTML =
            "";


        return;

    }


    kosong.style.display =
        "none";


    list.innerHTML =
        "";


    riwayatScan.forEach(
        function(item){

            const row =
                document.createElement(
                    "div"
                );


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

                            ? "NIS : " +
                              item.kode

                            : item.pesan ||
                              "Scan gagal"
                        ) +

                    "</div>" +

                "</div>" +


                "<div class='riwayat-status " +

                    statusClass +

                "'>" +

                    item.status +

                "</div>";


            list.appendChild(
                row
            );

        }
    );

}

// ========================================
// DASHBOARD REKAP KEHADIRAN
// ABSENKU SMK
// ========================================

let rekapSudahDimuat = false;


// ========================================
// FORMAT TANGGAL REKAP
// ========================================

function formatTanggalRekap(tanggal){

    if(!tanggal){
        return "Tanggal tidak tersedia";
    }


    const bagian =
        tanggal.split("-");


    if(bagian.length !== 3){
        return tanggal;
    }


    const tahun =
        bagian[0];

    const bulan =
        Number(bagian[1]);

    const hari =
        Number(bagian[2]);


    const namaBulan = [

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


    return (
        hari +
        " " +
        namaBulan[bulan - 1] +
        " " +
        tahun
    );

}


// ========================================
// TAMPILKAN REKAP
// ========================================

function tampilkanRekapHariIni(data){

    if(!data){
        return;
    }


    if(data.status !== "success"){

        document.getElementById(
            "rekapStatus"
        ).className =
            "rekap-status-error";


        document.getElementById(
            "rekapStatus"
        ).innerHTML =
            "BELUM TERSEDIA";


        document.getElementById(
            "rekapPesan"
        ).innerHTML =
            data.pesan ||
            "Rekap hari ini belum tersedia.";


        return;

    }


    document.getElementById(
        "rekapTanggal"
    ).innerHTML =
        formatTanggalRekap(
            data.tanggal
        );


    document.getElementById(
        "rekapHadir"
    ).innerHTML =
        Number(data.hadir) || 0;


    document.getElementById(
        "rekapTerlambat"
    ).innerHTML =
        Number(data.terlambat) || 0;


    document.getElementById(
        "rekapIzin"
    ).innerHTML =
        Number(data.izin) || 0;


    document.getElementById(
        "rekapSakit"
    ).innerHTML =
        Number(data.sakit) || 0;


    document.getElementById(
        "rekapAlpa"
    ).innerHTML =
        Number(data.alpa) || 0;


    document.getElementById(
        "rekapTotalSiswa"
    ).innerHTML =
        Number(data.totalSiswa) || 0;


    document.getElementById(
        "rekapStatus"
    ).className =
        "rekap-status-ready";


    document.getElementById(
        "rekapStatus"
    ).innerHTML =
        "DATA TERBARU";


    document.getElementById(
        "rekapPesan"
    ).innerHTML =
        "Data diambil dari Rekap Harian.";


    rekapSudahDimuat = true;

}


// ========================================
// MUAT REKAP DARI SERVER
// ========================================

async function muatRekapDashboard(){

    try{

        const data =
            await ambilRekapHariIni();


        tampilkanRekapHariIni(data);

    }

    catch(error){

        console.error(
            "Gagal memuat dashboard:",
            error
        );

    }

}


// ========================================
// JADWALKAN PEMBARUAN 08.30
// TANPA POLLING
// ========================================

function jadwalkanRekap0830(){

    const sekarang =
        new Date();


    const target =
        new Date();


    target.setHours(
        8,
        30,
        0,
        0
    );


    // Jika sekarang sudah 08.30,
    // langsung ambil data.

    if(
        sekarang >= target
    ){

        muatRekapDashboard();

        return;

    }


    const selisih =
        target.getTime() -
        sekarang.getTime();


    setTimeout(
        function(){

            muatRekapDashboard();

        },
        selisih
    );

}


// ========================================
// MULAI DASHBOARD SETELAH SEMUA FILE JS
// SELESAI DIMUAT
// ========================================

window.addEventListener("load", function(){

    muatRekapDashboard();

    jadwalkanRekap0830();

    // Preload daftar siswa sekali saat halaman selesai dimuat.
    // Setelah ini dropdown Izin/Sakit/Terlambat dapat dibuka hampir instan.
    muatDaftarSiswaStatusKhusus().catch(function(err){
        console.warn(
            "Preload daftar siswa gagal:",
            err
        );
    });

});

// ========================================
// INPUT IZIN / SAKIT DARI DASHBOARD
// ========================================

let daftarSiswaStatusKhusus = [];
let statusKhususAktif = "Izin";
let statusKhususSedangDisimpan = false;


function bukaStatusKhususModal(status){

    statusKhususAktif =
        status === "Sakit"
            ? "Sakit"
            : status === "Terlambat"
                ? "Terlambat"
                : "Izin";

    const modal =
        document.getElementById("statusKhususModal");

    if(!modal){
        return;
    }

    const judul =
        document.getElementById("statusKhususJudul");

    const icon =
        document.getElementById("statusKhususIcon");

    const tombol =
        document.getElementById("btnSimpanStatusKhusus");

    const select =
        document.getElementById("statusKhususSiswa");

    const preview =
        document.getElementById("statusKhususPreview");

    const pesan =
        document.getElementById("statusKhususPesan");

    if(statusKhususAktif === "Sakit"){

        judul.innerHTML = "TAMBAHKAN SAKIT";
        icon.innerHTML = "+";
        icon.className =
            "status-khusus-icon sakit";
        tombol.innerHTML = "SIMPAN SAKIT";
        tombol.className =
            "status-khusus-btn primary sakit";

    }
    else if(statusKhususAktif === "Terlambat"){

        judul.innerHTML = "TAMBAHKAN TERLAMBAT";
        icon.innerHTML = "T";
        icon.className =
            "status-khusus-icon terlambat";
        tombol.innerHTML = "SIMPAN TERLAMBAT";
        tombol.className =
            "status-khusus-btn primary terlambat";

    }
    else{

        judul.innerHTML = "TAMBAHKAN IZIN";
        icon.innerHTML = "I";
        icon.className =
            "status-khusus-icon izin";
        tombol.innerHTML = "SIMPAN IZIN";
        tombol.className =
            "status-khusus-btn primary izin";

    }

    pesan.innerHTML = "";
    pesan.className = "status-khusus-pesan";
    preview.innerHTML =
        "Pilih siswa untuk melihat nama dan kelas.";

    select.value = "";

    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");

    muatDaftarSiswaStatusKhusus();

    setTimeout(function(){
        select.focus();
    }, 50);

}


function tutupStatusKhususModal(force){

    const modal =
        document.getElementById("statusKhususModal");

    if(!modal){
        return;
    }

    // Saat request masih berjalan, tombol close biasa tetap dicegah
    // agar tidak memutus proses penyimpanan. Setelah server sukses,
    // fungsi ini dipanggil dengan force=true sehingga modal pasti tertutup.
    if(
        statusKhususSedangDisimpan &&
        force !== true
    ){
        return;
    }

    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");

}


async function muatDaftarSiswaStatusKhusus(){

    const select =
        document.getElementById("statusKhususSiswa");

    if(!select){
        return;
    }

    if(daftarSiswaStatusKhusus.length > 0){

        renderDaftarSiswaStatusKhusus();
        return;

    }

    select.disabled = true;
    select.innerHTML =
        '<option value="">Memuat daftar siswa...</option>';

    try{

        const data =
            await ambilDaftarSiswa();

        if(
            !data ||
            data.status !== "success" ||
            !Array.isArray(data.siswa)
        ){

            throw new Error(
                data && data.pesan
                    ? data.pesan
                    : "Daftar siswa tidak tersedia."
            );

        }

        daftarSiswaStatusKhusus =
            data.siswa;

        renderDaftarSiswaStatusKhusus();

    }
    catch(error){

        console.error(
            "Gagal memuat dropdown siswa:",
            error
        );

        select.innerHTML =
            '<option value="">Gagal memuat siswa</option>';

        tampilPesanStatusKhusus(
            error.message ||
            "Tidak dapat mengambil daftar siswa.",
            "error"
        );

    }

}


function renderDaftarSiswaStatusKhusus(){

    const select =
        document.getElementById("statusKhususSiswa");

    if(!select){
        return;
    }

    select.innerHTML =
        '<option value="">Pilih siswa...</option>';

    daftarSiswaStatusKhusus.forEach(function(siswa){

        const option =
            document.createElement("option");

        option.value = siswa.kode;

        option.textContent =
            siswa.kode +
            " — " +
            siswa.nama;

        select.appendChild(option);

    });

    select.disabled = false;

}


function tampilkanPreviewStatusKhusus(){

    const select =
        document.getElementById("statusKhususSiswa");

    const preview =
        document.getElementById("statusKhususPreview");

    if(!select || !preview){
        return;
    }

    const kode = select.value;

    if(!kode){

        preview.innerHTML =
            "Pilih siswa untuk melihat nama dan kelas.";

        return;

    }

    const siswa =
        daftarSiswaStatusKhusus.find(
            function(item){
                return item.kode === kode;
            }
        );

    if(!siswa){

        preview.innerHTML =
            "Data siswa tidak ditemukan.";

        return;

    }

    preview.innerHTML =
        "<strong>" +
        escapeHtmlStatusKhusus(siswa.nama) +
        "</strong><span>" +
        escapeHtmlStatusKhusus(siswa.kelas) +
        "</span>";

}


function escapeHtmlStatusKhusus(value){

    return String(value || "")
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;")
        .replace(/"/g,"&quot;")
        .replace(/'/g,"&#039;");

}


function tampilPesanStatusKhusus(pesan, tipe){

    const el =
        document.getElementById("statusKhususPesan");

    if(!el){
        return;
    }

    el.innerHTML =
        escapeHtmlStatusKhusus(pesan || "");

    el.className =
        "status-khusus-pesan " +
        (tipe || "");

}


async function simpanStatusKhususDariDashboard(){

    if(statusKhususSedangDisimpan){
        return;
    }

    const select =
        document.getElementById("statusKhususSiswa");

    const tombol =
        document.getElementById("btnSimpanStatusKhusus");

    if(!select || !tombol){
        return;
    }

    const kode = select.value;

    if(!kode){

        tampilPesanStatusKhusus(
            "Silakan pilih siswa terlebih dahulu.",
            "error"
        );

        select.focus();
        return;

    }

    const siswa =
        daftarSiswaStatusKhusus.find(
            function(item){
                return item.kode === kode;
            }
        );

    const nama =
        siswa ? siswa.nama : kode;

    statusKhususSedangDisimpan = true;

    select.disabled = true;
    tombol.disabled = true;
    tombol.innerHTML = "MENYIMPAN...";

    tampilPesanStatusKhusus(
        "Mengirim data ke server...",
        "loading"
    );

    try{

        const hasil =
            await simpanStatusKhusus(
                kode,
                statusKhususAktif
            );

        if(!hasil || hasil.status !== "success"){

            throw new Error(
                hasil && hasil.pesan
                    ? hasil.pesan
                    : "Data gagal disimpan."
            );

        }

        tampilPesanStatusKhusus(
            nama +
            " berhasil dicatat sebagai " +
            statusKhususAktif +
            ".",
            "success"
        );

        // Kosongkan pilihan setelah berhasil.
        select.value = "";
        tampilkanPreviewStatusKhusus();

            // Server sudah mengonfirmasi sukses.
        // Lepaskan status loading terlebih dahulu, lalu paksa tutup popup.
        // Dashboard diperbarui setelah popup ditutup dan tidak di-await.
        statusKhususSedangDisimpan = false;

        tombol.disabled = false;
        select.disabled = false;

        tombol.innerHTML =
            statusKhususAktif === "Sakit"
                ? "SIMPAN SAKIT"
                : statusKhususAktif === "Terlambat"
                    ? "SIMPAN TERLAMBAT"
                    : "SIMPAN IZIN";

        // Paksa tutup agar tidak terhalang guard status loading.
        tutupStatusKhususModal(true);

        // Beri browser satu frame untuk menyelesaikan perubahan UI,
        // kemudian refresh dashboard di belakang layar.
        setTimeout(function(){

            muatRekapDashboard().catch(function(err){
                console.warn(
                    "Rekap berhasil disimpan, tetapi pembaruan dashboard tertunda:",
                    err
                );
            });

        }, 0);

    }
    catch(error){

        console.error(
            "Gagal menyimpan status khusus:",
            error
        );

        tampilPesanStatusKhusus(
            error.message ||
            "Tidak dapat menyimpan data.",
            "error"
        );

        statusKhususSedangDisimpan = false;
        select.disabled = false;
        tombol.disabled = false;
        tombol.innerHTML =
            statusKhususAktif === "Sakit"
                ? "SIMPAN SAKIT"
                : statusKhususAktif === "Terlambat"
                    ? "SIMPAN TERLAMBAT"
                    : "SIMPAN IZIN";

    }

}


function pasangEventStatusKhusus(){

    const terlambat =
        document.querySelector(".rekap-terlambat");

    const izin =
        document.querySelector(".rekap-izin");

    const sakit =
        document.querySelector(".rekap-sakit");

    const tutup =
        document.getElementById("btnTutupStatusKhusus");

    const batal =
        document.getElementById("btnBatalStatusKhusus");

    const select =
        document.getElementById("statusKhususSiswa");

    const simpan =
        document.getElementById("btnSimpanStatusKhusus");


    if(terlambat){

        terlambat.addEventListener(
            "click",
            function(){
                bukaStatusKhususModal("Terlambat");
            }
        );

        terlambat.setAttribute(
            "role",
            "button"
        );

        terlambat.setAttribute(
            "tabindex",
            "0"
        );

        terlambat.style.cursor = "pointer";

    }


    if(izin){

        izin.addEventListener(
            "click",
            function(){
                bukaStatusKhususModal("Izin");
            }
        );

        izin.setAttribute(
            "role",
            "button"
        );

        izin.setAttribute(
            "tabindex",
            "0"
        );

    }


    if(sakit){

        sakit.addEventListener(
            "click",
            function(){
                bukaStatusKhususModal("Sakit");
            }
        );

        sakit.setAttribute(
            "role",
            "button"
        );

        sakit.setAttribute(
            "tabindex",
            "0"
        );

    }


    if(tutup){

        tutup.addEventListener(
            "click",
            tutupStatusKhususModal
        );

    }


    if(batal){

        batal.addEventListener(
            "click",
            tutupStatusKhususModal
        );

    }


    if(select){

        select.addEventListener(
            "change",
            tampilkanPreviewStatusKhusus
        );

    }


    if(simpan){

        simpan.addEventListener(
            "click",
            simpanStatusKhususDariDashboard
        );

    }


    const modal =
        document.getElementById("statusKhususModal");

    if(modal){

        modal.addEventListener(
            "click",
            function(event){

                if(event.target === modal){
                    tutupStatusKhususModal();
                }

            }
        );

    }


    document.addEventListener(
        "keydown",
        function(event){

            if(event.key === "Escape"){
                tutupStatusKhususModal();
            }

        }
    );

}


window.addEventListener(
    "load",
    pasangEventStatusKhusus
);

