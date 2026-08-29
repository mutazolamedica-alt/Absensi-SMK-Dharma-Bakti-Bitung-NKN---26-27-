/* =========================================================
   WE ARE NAUTIKA'10
   PERSONAL CHARACTER DECK
   KARAKTER.JS — FINAL
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       KONFIGURASI
       ===================================================== */

    const API_URL =
        typeof window.API_URL === "string" &&
        window.API_URL.trim() !== ""
            ? window.API_URL.trim()
            : "";


    /*
     * Artwork Character Card.
     *
     * Format:
     *
     * "KODE": "nama-file-gambar"
     *
     * Untuk sekarang baru NKN028.
     */

    const CHARACTER_IMAGES = {

        "NKN028":
            "karakter/NKN028.png"

    };


    /*
     * Jika artwork belum tersedia,
     * gunakan placeholder.
     */

    const PLACEHOLDER_IMAGE =
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(`

            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1500"
                height="2100"
                viewBox="0 0 1500 2100">

                <rect
                    width="1500"
                    height="2100"
                    fill="#eaf2f8"/>

                <text
                    x="750"
                    y="1030"
                    text-anchor="middle"
                    font-family="Arial"
                    font-size="90"
                    font-weight="700"
                    fill="#78909c">
                    CHARACTER
                </text>

                <text
                    x="750"
                    y="1140"
                    text-anchor="middle"
                    font-family="Arial"
                    font-size="48"
                    fill="#90a4ae">
                    ARTWORK COMING SOON
                </text>

            </svg>

        `);


    /* =====================================================
       ELEMENT HTML
       ===================================================== */

    const deck =
        document.getElementById("deck");

    const loadingDeck =
        document.getElementById("loadingDeck");

    const emptyDeck =
        document.getElementById("emptyDeck");

    const jumlahSiswa =
        document.getElementById("jumlahSiswa");


    /* =====================================================
       UTILITY
       ===================================================== */

    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    function normalisasiKode(value) {

        return String(value ?? "")
            .trim()
            .toUpperCase();

    }


    function angka(value) {

        const n =
            Number(value);

        return Number.isFinite(n)
            ? n
            : 0;

    }


    function formatPersentase(value) {

        const n =
            angka(value);


        /*
         * Google Sheets percentage biasanya
         * dikirim sebagai decimal:
         *
         * 0.95 = 95%
         *
         * Tetapi apabila API sudah mengirim
         * 95, kita tidak mengalikannya lagi.
         */

        const persen =
            n <= 1 && n > 0
                ? n * 100
                : n;


        if (
            Number.isInteger(persen)
        ) {

            return persen + "%";

        }


        return persen
            .toFixed(1)
            .replace(".", ",") + "%";

    }


    /* =====================================================
       AMBIL API URL
       ===================================================== */

    function getCharacterAPIUrl() {

        /*
         * Prioritas:
         *
         * 1. API_URL dari api.js
         * 2. window.API_URL
         *
         */

        if (
            API_URL
        ) {

            return API_URL;

        }


        /*
         * Jika api.js menggunakan variabel
         * global API_URL.
         */

        if (
            typeof window.API_URL ===
            "string" &&
            window.API_URL.trim() !== ""
        ) {

            return window.API_URL.trim();

        }


        throw new Error(
            "API_URL tidak ditemukan. " +
            "Pastikan api.js dimuat sebelum karakter.js."
        );

    }


    /* =====================================================
       AMBIL DATA CHARACTER CARD
       ===================================================== */

    async function ambilCharacterCards() {

        const url =
            getCharacterAPIUrl();


        const separator =
            url.includes("?")
                ? "&"
                : "?";


        const response =
            await fetch(
                url +
                separator +
                "action=characterCards",
                {
                    method:"GET",
                    cache:"no-store"
                }
            );


        if (
            !response.ok
        ) {

            throw new Error(
                "Server Character Card gagal merespons. " +
                "HTTP " +
                response.status
            );

        }


        const data =
            await response.json();


        if (
            !data ||
            data.status !== "success"
        ) {

            throw new Error(
                data?.pesan ||
                "Data Character Card tidak valid."
            );

        }


        return data;

    }


    /* =====================================================
       NORMALISASI DATA SISWA
       ===================================================== */

    function normalisasiSiswa(item) {

        return {

            kode:
                normalisasiKode(
                    item?.kode
                ),

            nama:
                String(
                    item?.nama || ""
                ).trim(),

            kelas:
                String(
                    item?.kelas || ""
                ).trim(),

            hadir:
                angka(
                    item?.hadir
                ),

            izin:
                angka(
                    item?.izin
                ),

            sakit:
                angka(
                    item?.sakit
                ),

            alpa:
                angka(
                    item?.alpa
                ),

            totalSkor:
                angka(
                    item?.totalSkor
                ),

            persentase:
                item?.persentase ?? 0

        };

    }


    /* =====================================================
       BUAT FRONT CARD
       
       FRONT HANYA ARTWORK.
       
       TIDAK ADA:
       - nama
       - kelas
       - kode
       - statistik
       - tombol
       ===================================================== */

    function buatFrontCard(siswa) {

        const kode =
            normalisasiKode(
                siswa.kode
            );


        const artwork =
            CHARACTER_IMAGES[kode] ||
            PLACEHOLDER_IMAGE;


        return `

            <div class="card-face card-front">

                <img
                    class="character-photo"
                    src="${escapeHTML(artwork)}"
                    alt="Character ${escapeHTML(siswa.nama)}"
                    loading="lazy">

            </div>

        `;

    }


    /* =====================================================
       BUAT BACK CARD
       ===================================================== */

    function buatBackCard(siswa) {

        return `

            <div class="card-face card-back">

                <div class="back-top">

                    <span class="back-number">
                        ${escapeHTML(siswa.kode)}
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


                    <!-- HADIR
                         HADIR + TERLAMBAT
                         sudah digabung oleh Code.gs
                    -->

                    <div class="stat hadir">

                        <strong>
                            ${siswa.hadir}
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


                    <!-- PERSENTASE -->

                    <div class="stat">

                        <strong>
                            ${formatPersentase(
                                siswa.persentase
                            )}
                        </strong>

                        <span>
                            KEHADIRAN
                        </span>

                    </div>

                </div>


                <!-- TOTAL SKOR -->

                <div class="score-row">

                    <span>
                        TOTAL SKOR
                    </span>

                    <strong>
                        ${siswa.totalSkor}
                    </strong>

                </div>

            </div>

        `;

    }


    /* =====================================================
       BUAT SATU CHARACTER CARD
       ===================================================== */

    function buatCard(
        siswa,
        index
    ) {

        const card =
            document.createElement(
                "article"
            );


        card.className =
            "character-card";


        card.dataset.kode =
            siswa.kode;


        card.tabIndex =
            0;


        card.setAttribute(
            "role",
            "button"
        );


        card.setAttribute(
            "aria-label",
            `Character Card ${siswa.nama}`
        );


        card.innerHTML = `

            <div class="card-inner">

                ${buatFrontCard(siswa)}

                ${buatBackCard(siswa)}

            </div>

        `;


        /* =================================================
           FLIP
           ================================================= */

        function flipCard() {

            card.classList.toggle(
                "flipped"
            );

        }


        card.addEventListener(
            "click",
            function () {

                flipCard();

            }
        );


        card.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    flipCard();

                }

            }
        );


        return card;

    }


    /* =====================================================
       RENDER SEMUA SISWA
       ===================================================== */

    function renderDeck(
        data
    ) {

        const daftar =
            Array.isArray(data.siswa)
                ? data.siswa
                : [];


        deck.innerHTML =
            "";


        jumlahSiswa.textContent =
            `${daftar.length} SISWA`;


        if (
            daftar.length === 0
        ) {

            loadingDeck.classList.add(
                "hidden"
            );

            emptyDeck.classList.remove(
                "hidden"
            );

            emptyDeck.textContent =
                "Daftar siswa belum tersedia.";

            return;

        }


        emptyDeck.classList.add(
            "hidden"
        );


        loadingDeck.classList.add(
            "hidden"
        );


        daftar.forEach(
            function (
                rawSiswa,
                index
            ) {

                const siswa =
                    normalisasiSiswa(
                        rawSiswa
                    );


                deck.appendChild(
                    buatCard(
                        siswa,
                        index
                    )
                );

            }
        );

    }


    /* =====================================================
       ERROR STATE
       ===================================================== */

    function tampilError(
        error
    ) {

        console.error(
            "Character Deck:",
            error
        );


        loadingDeck.classList.add(
            "hidden"
        );


        emptyDeck.classList.remove(
            "hidden"
        );


        emptyDeck.textContent =
            "Data Character Deck belum dapat dimuat.";


        jumlahSiswa.textContent =
            "0 SISWA";

    }


    /* =====================================================
       INIT
       ===================================================== */

    async function init() {

        try {

            loadingDeck.classList.remove(
                "hidden"
            );


            emptyDeck.classList.add(
                "hidden"
            );


            const data =
                await ambilCharacterCards();


            renderDeck(
                data
            );

        }

        catch(error) {

            tampilError(
                error
            );

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
