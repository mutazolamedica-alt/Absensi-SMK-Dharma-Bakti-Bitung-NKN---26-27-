/* =========================================================
   WE ARE NAUTIKA'10
   PERSONAL CHARACTER DECK — FINAL

   FRONT CARD : PURE CHARACTER ARTWORK ONLY
   BACK CARD  : IDENTITY + ATTENDANCE SUMMARY

   CARA MENAMBAHKAN ARTWORK SISWA BERIKUTNYA:
   Tambahkan 1 baris pada CHARACTER_IMAGES menggunakan KODE siswa.

   Contoh:
   "NKN029": "karakter/NKN029.png",
   ========================================================= */

(function () {
    "use strict";

    const deck = document.getElementById("deck");
    const loading = document.getElementById("loadingDeck");
    const empty = document.getElementById("emptyDeck");
    const jumlah = document.getElementById("jumlahSiswa");


    /* =========================================================
       1. DATABASE ARTWORK CHARACTER
       =========================================================

       Gunakan KODE siswa sebagai kunci.

       NKN028 = TRIFOSA / TREASURER
       ========================================================= */

    const CHARACTER_IMAGES = {
        "NKN028": "karakter/NKN028.png"
    };


    /* =========================================================
       2. PLACEHOLDER
       ========================================================= */

    const PLACEHOLDER_IMAGE =
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg"
                 width="600"
                 height="840"
                 viewBox="0 0 600 840">

                <defs>
                    <linearGradient
                        id="g"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="1">

                        <stop
                            offset="0%"
                            stop-color="#dcecff"/>

                        <stop
                            offset="100%"
                            stop-color="#f6faff"/>
                    </linearGradient>
                </defs>

                <rect
                    width="600"
                    height="840"
                    fill="url(#g)"/>

                <circle
                    cx="300"
                    cy="290"
                    r="105"
                    fill="#9fc5f5"/>

                <path
                    d="M120 760c22-155 108-225 180-225s158 70 180 225"
                    fill="#6b9fe1"/>

                <text
                    x="300"
                    y="805"
                    text-anchor="middle"
                    font-family="Arial, Helvetica, sans-serif"
                    font-size="26"
                    font-weight="700"
                    fill="#4773a9">
                    CHARACTER
                </text>

            </svg>
        `);


    /* =========================================================
       3. UTILITIES
       ========================================================= */

    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    function angka(value) {

        const n = Number(value);

        return Number.isFinite(n)
            ? n
            : 0;

    }


    function normalisasiKode(value) {

        return String(value ?? "")
            .trim()
            .toUpperCase();

    }


    /* =========================================================
       4. NORMALISASI DATA SISWA
       ========================================================= */

    function normalisasiSiswa(item) {

        if (!item) {
            return null;
        }


        if (typeof item === "string") {

            return {

                kode: normalisasiKode(item),

                nama: item,

                kelas: "-"

            };

        }


        return {

            kode:
                normalisasiKode(
                    item.kode ??
                    item.Kode ??
                    item.nis ??
                    item.NIS ??
                    item.id ??
                    ""
                ),

            nama:
                String(
                    item.nama ??
                    item.Nama ??
                    item.name ??
                    "Siswa"
                ).trim(),

            kelas:
                String(
                    item.kelas ??
                    item.Kelas ??
                    "-"
                ).trim(),

            statistik:
                normalisasiStatistik(
                    item.statistik ??
                    item.statistics ??
                    item.rekap ??
                    item.attendance ??
                    item.absensi ??
                    item
                )

        };

    }


    /* =========================================================
       5. NORMALISASI STATISTIK
       ========================================================= */

    function normalisasiStatistik(data) {

        if (
            !data ||
            typeof data !== "object"
        ) {

            return null;

        }


        const sumber =
            data.data &&
            typeof data.data === "object"

                ? data.data

                : data;


        const memilikiField = [

            "hadir",
            "Hadir",

            "terlambat",
            "Terlambat",

            "izin",
            "Izin",

            "sakit",
            "Sakit",

            "alpa",
            "Alpa",

            "kehadiran",
            "persentase",

            "totalSkor",
            "total_skor",

            "skor"

        ].some(function (key) {

            return Object.prototype.hasOwnProperty
                .call(sumber, key);

        });


        if (!memilikiField) {

            return null;

        }


        return {

            hadir:
                angka(
                    sumber.hadir ??
                    sumber.Hadir
                ),

            terlambat:
                angka(
                    sumber.terlambat ??
                    sumber.Terlambat
                ),

            izin:
                angka(
                    sumber.izin ??
                    sumber.Izin
                ),

            sakit:
                angka(
                    sumber.sakit ??
                    sumber.Sakit
                ),

            alpa:
                angka(
                    sumber.alpa ??
                    sumber.Alpa
                ),

            kehadiran:
                sumber.kehadiran ??
                sumber.persentase ??
                null,

            totalSkor:
                sumber.totalSkor ??
                sumber.total_skor ??
                sumber.skor ??
                null

        };

    }


    /* =========================================================
       6. PERHITUNGAN STATISTIK
       
       Sistem skor ABSENKU:
       
       Hadir      = 3
       Terlambat  = 3
       Izin       = 1
       Sakit      = 1
       Alpa       = 0
       ========================================================= */

    function hitungStatistik(statistik) {

        const s =
            statistik || {};


        const hadir =
            angka(s.hadir);


        const terlambat =
            angka(s.terlambat);


        const izin =
            angka(s.izin);


        const sakit =
            angka(s.sakit);


        const alpa =
            angka(s.alpa);


        const totalHari =
            hadir +
            terlambat +
            izin +
            sakit +
            alpa;


        let kehadiran =
            s.kehadiran;


        if (
            kehadiran === null ||
            kehadiran === undefined ||
            kehadiran === ""
        ) {

            kehadiran =
                totalHari > 0

                    ? (
                        (hadir + terlambat)
                        /
                        totalHari
                    ) * 100

                    : 0;

        }

        else {

            kehadiran =
                angka(kehadiran);


            if (kehadiran <= 1) {

                kehadiran *= 100;

            }

        }


        let totalSkor =
            s.totalSkor;


        if (
            totalSkor === null ||
            totalSkor === undefined ||
            totalSkor === ""
        ) {

            totalSkor =

                (hadir * 3) +

                (terlambat * 3) +

                (izin * 1) +

                (sakit * 1);

        }

        else {

            totalSkor =
                angka(totalSkor);

        }


        return {

            hadir,

            terlambat,

            izin,

            sakit,

            alpa,

            kehadiran,

            totalSkor

        };

    }


    /* =========================================================
       7. FUNGSI API STATISTIK
       
       Jika api.js memiliki salah satu fungsi di bawah,
       karakter.js akan menggunakannya secara otomatis.
       ========================================================= */

    const NAMA_FUNGSI_STATISTIK = [

        "ambilRekapSiswa",

        "ambilStatistikSiswa",

        "getRekapSiswa",

        "getStatistikSiswa",

        "ambilDataAbsensiSiswa",

        "getDataAbsensiSiswa"

    ];


    function cariFungsiStatistik() {

        for (
            const nama
            of NAMA_FUNGSI_STATISTIK
        ) {

            if (
                typeof window[nama] ===
                "function"
            ) {

                return window[nama];

            }

        }


        return null;

    }


    function panggilFungsiStatistik(
        fn,
        kode
    ) {

        return new Promise(
            function (
                resolve,
                reject
            ) {

                let selesai = false;


                function sukses(data) {

                    if (selesai) {
                        return;
                    }

                    selesai = true;

                    resolve(data);

                }


                function gagal(error) {

                    if (selesai) {
                        return;
                    }

                    selesai = true;

                    reject(error);

                }


                try {

                    const hasil =
                        fn(
                            kode,
                            sukses
                        );


                    /*
                     * Promise style
                     */

                    if (
                        hasil &&
                        typeof hasil.then ===
                        "function"
                    ) {

                        hasil
                            .then(sukses)
                            .catch(gagal);

                        return;

                    }


                    /*
                     * Synchronous return
                     */

                    if (
                        hasil !==
                        undefined
                    ) {

                        sukses(hasil);

                    }

                }

                catch (error) {

                    gagal(error);

                }

            }
        );

    }


    async function muatStatistikSiswa(
        siswa
    ) {

        /*
         * Jika statistik sudah ikut
         * dikirim bersama data siswa,
         * langsung gunakan.
         */

        if (siswa.statistik) {

            return hitungStatistik(
                siswa.statistik
            );

        }


        const fn =
            cariFungsiStatistik();


        /*
         * Jika API statistik belum tersedia,
         * kartu tetap tampil normal.
         */

        if (!fn) {

            return hitungStatistik(
                null
            );

        }


        try {

            const hasil =
                await panggilFungsiStatistik(
                    fn,
                    siswa.kode
                );


            return hitungStatistik(
                normalisasiStatistik(
                    hasil
                )
            );

        }

        catch (error) {

            console.warn(

                "Statistik tidak dapat dimuat untuk " +
                siswa.kode,

                error

            );


            return hitungStatistik(
                null
            );

        }

    }


    async function muatSemuaStatistik(
        siswa
    ) {

        /*
         * Semua request dijalankan paralel.
         * Tidak menunggu siswa 1 selesai
         * baru kemudian siswa 2.
         */

        const hasil =
            await Promise.all(

                siswa.map(
                    async function (item) {

                        item.statistikFinal =
                            await muatStatistikSiswa(
                                item
                            );

                        return item;

                    }
                )

            );


        return hasil;

    }


    /* =========================================================
       8. FORMAT PERSENTASE
       ========================================================= */

    function formatPersentase(
        value
    ) {

        const n =
            angka(value);


        if (n === 0) {

            return "0%";

        }


        return Number.isInteger(n)

            ? `${n}%`

            : `${n.toFixed(1)}%`;

    }


    /* =========================================================
       9. BUAT KARTU
       
       FRONT:
       PURE CHARACTER ARTWORK.
       
       Tidak ada:
       - nama
       - kelas
       - nomor
       - tombol
       - teks identitas
       
       BACK:
       - nama
       - kelas
       - statistik
       - total skor
       ========================================================= */

    function buatKartu(
        siswa,
        index
    ) {

        const nomor =
            String(index + 1)
                .padStart(2, "0");


        const statistik =
            hitungStatistik(
                siswa.statistikFinal
            );


        const kode =
            normalisasiKode(
                siswa.kode
            );


        const artwork =
            CHARACTER_IMAGES[kode] ||
            PLACEHOLDER_IMAGE;


        const card =
            document.createElement(
                "article"
            );


        card.className =
            "character-card";


        card.dataset.kode =
            kode;


        card.tabIndex =
            0;


        card.setAttribute(
            "role",
            "button"
        );


        card.setAttribute(

            "aria-label",

            `Buka informasi karakter ${siswa.nama}`

        );


        card.innerHTML = `

            <div class="card-inner">

                <!-- =========================
                     FRONT
                     PURE CHARACTER
                     ========================= -->

                <div class="card-face card-front">

                    <img
                        class="character-photo"
                        src="${escapeHTML(artwork)}"
                        alt="Character ${escapeHTML(siswa.nama)}"
                        loading="lazy">

                </div>


                <!-- =========================
                     BACK
                     IDENTITY + ATTENDANCE
                     ========================= -->

                <div class="card-face card-back">

                    <div class="back-top">

                        <span class="back-number">
                            STUDENT ${nomor}
                        </span>

                        <span
                            class="close-flip"
                            aria-hidden="true">
                            ↻
                        </span>

                    </div>


                    <h3 class="back-name">

                        ${escapeHTML(siswa.nama)}

                    </h3>


                    <div class="back-class">

                        ${escapeHTML(siswa.kelas)}

                    </div>


                    <div class="stats">

                        <div class="stat hadir">

                            <strong>
                                ${statistik.hadir}
                            </strong>

                            <span>
                                HADIR
                            </span>

                        </div>


                        <div class="stat terlambat">

                            <strong>
                                ${statistik.terlambat}
                            </strong>

                            <span>
                                TERLAMBAT
                            </span>

                        </div>


                        <div class="stat izin">

                            <strong>
                                ${statistik.izin}
                            </strong>

                            <span>
                                IZIN
                            </span>

                        </div>


                        <div class="stat sakit">

                            <strong>
                                ${statistik.sakit}
                            </strong>

                            <span>
                                SAKIT
                            </span>

                        </div>


                        <div class="stat alpa">

                            <strong>
                                ${statistik.alpa}
                            </strong>

                            <span>
                                ALPA
                            </span>

                        </div>


                        <div class="stat">

                            <strong>
                                ${formatPersentase(
                                    statistik.kehadiran
                                )}
                            </strong>

                            <span>
                                KEHADIRAN
                            </span>

                        </div>

                    </div>


                    <div class="score-row">

                        <span>
                            TOTAL SKOR
                        </span>

                        <strong>
                            ${statistik.totalSkor}
                        </strong>

                    </div>

                </div>

            </div>

        `;


        /* =====================================================
           FLIP CARD
           ===================================================== */

        function toggleCard() {

            card.classList.toggle(
                "flipped"
            );

        }


        card.addEventListener(
            "click",
            toggleCard
        );


        card.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    toggleCard();

                }

            }
        );


        return card;

    }


    /* =========================================================
       10. AMBIL DAFTAR SISWA
       ========================================================= */

    async function ambilDaftarSiswaDeck() {

        /*
         * API utama.
         */

        if (
            typeof window.ambilDaftarSiswa ===
            "function"
        ) {

            return await window.ambilDaftarSiswa();

        }


        /*
         * Fallback callback style.
         */

        if (
            typeof window.getDaftarSiswa ===
            "function"
        ) {

            return await new Promise(
                function (
                    resolve,
                    reject
                ) {

                    try {

                        window.getDaftarSiswa(
                            function (result) {

                                resolve(
                                    result
                                );

                            }
                        );

                    }

                    catch (error) {

                        reject(
                            error
                        );

                    }

                }
            );

        }


        throw new Error(

            "Fungsi API daftar siswa belum ditemukan. " +
            "Pastikan api.js dimuat sebelum karakter.js."

        );

    }


    /* =========================================================
       11. EKSTRAK DATA SISWA
       ========================================================= */

    function ekstrakDaftarSiswa(
        data
    ) {

        if (
            Array.isArray(data)
        ) {

            return data;

        }


        if (
            !data ||
            typeof data !== "object"
        ) {

            return [];

        }


        return (

            data.siswa ??

            data.data?.siswa ??

            data.data ??

            data.daftarSiswa ??

            data.result ??

            []

        );

    }


    /* =========================================================
       12. RENDER DECK
       ========================================================= */

    async function tampilkanSiswa(
        data
    ) {

        let daftar =
            ekstrakDaftarSiswa(
                data
            );


        if (
            !Array.isArray(daftar)
        ) {

            daftar = [];

        }


        const siswa =

            daftar

                .map(
                    normalisasiSiswa
                )

                .filter(
                    Boolean
                )

                .filter(
                    function (item) {

                        return (
                            item.kode &&
                            item.nama
                        );

                    }
                );


        deck.innerHTML =
            "";


        jumlah.textContent =
            `${siswa.length} SISWA`;


        loading.classList.add(
            "hidden"
        );


        if (
            siswa.length === 0
        ) {

            empty.classList.remove(
                "hidden"
            );

            return;

        }


        empty.classList.add(
            "hidden"
        );


        /*
         * Muat statistik seluruh siswa
         * secara paralel.
         */

        await muatSemuaStatistik(
            siswa
        );


        /*
         * Setelah data siap,
         * render seluruh kartu.
         */

        siswa.forEach(
            function (
                item,
                index
            ) {

                deck.appendChild(
                    buatKartu(
                        item,
                        index
                    )
                );

            }
        );

    }


    /* =========================================================
       13. INIT
       ========================================================= */

    async function init() {

        try {

            loading.classList.remove(
                "hidden"
            );


            empty.classList.add(
                "hidden"
            );


            const data =
                await ambilDaftarSiswaDeck();


            await tampilkanSiswa(
                data
            );

        }

        catch (error) {

            console.error(

                "Gagal memuat Character Deck:",

                error

            );


            loading.classList.add(
                "hidden"
            );


            empty.classList.remove(
                "hidden"
            );


            empty.textContent =

                "Daftar siswa belum dapat dimuat. " +
                "Periksa koneksi/API ABSENKU.";


            jumlah.textContent =
                "0 SISWA";

        }

    }


    /* =========================================================
       14. MULAI
       ========================================================= */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            init
        );

    }

    else {

        init();

    }

})();
