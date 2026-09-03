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

    // =====================================================
    // ARTWORK SISWA
    // Tambahkan pasangan "KODE": "NAMA-FILE.png" di sini.
    // NKN028 / Trifosa dikunci dan tidak diubah.
    // =====================================================
    const CHARACTER_IMAGES = {
        "NKN028": "NKN028.png"
    };

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

    function numberValue(value) {
        const n = Number(value);
        return Number.isFinite(n) ? n : 0;
    }

    function formatPersentase(value) {
        let n = numberValue(value);
        if (n <= 1) n *= 100;
        return `${Math.round(n)}%`;
    }

    function normalisasiSiswa(item) {
        if (!item || typeof item !== "object") return null;

        return {
            kode: String(item.kode ?? item.Kode ?? item.nis ?? item.NIS ?? item.id ?? "").trim(),
            nama: String(item.nama ?? item.Nama ?? item.name ?? "Siswa").trim(),
            kelas: String(item.kelas ?? item.Kelas ?? "-").trim(),
            hadir: numberValue(item.hadir),
            terlambat: numberValue(item.terlambat),
            izin: numberValue(item.izin),
            sakit: numberValue(item.sakit),
            alpa: numberValue(item.alpa),
            hadirEfektif: numberValue(item.hadirEfektif ?? (numberValue(item.hadir) + numberValue(item.terlambat))),
            totalSkor: numberValue(item.totalSkor),
            persentase: numberValue(item.persentase),
            totalHari: numberValue(item.totalHari)
        };
    }

    function buatKartu(siswa, index) {
        const nomor = String(index + 1).padStart(2, "0");
        const imageSrc = CHARACTER_IMAGES[siswa.kode] || PLACEHOLDER_IMAGE;
        const isRealArtwork = Boolean(CHARACTER_IMAGES[siswa.kode]);

        const card = document.createElement("article");
        card.className = "character-card";
        card.tabIndex = 0;
        card.setAttribute("role", "button");
        card.setAttribute("aria-label", `Buka karakter ${siswa.nama}`);

        card.innerHTML = `
            <div class="card-inner">

                <!-- DEPAN: MURNI ARTWORK -->
                <div class="card-face card-front">
                    <img
                        class="character-photo"
                        src="${escapeHTML(imageSrc)}"
                        alt="Character ${escapeHTML(siswa.nama)}"
                        ${isRealArtwork ? "" : "data-placeholder=\"true\""}>
                </div>

                <!-- BELAKANG: IDENTITAS + REKAP BULAN BERJALAN -->
                <div class="card-face card-back">
                    <div class="back-top">
                        <span class="back-number">STUDENT ${nomor}</span>
                        <span class="close-flip" aria-hidden="true">↻</span>
                    </div>

                    <h3 class="back-name">${escapeHTML(siswa.nama)}</h3>
                    <div class="back-class">${escapeHTML(siswa.kelas)}</div>

                    <div class="stats">
                        <div class="stat hadir">
                            <strong>${siswa.hadirEfektif}</strong>
                            <span>HADIR</span>
                        </div>

                        <div class="stat izin">
                            <strong>${siswa.izin}</strong>
                            <span>IZIN</span>
                        </div>

                        <div class="stat sakit">
                            <strong>${siswa.sakit}</strong>
                            <span>SAKIT</span>
                        </div>

                        <div class="stat alpa">
                            <strong>${siswa.alpa}</strong>
                            <span>ALPA</span>
                        </div>
                    </div>

                    <div class="back-result">
                        <div class="result-box">
                            <strong>${formatPersentase(siswa.persentase)}</strong>
                            <span>KEHADIRAN</span>
                        </div>

                        <div class="result-box">
                            <strong>${siswa.totalSkor}</strong>
                            <span>TOTAL SKOR</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Jika artwork gagal dimuat, tetap tampilkan placeholder tanpa merusak kartu.
        const photo = card.querySelector(".character-photo");
        photo.addEventListener("error", function () {
            if (photo.src !== PLACEHOLDER_IMAGE) {
                photo.src = PLACEHOLDER_IMAGE;
            }
        });

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
        if (!data || data.status !== "success") {
            throw new Error(data?.pesan || "Data Character Cards tidak valid.");
        }

        const daftar = Array.isArray(data.siswa) ? data.siswa : [];
        const siswa = daftar
            .map(normalisasiSiswa)
            .filter(Boolean)
            .filter(item => item.kode && item.nama);

        deck.innerHTML = "";
        jumlah.textContent = `${siswa.length} SISWA`;
        loading.classList.add("hidden");

        if (siswa.length === 0) {
            empty.classList.remove("hidden");
            empty.textContent = "Data siswa Character Deck belum tersedia.";
            return;
        }

        empty.classList.add("hidden");
        siswa.forEach((item, index) => {
            deck.appendChild(buatKartu(item, index));
        });

        console.log("CHARACTER DECK DIMUAT:", {
            total: siswa.length,
            bulan: data.namaBulan,
            tahun: data.tahun
        });
    }

    async function init() {
        try {
            loading.classList.remove("hidden");
            empty.classList.add("hidden");

            if (typeof ambilCharacterCards !== "function") {
                throw new Error("Fungsi API Character Cards belum ditemukan.");
            }

            const data = await ambilCharacterCards();
            tampilkanSiswa(data);
        } catch (error) {
            console.error("Gagal memuat Character Deck:", error);
            loading.classList.add("hidden");
            empty.classList.remove("hidden");
            empty.textContent =
                "Character Deck belum dapat dimuat. Periksa koneksi/API ABSENKU.";
            jumlah.textContent = "0 SISWA";
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
