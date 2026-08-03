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

    finally{

        scanSedangDiproses=false;

    }

}
