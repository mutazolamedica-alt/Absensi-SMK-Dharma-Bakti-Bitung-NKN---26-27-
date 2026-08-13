// ========================================
// ABSENSI KEYYENNN
// api.js
// ========================================

const URL_WEB_APP = "https://script.google.com/macros/s/AKfycbz3KWlDE8ivAIhXLVyvDpjhKuUbbJ-LAm3s1Q-dha004ZRU2rXYNTZkbeHkBxRWWlA/exec";

async function kirimKeServer(kode){

    try{

        document.getElementById("hasil").innerHTML = "Mengirim data...";

        const formData = new URLSearchParams();

        formData.append("kode", kode);
        formData.append("mode", MODE);

        const response = await fetch(URL_WEB_APP,{

            method:"POST",

            body:formData

        });

        const data = await response.json();

        if(data.status=="success"){

            tampilHasil(

                data.nama,

                data.kode,

                data.keterangan,

                data.jam

            );

        }

        else{

            tampilError(data.pesan);

        }

    }

    catch(err){

        console.error(err);

        tampilError("Tidak dapat terhubung ke server.");

    }

}

// ========================================
// API REKAP DASHBOARD
// ABSENKU SMK
// ========================================

async function ambilRekapHariIni(){

    try{

        const response =
            await fetch(
                URL_WEB_APP +
                "?action=rekapHariIni"
            );


        if(!response.ok){

            throw new Error(
                "Gagal mengambil data rekap."
            );

        }


        const data =
            await response.json();


        console.log(
            "REKAP HARI INI:",
            data
        );


        return data;

    }

    catch(error){

        console.error(
            "Gagal mengambil rekap:",
            error
        );


        return {

            status:"error",

            pesan:
                "Tidak dapat mengambil rekap hari ini."

        };

    }

}

// ========================================
// API DAFTAR SISWA
// Untuk dropdown IZIN / SAKIT
// ========================================

async function ambilDaftarSiswa(){

    try{

        const response =
            await fetch(
                URL_WEB_APP +
                "?action=daftarSiswa"
            );

        if(!response.ok){

            throw new Error(
                "Gagal mengambil daftar siswa."
            );

        }

        const data =
            await response.json();

        console.log(
            "DAFTAR SISWA:",
            data
        );

        return data;

    }

    catch(error){

        console.error(
            "Gagal mengambil daftar siswa:",
            error
        );

        return {

            status:"error",

            pesan:
                "Tidak dapat mengambil daftar siswa."

        };

    }

}


// ========================================
// API SIMPAN IZIN / SAKIT
// ========================================

async function simpanStatusKhusus(
    kode,
    status
){

    try{

        const formData =
            new URLSearchParams();

        formData.append(
            "kode",
            kode
        );

        formData.append(
            "mode",
            "STATUS_KHUSUS"
        );

        formData.append(
            "status",
            status
        );


        const response =
            await fetch(
                URL_WEB_APP,
                {

                    method:"POST",

                    body:formData

                }
            );


        if(!response.ok){

            throw new Error(
                "Gagal mengirim data."
            );

        }


        const data =
            await response.json();


        console.log(
            "HASIL STATUS KHUSUS:",
            data
        );


        return data;

    }

    catch(error){

        console.error(
            "Gagal menyimpan status khusus:",
            error
        );


        return {

            status:"error",

            pesan:
                "Tidak dapat terhubung ke server."

        };

    }

}
