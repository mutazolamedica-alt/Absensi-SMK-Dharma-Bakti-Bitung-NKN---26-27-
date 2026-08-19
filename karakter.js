/* =========================================================
   WE ARE NAUTIKA'10
   CHARACTER DECK
   TAHAP 2A
   ========================================================= */


/*
 * DATA SEMENTARA
 *
 * Nanti data ini akan diganti otomatis
 * dari Google Apps Script + Rekap Bulanan.
 */


const DATA_KARTU = [

    {
        kode: "WALI",
        nama: "WALI KELAS",
        kelas: "NAUTIKA'10",
        role: "WALI KELAS",
        gambar: "we-are-nautika10.png",

        hadir: 0,
        terlambat: 0,
        izin: 0,
        sakit: 0,
        alpa: 0,

        persentase: 100
    },


    {
        kode: "S01",
        nama: "SISWA 01",
        kelas: "NAUTIKA'10",
        role: "STUDENT",
        gambar: "",

        hadir: 0,
        terlambat: 0,
        izin: 0,
        sakit: 0,
        alpa: 0,

        persentase: 100
    },


    {
        kode: "S02",
        nama: "SISWA 02",
        kelas: "NAUTIKA'10",
        role: "STUDENT",
        gambar: "",

        hadir: 0,
        terlambat: 0,
        izin: 0,
        sakit: 0,
        alpa: 0,

        persentase: 100
    },


    {
        kode: "S03",
        nama: "SISWA 03",
        kelas: "NAUTIKA'10",
        role: "STUDENT",
        gambar: "",

        hadir: 0,
        terlambat: 0,
        izin: 0,
        sakit: 0,
        alpa: 0,

        persentase: 100
    }

];


const deck =
    document.getElementById(
        "characterDeck"
    );


const jumlahKartu =
    document.getElementById(
        "jumlahKartu"
    );



/* =========================================================
   WARNA PERSENTASE
   ========================================================= */

function kelasPersentase(
    persentase
){

    const nilai =
        Number(persentase) || 0;


    if(nilai >= 90){

        return "percent-90";

    }


    if(nilai >= 75){

        return "percent-75";

    }


    if(nilai >= 60){

        return "percent-60";

    }


    return "percent-low";

}



/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value){

    return String(value ?? "")
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}



/* =========================================================
   BUAT KARTU
   ========================================================= */

function buatKartu(
    data,
    index
){

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "character-card " +
        kelasPersentase(
            data.persentase
        );


    card.innerHTML = `

        <div class="character-card-inner">


            <!-- ========================= -->
            <!-- DEPAN -->
            <!-- ========================= -->

            <div class="character-card-front">


                <div class="card-image-area">


                    ${
                        data.gambar

                        ?

                        `
                        <img
                            src="${escapeHTML(data.gambar)}"
                            class="card-image"
                            alt="${escapeHTML(data.nama)}">
                        `

                        :

                        `
                        <div
                            style="
                            font-size:70px;
                            opacity:.15;
                            ">
                            👤
                        </div>
                        `
                    }


                    <div class="card-number">

                        CARD ${String(index + 1)
                            .padStart(2,"0")}

                    </div>


                    <div class="card-percent">

                        ${Number(data.persentase) || 0}%

                    </div>


                </div>


                <div class="card-front-info">


                    <div>


                        <div class="card-role">

                            ${escapeHTML(
                                data.role
                            )}

                        </div>


                        <div class="card-name">

                            ${escapeHTML(
                                data.nama
                            )}

                        </div>


                        <div class="card-class">

                            ${escapeHTML(
                                data.kelas
                            )}

                            •

                            ${escapeHTML(
                                data.kode
                            )}

                        </div>


                    </div>


                    <div class="card-flip-hint">

                        TAP CARD TO FLIP ↻

                    </div>


                </div>


            </div>



            <!-- ========================= -->
            <!-- BELAKANG -->
            <!-- ========================= -->

            <div class="character-card-back">


                <div class="back-title">

                    ATTENDANCE PROFILE

                </div>


                <div class="back-name">

                    ${escapeHTML(
                        data.nama
                    )}

                </div>


                <div class="back-percent">

                    <strong>

                        ${Number(
                            data.persentase
                        ) || 0}%

                    </strong>

                    <span>

                        PERSENTASE KEHADIRAN

                    </span>

                </div>


                <div class="attendance-grid">


                    <div class="attendance-item">

                        <div class="attendance-label">
                            HADIR
                        </div>

                        <div
                            class="attendance-value hadir-value">

                            ${Number(
                                data.hadir
                            ) || 0}

                        </div>

                    </div>


                    <div class="attendance-item">

                        <div class="attendance-label">
                            TERLAMBAT
                        </div>

                        <div
                            class="attendance-value terlambat-value">

                            ${Number(
                                data.terlambat
                            ) || 0}

                        </div>

                    </div>


                    <div class="attendance-item">

                        <div class="attendance-label">
                            IZIN
                        </div>

                        <div
                            class="attendance-value izin-value">

                            ${Number(
                                data.izin
                            ) || 0}

                        </div>

                    </div>


                    <div class="attendance-item">

                        <div class="attendance-label">
                            SAKIT
                        </div>

                        <div
                            class="attendance-value sakit-value">

                            ${Number(
                                data.sakit
                            ) || 0}

                        </div>

                    </div>


                    <div class="attendance-item">

                        <div class="attendance-label">
                            ALPA
                        </div>

                        <div
                            class="attendance-value alpa-value">

                            ${Number(
                                data.alpa
                            ) || 0}

                        </div>

                    </div>


                </div>


                <div class="back-hint">

                    TAP CARD TO FLIP BACK ↻

                </div>


            </div>


        </div>

    `;


    card.addEventListener(
        "click",
        function(){

            card.classList.toggle(
                "flipped"
            );

        }
    );


    return card;

}



/* =========================================================
   RENDER DECK
   ========================================================= */

function renderDeck(){

    deck.innerHTML = "";


    DATA_KARTU.forEach(
        function(data,index){

            deck.appendChild(
                buatKartu(
                    data,
                    index
                )
            );

        }
    );


    jumlahKartu.innerHTML =
        DATA_KARTU.length +
        " KARTU";

}


renderDeck();
