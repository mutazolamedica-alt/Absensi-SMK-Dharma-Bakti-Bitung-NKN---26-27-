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
// CACHE DAFTAR SISWA
// ========================================

let daftarSiswaCache = null;
let daftarSiswaPromise = null;


// ========================================
// API DAFTAR SISWA
// Dengan CACHE
// ========================================

async function ambilDaftarSiswa(forceRefresh = false){

    // ------------------------------------
    // Jika cache tersedia
    // langsung gunakan cache
    // ------------------------------------

    if(
        !forceRefresh &&
        daftarSiswaCache
    ){

        return daftarSiswaCache;

    }


    // ------------------------------------
    // Jika request sedang berjalan
    // jangan membuat request kedua
    // ------------------------------------

    if(
        !forceRefresh &&
        daftarSiswaPromise
    ){

        return await daftarSiswaPromise;

    }


    // ------------------------------------
    // Request ke Apps Script
    // ------------------------------------

    daftarSiswaPromise =
        (async function(){

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


                if(
                    data.status !==
                    "success"
                ){

                    throw new Error(
                        data.pesan ||
                        "Daftar siswa gagal dimuat."
                    );

                }


                // --------------------------------
                // SIMPAN KE CACHE
                // --------------------------------

                daftarSiswaCache =
                    data;


                console.log(
                    "DAFTAR SISWA DIMUAT:",
                    data.total,
                    "siswa"
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

            finally{

                daftarSiswaPromise =
                    null;

            }

        })();


    return await daftarSiswaPromise;

}// ========================================
// CACHE DAFTAR SISWA
// ========================================

let daftarSiswaCache = null;
let daftarSiswaPromise = null;


// ========================================
// API DAFTAR SISWA
// Dengan CACHE
// ========================================

async function ambilDaftarSiswa(forceRefresh = false){

    // ------------------------------------
    // Jika cache tersedia
    // langsung gunakan cache
    // ------------------------------------

    if(
        !forceRefresh &&
        daftarSiswaCache
    ){

        return daftarSiswaCache;

    }


    // ------------------------------------
    // Jika request sedang berjalan
    // jangan membuat request kedua
    // ------------------------------------

    if(
        !forceRefresh &&
        daftarSiswaPromise
    ){

        return await daftarSiswaPromise;

    }


    // ------------------------------------
    // Request ke Apps Script
    // ------------------------------------

    daftarSiswaPromise =
        (async function(){

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


                if(
                    data.status !==
                    "success"
                ){

                    throw new Error(
                        data.pesan ||
                        "Daftar siswa gagal dimuat."
                    );

                }


                // --------------------------------
                // SIMPAN KE CACHE
                // --------------------------------

                daftarSiswaCache =
                    data;


                console.log(
                    "DAFTAR SISWA DIMUAT:",
                    data.total,
                    "siswa"
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

            finally{

                daftarSiswaPromise =
                    null;

            }

        })();


    return await daftarSiswaPromise;

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
