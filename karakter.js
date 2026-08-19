/* =========================================================
   WE ARE NAUTIKA'10
   PERSONAL CHARACTER DECK
   ========================================================= */

(function () {
    "use strict";

    const deck = document.getElementById("deck");
    const loading = document.getElementById("loadingDeck");
    const empty = document.getElementById("emptyDeck");
    const jumlah = document.getElementById("jumlahSiswa");

    /*
     * Placeholder karakter sementara.
     * Nanti pada tahap berikutnya dapat diganti dengan
     * foto/karakter AI masing-masing siswa.
     */
    const PLACEHOLDER_IMAGE =
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="600" height="760" viewBox="0 0 600 760">
                <defs>
                    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stop-color="#dcecff"/>
                        <stop offset="100%" stop-color="#f6faff"/>
                    </linearGradient>
                </defs>
                <rect width="600" height="760" fill="url(#g)"/>
                <circle cx="300" cy="275" r="105" fill="#9fc5f5"/>
                <path d="M125 690c20-150 105-215 175-215s155 65 175 215" fill="#6b9fe1"/>
                <text x="300" y="730" text-anchor="middle"
                      font-family="Arial" font-size="26" font-weight="700"
                      fill="#4773a9">CHARACTER</text>
            </svg>
        `);

    function escapeHTML(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function normalisasiSiswa(item) {
        if (!item) return null;

        if (typeof item === "string") {
            return {
                kode: item,
                nama: item,
                kelas: "-"
            };
        }

        return {
            kode:
                item.kode ??
                item.Kode ??
                item.nis ??
                item.NIS ??
                item.id ??
                "",
            nama:
                item.nama ??
                item.Nama ??
                item.name ??
                "Siswa",
            kelas:
                item.kelas ??
                item.Kelas ??
                "-"
        };
    }

    function buatKartu(siswa, index) {
        const nomor = String(index + 1).padStart(2, "0");

        const card = document.createElement("article");
        card.className = "character-card";
        card.tabIndex = 0;
        card.setAttribute("role", "button");
        card.setAttribute("aria-label",
            `Buka karakter ${siswa.nama}`);

        card.innerHTML = `
            <div class="card-inner">

                <div class="card-face card-front">

                    <div class="card-number">${nomor}</div>

                    <img
                        class="character-photo"
                        src="${PLACEHOLDER_IMAGE}"
                        alt="Character ${escapeHTML(siswa.nama)}">

                    <div class="character-front-info">
                        <h3 class="character-name">
                            ${escapeHTML(siswa.nama)}
                        </h3>

                        <div class="character-class">
                            ${escapeHTML(siswa.kelas)}
                        </div>

                        <div class="tap-hint">
                            KLIK UNTUK MELIHAT PROFIL →
                        </div>
                    </div>

                </div>

                <div class="card-face card-back">

                    <div class="back-top">
                        <span class="back-number">STUDENT ${nomor}</span>
                        <span class="close-flip">↻</span>
                    </div>

                    <h3 class="back-name">
                        ${escapeHTML(siswa.nama)}
                    </h3>

                    <div class="back-class">
                        ${escapeHTML(siswa.kelas)}
                    </div>

                    <div class="stats">
                        <div class="stat hadir">
                            <strong>0</strong>
                            <span>HADIR</span>
                        </div>

                        <div class="stat terlambat">
                            <strong>0</strong>
                            <span>TERLAMBAT</span>
                        </div>

                        <div class="stat izin">
                            <strong>0</strong>
                            <span>IZIN</span>
                        </div>

                        <div class="stat sakit">
                            <strong>0</strong>
                            <span>SAKIT</span>
                        </div>

                        <div class="stat alpa">
                            <strong>0</strong>
                            <span>ALPA</span>
                        </div>

                        <div class="stat">
                            <strong>0%</strong>
                            <span>KEHADIRAN</span>
                        </div>
                    </div>

                    <div class="score-row">
                        <span>TOTAL SKOR</span>
                        <strong>0</strong>
                    </div>

                </div>
            </div>
        `;

        function toggleCard() {
            card.classList.toggle("flipped");
        }

        card.addEventListener("click", toggleCard);

        card.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                toggleCard();
            }
        });

        return card;
    }

    function tampilkanSiswa(data) {
        let daftar = data;

        /*
         * Menangani beberapa bentuk response umum.
         */
        if (data && !Array.isArray(data)) {
            daftar =
                data.data ??
                data.siswa ??
                data.daftarSiswa ??
                data.result ??
                [];
        }

        if (!Array.isArray(daftar)) {
            daftar = [];
        }

        const siswa = daftar
            .map(normalisasiSiswa)
            .filter(Boolean)
            .filter(item => item.nama);

        deck.innerHTML = "";

        jumlah.textContent = `${siswa.length} SISWA`;

        loading.classList.add("hidden");

        if (siswa.length === 0) {
            empty.classList.remove("hidden");
            return;
        }

        empty.classList.add("hidden");

        siswa.forEach(function (item, index) {
            deck.appendChild(buatKartu(item, index));
        });
    }

    async function ambilDaftarSiswa() {
        /*
         * Prioritaskan fungsi API yang memang sudah tersedia
         * pada project ABSENKU.
         */
        if (typeof getDaftarSiswa === "function") {
            return await new Promise(function (resolve, reject) {
                try {
                    getDaftarSiswa(function (result) {
                        resolve(result);
                    });
                } catch (error) {
                    reject(error);
                }
            });
        }

        if (typeof ambilDaftarSiswa === "function") {
            return await ambilDaftarSiswa();
        }

        /*
         * Fallback untuk project yang mengekspos daftar siswa
         * melalui fungsi preload status khusus.
         */
        if (typeof muatDaftarSiswaStatusKhusus === "function") {
            await muatDaftarSiswaStatusKhusus();

            if (Array.isArray(window.daftarSiswaStatusKhusus)) {
                return window.daftarSiswaStatusKhusus;
            }
        }

        throw new Error(
            "Fungsi API daftar siswa belum ditemukan."
        );
    }

    async function init() {
        try {
            loading.classList.remove("hidden");
            empty.classList.add("hidden");

            const data = await ambilDaftarSiswa();

            tampilkanSiswa(data);

        } catch (error) {
            console.error(
                "Gagal memuat Character Deck:",
                error
            );

            loading.classList.add("hidden");
            empty.classList.remove("hidden");
            empty.textContent =
                "Daftar siswa belum dapat dimuat. Periksa koneksi/API ABSENKU.";
            jumlah.textContent = "0 SISWA";
        }
    }

    /*
     * Jika api.js memakai google.script.run dan proses
     * pemanggilan membutuhkan halaman selesai dimuat,
     * tunggu event load.
     */
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

})();
