/* =========================================================
   WE ARE NAUTIKA'10
   PERSONAL CHARACTER DECK
   ========================================================= */

(function () {

    "use strict";


    // ========================================
    // URL WEB APP ABSENKU
    // ========================================

    const URL_WEB_APP =
        "https://script.google.com/macros/s/AKfycbz3KWlDE8ivAIhXLVyvDpjhKuUbbJ-LAm3s1Q-dha004ZRU2rXYNTZkbeHkBxRWWlA/exec";


    // ========================================
    // ELEMENT
    // ========================================

    const deck =
        document.getElementById("deck");

    const loading =
        document.getElementById("loadingDeck");

    const empty =
        document.getElementById("emptyDeck");

    const jumlah =
        document.getElementById("jumlahSiswa");


    // ========================================
    // PLACEHOLDER KARAKTER
    // NANTI DIGANTI KARAKTER AI
    // ========================================

    const PLACEHOLDER_IMAGE =
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(`

            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="600"
                height="760"
                viewBox="0 0 600 760"
            >

                <defs>

                    <linearGradient
                        id="g"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="1"
                    >

                        <stop
                            offset="0%"
                            stop-color="#dcecff"
                        />

                        <stop
                            offset="100%"
                            stop-color="#f6faff"
                        />

                    </linearGradient>

                </defs>


                <rect
                    width="600"
                    height="760"
                    fill="url(#g)"
                />


                <circle
                    cx="300"
                    cy="275"
                    r="105"
                    fill="#9fc5f5"
                />


                <path
                    d="
                        M125 690
                        c20-150
                        105-215
                        175-215
                        s155 65
                        175 215
                    "
                    fill="#6b9fe1"
                />


                <text
                    x="300"
                    y="730"
                    text-anchor="middle"
                    font-family="Arial"
                    font-size="26"
                    font-weight="700"
                    fill="#4773a9"
                >
                    CHARACTER
                </text>

            </svg>

        `);

/* =========================================================
   CHARACTER IMAGE CONFIG
   =========================================================
   Format:
   "KODE SISWA": "NAMA FILE GAMBAR"

   Jika belum ada artwork:
   gunakan null → otomatis memakai placeholder.

   Saat artwork sudah selesai, cukup ubah:
   null
   menjadi:
   "NKN001.png"
   ========================================================= */

const CHARACTER_IMAGES = {

    "NKN001": null,
    "NKN002": null,
    "NKN003": null,
    "NKN004": null,
    "NKN005": null,
    "NKN006": null,
    "NKN007": null,
    "NKN008": null,
    "NKN009": null,
    "NKN010": null,

    "NKN011": null,
    "NKN012": null,
    "NKN013": null,
    "NKN014": null,
    "NKN015": null,
    "NKN016": null,
    "NKN017": null,
    "NKN018": null,
    "NKN019": null,
    "NKN020": null,

    "NKN021": null,
    "NKN022": null,
    "NKN023": null,
    "NKN024": null,
    "NKN025": null,
    "NKN026": null,
    "NKN027": null,

    "NKN028": "NKN028.png",

    "NKN029": null,
    "NKN030": null
};


/* =========================================================
   AMBIL GAMBAR CHARACTER
   ========================================================= */

function getCharacterImage(kode) {

    const key = String(kode || "").trim();

    const image = CHARACTER_IMAGES[key];

    return image || PLACEHOLDER_IMAGE;
}
   
    // ========================================
    // ESCAPE HTML
    // ========================================

    function escapeHTML(value){

        return String(value ?? "")
            .replace(/&/g,"&amp;")
            .replace(/</g,"&lt;")
            .replace(/>/g,"&gt;")
            .replace(/"/g,"&quot;")
            .replace(/'/g,"&#039;");

    }


    // ========================================
    // FORMAT PERSENTASE
    // ========================================

    function formatPersentase(value){

        let angka =
            Number(value) || 0;


        /*
         * Rekap Bulanan menyimpan:
         *
         * 1     = 100%
         * 0.95  = 95%
         *
         * Jadi kita tampilkan x100.
         */

        if(angka <= 1){

            angka =
                angka * 100;

        }


        return angka
            .toFixed(2)
            .replace(".",",") + "%";

    }


    // ========================================
    // BUAT KARTU
    // ========================================

    function buatKartu(
        siswa,
        index
    ){

        const nomor =
            String(index + 1)
                .padStart(2,"0");


        const card =
            document.createElement("article");


        card.className =
            "character-card";


        card.tabIndex =
            0;


        card.setAttribute(
            "role",
            "button"
        );


        card.setAttribute(
            "aria-label",
            "Buka karakter " +
            siswa.nama
        );


        card.innerHTML = `

            <div class="card-inner">


               <div class="card-face card-front">
               
                   <img
                       class="character-photo"
                       src="${getCharacterImage(siswa.kode)}"
                       alt="Character ${escapeHTML(siswa.nama)}">
               
               </div>

                <!-- =========================
                     BELAKANG KARTU
                     ========================= -->

                <div class="card-face card-back">


                    <div class="back-top">

                        <span
                            class="back-number"
                        >

                            STUDENT ${nomor}

                        </span>


                        <span
                            class="close-flip"
                        >

                            ↻

                        </span>

                    </div>


                    <h3 class="back-name">

                        ${escapeHTML(
                            siswa.nama
                        )}

                    </h3>


                    <div class="back-class">

                        ${escapeHTML(
                            siswa.kelas
                        )}

                    </div>


                    <div class="stats">


                        <div class="stat hadir">

                            <strong>

                                ${Number(
                                    siswa.hadir
                                ) || 0}

                            </strong>

                            <span>

                                HADIR

                            </span>

                        </div>


                        <div class="stat terlambat">

                            <strong>

                                ${Number(
                                    siswa.terlambat
                                ) || 0}

                            </strong>

                            <span>

                                TERLAMBAT

                            </span>

                        </div>


                        <div class="stat izin">

                            <strong>

                                ${Number(
                                    siswa.izin
                                ) || 0}

                            </strong>

                            <span>

                                IZIN

                            </span>

                        </div>


                        <div class="stat sakit">

                            <strong>

                                ${Number(
                                    siswa.sakit
                                ) || 0}

                            </strong>

                            <span>

                                SAKIT

                            </span>

                        </div>


                        <div class="stat alpa">

                            <strong>

                                ${Number(
                                    siswa.alpa
                                ) || 0}

                            </strong>

                            <span>

                                ALPA

                            </span>

                        </div>


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


                    <div class="score-row">

                        <span>

                            TOTAL SKOR

                        </span>


                        <strong>

                            ${Number(
                                siswa.totalSkor
                            ) || 0}

                        </strong>

                    </div>


                </div>

            </div>

        `;


        // ====================================
        // FLIP
        // ====================================

        function toggleCard(){

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
            function(event){

                if(
                    event.key === "Enter" ||
                    event.key === " "
                ){

                    event.preventDefault();

                    toggleCard();

                }

            }
        );


        return card;

    }


    // ========================================
    // TAMPILKAN DECK
    // ========================================

    function tampilkanDeck(data){

        if(
            !data ||
            data.status !== "success"
        ){

            throw new Error(
                data &&
                data.pesan
                    ? data.pesan
                    : "Data Character Card tidak tersedia."
            );

        }


        const siswa =
            Array.isArray(data.siswa)
                ? data.siswa
                : [];


        deck.innerHTML =
            "";


        jumlah.textContent =
            siswa.length +
            " SISWA";


        loading.classList.add(
            "hidden"
        );


        if(
            siswa.length === 0
        ){

            empty.classList.remove(
                "hidden"
            );

            empty.textContent =
                "Belum ada data siswa.";

            return;

        }


        empty.classList.add(
            "hidden"
        );


        siswa.forEach(
            function(item,index){

                deck.appendChild(
                    buatKartu(
                        item,
                        index
                    )
                );

            }
        );

    }


    // ========================================
    // AMBIL CHARACTER CARD DARI SERVER
    // ========================================

    async function ambilCharacterCards(){

        const response =
            await fetch(
                URL_WEB_APP +
                "?action=characterCards"
            );


        if(!response.ok){

            throw new Error(
                "Server tidak dapat dihubungi."
            );

        }


        const data =
            await response.json();


        console.log(
            "CHARACTER CARDS:",
            data
        );


        return data;

    }


    // ========================================
    // INIT
    // ========================================

    async function init(){

        try{

            loading.classList.remove(
                "hidden"
            );


            empty.classList.add(
                "hidden"
            );


            const data =
                await ambilCharacterCards();


            tampilkanDeck(
                data
            );


        }

        catch(error){

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


    // ========================================
    // JALANKAN
    // ========================================

    if(
        document.readyState ===
        "loading"
    ){

        document.addEventListener(
            "DOMContentLoaded",
            init
        );

    }

    else{

        init();

    }

})();
