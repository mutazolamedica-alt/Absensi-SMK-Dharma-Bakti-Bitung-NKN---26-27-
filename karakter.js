/* =========================================================
   WE ARE NAUTIKA'10
   PERSONAL CHARACTER DECK
   karakter.js — FINAL
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       ELEMENT HTML
       ===================================================== */

    const deck =
        document.getElementById("deck");

    const loading =
        document.getElementById("loadingDeck");

    const empty =
        document.getElementById("emptyDeck");

    const jumlah =
        document.getElementById("jumlahSiswa");


    /* =====================================================
       CHARACTER IMAGE DATABASE
       =====================================================

       TEMPAT MENDAFTARKAN GAMBAR CHARACTER.

       FORMAT:

       "NKN028":
           "nama-file-gambar.jpg"

       Nanti setiap character card cukup ditambahkan
       berdasarkan KODE siswa.

       Contoh:

       "NKN028": "trifosa.jpg",
       "NKN029": "siswa-2.jpg",

       Untuk sementara NKN028 menggunakan placeholder
       sampai file artwork Character Card dimasukkan.
       ===================================================== */

    const CHARACTER_IMAGES = {

        /*
         * STUDENT CARD 1
         * TRIFOSA
         * KODE: NKN028
         *
         * Setelah artwork final Trifosa tersedia di GitHub,
         * cukup ubah value di bawah menjadi nama file gambar.
         *
         * Contoh:
         * "NKN028": "NKN028.png"
         */

        "NKN028": "NKN028.png",

    };


    /* =====================================================
       PLACEHOLDER
       ===================================================== */

    const PLACEHOLDER_IMAGE =
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(`
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="600"
                height="760"
                viewBox="0 0 600 760">

                <defs>

                    <linearGradient
                        id="characterPlaceholderGradient"
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
                    height="760"
                    fill="url(#characterPlaceholderGradient)"/>

                <circle
                    cx="300"
                    cy="275"
                    r="105"
                    fill="#9fc5f5"/>

                <path
                    d="M125 690
                       c20-150
                       105-215
                       175-215
                       s155 65
                       175 215"
                    fill="#6b9fe1"/>

                <text
                    x="300"
                    y="730"
                    text-anchor="middle"
                    font-family="Arial"
                    font-size="26"
                    font-weight="700"
                    fill="#4773a9">

                    CHARACTER

                </text>

            </svg>
        `);


    /* =====================================================
       HELPER
       ===================================================== */

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

        if (!Number.isFinite(n)) {
            return 0;
        }

        return n;

    }


    function formatPersentase(value) {

        const n = Number(value);

        if (!Number.isFinite(n)) {
            return "0%";
        }

        /*
         * Jika API mengirim 0.95 → 95%
         * Jika API mengirim 95 → 95%
         */

        const persen =
            n > 0 && n <= 1
                ? n * 100
                : n;

        return (
            Math.round(persen * 10) / 10
        ) + "%";

    }


    /* =====================================================
       NORMALISASI DATA SISWA
       ===================================================== */

    function normalisasiSiswa(item) {

        if (!item) {
            return null;
        }

        if (typeof item === "string") {

            return {

                kode: item,

                nama: item,

                kelas: "-",

                hadir: 0,

                terlambat: 0,

                izin: 0,

                sakit: 0,

                alpa: 0,

                totalSkor: 0,

                persentase: 0

            };

        }


        const hadir =
            angka(
                item.hadir ??
                item.Hadir ??
                0
            );


        const terlambat =
            angka(
                item.terlambat ??
                item.Terlambat ??
                0
            );


        /*
         * PENTING:
         *
         * HADIR di Character Card =
         * HADIR + TERLAMBAT
         *
         * Terlambat tidak ditampilkan
         * sebagai kategori terpisah.
         */

        const hadirGabungan =
            hadir + terlambat;


        return {

            kode:
                String(
                    item.kode ??
                    item.Kode ??
                    item.nis ??
                    item.NIS ??
                    item.id ??
                    ""
                ).trim(),


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


            hadir:
                hadirGabungan,


            /*
             * Tetap disimpan untuk debugging/
             * kompatibilitas, tetapi TIDAK ditampilkan.
             */

            terlambat,


            izin:
                angka(
                    item.izin ??
                    item.Izin ??
                    0
                ),


            sakit:
                angka(
                    item.sakit ??
                    item.Sakit ??
                    0
                ),


            alpa:
                angka(
                    item.alpa ??
                    item.Alpa ??
                    0
                ),


            totalSkor:
                angka(
                    item.totalSkor ??
                    item.total_skor ??
                    item.totalScore ??
                    item.TotalSkor ??
                    0
                ),


            persentase:
                angka(
                    item.persentase ??
                    item.percentage ??
                    item.Persentase ??
                    0
                )

        };

    }


    /* =====================================================
       AMBIL GAMBAR CHARACTER
       ===================================================== */

    function getCharacterImage(kode) {

        const key =
            String(kode || "").trim();


        if (
            CHARACTER_IMAGES[key] &&
            String(CHARACTER_IMAGES[key]).trim()
        ) {

            return String(
                CHARACTER_IMAGES[key]
            ).trim();

        }


        return PLACEHOLDER_IMAGE;

    }


    /* =====================================================
       BUAT CARD
       ===================================================== */

    function buatKartu(siswa, index) {

        const nomor =
            String(index + 1)
                .padStart(2, "0");


        const card =
            document.createElement("article");


        card.className =
            "character-card";


        card.tabIndex = 0;


        card.setAttribute(
            "role",
            "button"
        );


        card.setAttribute(
            "aria-label",
            `Buka kartu karakter ${siswa.nama}`
        );


        const characterImage =
            getCharacterImage(
                siswa.kode
            );


        /* =================================================
           FRONT CARD
           =================================================

           SENGAJA TIDAK ADA:

           - Nama
           - Kelas
           - Nomor siswa
           - Identitas lainnya

           PURE ARTWORK CHARACTER.
           ================================================= */

        card.innerHTML = `

            <div class="card-inner">


                <!-- =====================================
                     FRONT
                     ===================================== -->

                <div class="card-face card-front">


                    <img
                        class="character-photo"
                        src="${escapeHTML(characterImage)}"
                        alt="Character ${escapeHTML(siswa.nama)}"
                        loading="lazy">


                </div>



                <!-- =====================================
                     BACK
                     ===================================== -->

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



                    <!-- =================================
                         STATISTIK KEHADIRAN
                         ================================= -->

                    <div class="stats">


                        <!-- HADIR
                             HADIR + TERLAMBAT -->

                        <div class="stat hadir">

                            <strong>
                                ${angka(siswa.hadir)}
                            </strong>

                            <span>
                                HADIR
                            </span>

                        </div>


                        <!-- IZIN -->

                        <div class="stat izin">

                            <strong>
                                ${angka(siswa.izin)}
                            </strong>

                            <span>
                                IZIN
                            </span>

                        </div>


                        <!-- SAKIT -->

                        <div class="stat sakit">

                            <strong>
                                ${angka(siswa.sakit)}
                            </strong>

                            <span>
                                SAKIT
                            </span>

                        </div>


                        <!-- ALPA -->

                        <div class="stat alpa">

                            <strong>
                                ${angka(siswa.alpa)}
                            </strong>

                            <span>
                                ALPA
                            </span>

                        </div>


                    </div>



                    <!-- =================================
                         KEHADIRAN
                         ================================= -->

                    <div class="back-result">

                        <div class="result-box">

                            <span>
                                KEHADIRAN
                            </span>

                            <strong>
                                ${formatPersentase(
                                    siswa.persentase
                                )}
                            </strong>

                        </div>



                        <!-- =================================
                             TOTAL SKOR
                             ================================= -->

                        <div class="result-box">

                            <span>
                                TOTAL SKOR
                            </span>

                            <strong>
                                ${angka(
                                    siswa.totalSkor
                                )}
                            </strong>

                        </div>

                    </div>


                </div>

            </div>

        `;


        /* =================================================
           FLIP CARD
           ================================================= */

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


    /* =====================================================
       NORMALISASI RESPONSE API
       ===================================================== */

    function ambilArraySiswa(data) {

        if (Array.isArray(data)) {

            return data;

        }


        if (
            data &&
            Array.isArray(data.siswa)
        ) {

            return data.siswa;

        }


        if (
            data &&
            Array.isArray(data.data)
        ) {

            return data.data;

        }


        if (
            data &&
            Array.isArray(data.daftarSiswa)
        ) {

            return data.daftarSiswa;

        }


        if (
            data &&
            Array.isArray(data.result)
        ) {

            return data.result;

        }


        return [];

    }


    /* =====================================================
       TAMPILKAN DECK
       ===================================================== */

    function tampilkanSiswa(data) {

        const daftar =
            ambilArraySiswa(data);


        const siswa =
            daftar
                .map(normalisasiSiswa)
                .filter(Boolean)
                .filter(
                    item =>
                        item.kode &&
                        item.nama
                );


        deck.innerHTML = "";


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

            empty.textContent =
                "Daftar siswa belum tersedia.";

            return;

        }


        empty.classList.add(
            "hidden"
        );


        siswa.forEach(
            function (item, index) {

                deck.appendChild(
                    buatKartu(
                        item,
                        index
                    )
                );

            }
        );

    }


    /* =====================================================
       API CHARACTER CARD
       =====================================================

       PENTING:

       Kita langsung memanggil:

       ?action=characterCards

       BUKAN:

       ?action=daftarSiswa

       Karena Character Deck membutuhkan:

       - nama
       - kelas
       - hadir
       - terlambat
       - izin
       - sakit
       - alpa
       - total skor
       - persentase

       Endpoint characterCards memang sudah tersedia
       di Code.gs.
       ===================================================== */

    async function ambilCharacterCards() {

        /*
         * api.js sudah dimuat lebih dahulu oleh
         * karakter.html.
         *
         * URL_WEB_APP berasal dari api.js.
         */

        const baseURL =
            typeof URL_WEB_APP !== "undefined"
                ? URL_WEB_APP
                : "";


        if (!baseURL) {

            throw new Error(
                "URL_WEB_APP tidak ditemukan."
            );

        }


        const separator =
            baseURL.includes("?")
                ? "&"
                : "?";


        const url =
            baseURL +
            separator +
            "action=characterCards" +
            "&_=" +
            Date.now();


        const response =
            await fetch(
                url,
                {
                    method: "GET",

                    cache: "no-store",

                    headers: {
                        "Accept":
                            "application/json"
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                `Server API error: ${response.status}`
            );

        }


        const data =
            await response.json();


        console.log(
            "CHARACTER CARDS API:",
            data
        );


        if (
            !data ||
            data.status !== "success"
        ) {

            throw new Error(
                data &&
                data.pesan
                    ? data.pesan
                    : "Data Character Card gagal dimuat."
            );

        }


        return data;

    }


    /* =====================================================
       INIT
       ===================================================== */

    async function init() {

        try {

            loading.classList.remove(
                "hidden"
            );

            empty.classList.add(
                "hidden"
            );


            jumlah.textContent =
                "MEMUAT...";


            const data =
                await ambilCharacterCards();


            tampilkanSiswa(data);


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
                "Character Deck gagal dimuat. Periksa koneksi API ABSENKU.";


            jumlah.textContent =
                "0 SISWA";

        }

    }


    /* =====================================================
       START
       ===================================================== */

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
