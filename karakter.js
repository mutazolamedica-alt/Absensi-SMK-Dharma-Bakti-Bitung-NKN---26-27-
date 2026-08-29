/* =========================================================
   WE ARE NAUTIKA'10
   PERSONAL CHARACTER DECK
   karakter.js — FINAL
   ========================================================= */

(function () {
    "use strict";

    const deck = document.getElementById("deck");
    const loading = document.getElementById("loadingDeck");
    const empty = document.getElementById("emptyDeck");
    const jumlah = document.getElementById("jumlahSiswa");


    /* =========================================================
       PLACEHOLDER CHARACTER
       ========================================================= */

    const PLACEHOLDER_IMAGE =
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg"
                 width="600"
                 height="760"
                 viewBox="0 0 600 760">

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
                    height="760"
                    fill="url(#g)"/>

                <circle
                    cx="300"
                    cy="275"
                    r="105"
                    fill="#9fc5f5"/>

                <path
                    d="M125 690c20-150 105-215 175-215s155 65 175 215"
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


    /* =========================================================
       SECURITY
       ========================================================= */

    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    /* =========================================================
       ANGKA
       ========================================================= */

    function angka(value) {

        const n = Number(value);

        return Number.isFinite(n)
            ? n
            : 0;
    }


    /* =========================================================
       FORMAT PERSENTASE
       ========================================================= */

    function formatPersentase(value) {

        let n = angka(value);

        /*
         * Jika API mengirim:
         *
         * 0.85  → 85%
         *
         * Jika API mengirim:
         *
         * 85    → 85%
         */

        if (n > 0 && n <= 1) {
            n = n * 100;
        }

        return (
            n.toFixed(
                n % 1 === 0
                    ? 0
                    : 1
            ) + "%"
        );
    }


    /* =========================================================
       NORMALISASI DATA SISWA
       ========================================================= */

    function normalisasiSiswa(item) {

        if (!item) {
            return null;
        }

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
                angka(item.hadir),

            terlambat:
                angka(item.terlambat),

            izin:
                angka(item.izin),

            sakit:
                angka(item.sakit),

            alpa:
                angka(item.alpa),

            totalSkor:
                angka(item.totalSkor),

            persentase:
                item.persentase,

            foto:
                item.foto ??
                item.photo ??
                item.image ??
                ""

        };
    }


    /* =========================================================
       SUMBER FOTO
       ========================================================= */

    function sumberFoto(siswa) {

        if (siswa.foto) {
            return String(siswa.foto);
        }

        return PLACEHOLDER_IMAGE;
    }


    /* =========================================================
       BUAT CHARACTER CARD
       ========================================================= */

    function buatKartu(siswa, index) {

        const nomor =
            String(index + 1).padStart(2, "0");


        /*
         * =====================================================
         * ATURAN ABSENSI
         *
         * HADIR = HADIR + TERLAMBAT
         *
         * TERLAMBAT TIDAK DITAMPILKAN
         * =====================================================
         */

        const hadirTotal =
            siswa.hadir +
            siswa.terlambat;


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
            `Buka karakter ${siswa.nama}`
        );


        card.innerHTML = `

            <div class="card-inner">


                <!-- =================================================
                     FRONT CARD
                     ================================================= -->

                <div class="card-face card-front">


                    <img
                        class="character-photo"
                        src="${escapeHTML(
                            sumberFoto(siswa)
                        )}"
                        alt="Character ${escapeHTML(
                            siswa.nama
                        )}"
                        loading="lazy"
                        draggable="false">
                        

                </div>


<!-- ================= BACK ================= -->

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


    <!-- =========================================
         STATUS ABSENSI
         HADIR = HADIR + TERLAMBAT
         ========================================= -->

    <div class="stats">


        <!-- HADIR -->

        <div class="stat hadir">

            <strong>
                ${hadirTotal}
            </strong>

            <span>
                HADIR
            </span>

        </div>


        <!-- IZIN -->

        <div class="stat izin">

            <strong>
                ${siswa.izin}
            </strong>

            <span>
                IZIN
            </span>

        </div>


        <!-- SAKIT -->

        <div class="stat sakit">

            <strong>
                ${siswa.sakit}
            </strong>

            <span>
                SAKIT
            </span>

        </div>


        <!-- ALPA -->

        <div class="stat alpa">

            <strong>
                ${siswa.alpa}
            </strong>

            <span>
                ALPA
            </span>

        </div>


    </div>


    <!-- =========================================
         HASIL AKHIR
         FULL WIDTH
         ========================================= -->

    <div class="back-result">


        <!-- KEHADIRAN -->

        <div class="result-box">

            <strong>
                ${formatPersentase(
                    siswa.persentase
                )}
            </strong>

            <span>
                KEHADIRAN
            </span>

        </div>


        <!-- TOTAL SKOR -->

        <div class="result-box">

            <strong>
                ${siswa.totalSkor}
            </strong>

            <span>
                TOTAL SKOR
            </span>

        </div>


    </div>

</div>

        /* =========================================================
           FLIP CARD
           ========================================================= */

        function toggleCard(event) {

            /*
             * Supaya jika suatu saat ada button/link
             * di dalam card, elemen tersebut tidak ikut
             * menyebabkan flip.
             */

            if (
                event &&
                event.target &&
                event.target.closest &&
                event.target.closest(
                    "a, button"
                )
            ) {
                return;
            }


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

                    toggleCard(event);
                }
            }
        );


        return card;
    }


    /* =========================================================
       AMBIL CHARACTER CARDS
       
       PENTING:
       Character Deck TIDAK menggunakan
       ambilDaftarSiswa().
       
       Langsung:
       
       ?action=characterCards
       ========================================================= */

    async function ambilCharacterCards() {


        if (
            typeof URL_WEB_APP ===
                "undefined" ||
            !URL_WEB_APP
        ) {

            throw new Error(
                "URL_WEB_APP tidak ditemukan. Pastikan api.js dimuat sebelum karakter.js."
            );
        }


        const separator =
            URL_WEB_APP.includes("?")
                ? "&"
                : "?";


        const url =
            URL_WEB_APP +
            separator +
            "action=characterCards" +
            "&_=" +
            Date.now();


        const response =
            await fetch(
                url,
                {
                    method: "GET",
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                `Gagal mengambil Character Card (${response.status}).`
            );
        }


        const data =
            await response.json();


        console.log(
            "CHARACTER CARDS:",
            data
        );


        if (
            !data ||
            data.status !== "success"
        ) {

            throw new Error(
                data?.pesan ||
                "Data Character Card gagal dimuat."
            );
        }


        return data;
    }


    /* =========================================================
       TAMPILKAN CHARACTER CARDS
       ========================================================= */

    function tampilkanCharacterCards(data) {

        let daftar = [];


        /*
         * Format utama dari Code.gs:
         *
         * {
         *   status: "success",
         *   total: ...,
         *   siswa: [...]
         * }
         */

        if (
            data &&
            Array.isArray(
                data.siswa
            )
        ) {

            daftar =
                data.siswa;

        }


        /*
         * Fallback
         */

        else if (
            Array.isArray(data)
        ) {

            daftar = data;

        }


        else if (
            data &&
            Array.isArray(
                data.data
            )
        ) {

            daftar =
                data.data;

        }


        else if (
            data &&
            Array.isArray(
                data.daftarSiswa
            )
        ) {

            daftar =
                data.daftarSiswa;
        }



        const siswa =
            daftar

                .map(
                    normalisasiSiswa
                )

                .filter(Boolean)

                .filter(
                    item =>
                        item.nama
                );


        /*
         * Bersihkan deck
         */

        deck.innerHTML = "";


        /*
         * Jumlah siswa
         */

        jumlah.textContent =
            `${siswa.length} SISWA`;


        /*
         * Matikan loading
         */

        loading.classList.add(
            "hidden"
        );


        /*
         * Jika kosong
         */

        if (
            siswa.length === 0
        ) {

            empty.classList.remove(
                "hidden"
            );

            empty.textContent =
                "Data Character Deck belum tersedia.";

            return;
        }


        /*
         * Sembunyikan pesan kosong
         */

        empty.classList.add(
            "hidden"
        );


        /*
         * Buat seluruh card
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
       INIT
       ========================================================= */

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


            /*
             * Ambil data khusus Character Card
             */

            const data =
                await ambilCharacterCards();


            /*
             * Render card
             */

            tampilkanCharacterCards(
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
                "Character Deck belum dapat dimuat. Periksa API / deployment Apps Script.";


            jumlah.textContent =
                "0 SISWA";
        }
    }


    /* =========================================================
       START
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
