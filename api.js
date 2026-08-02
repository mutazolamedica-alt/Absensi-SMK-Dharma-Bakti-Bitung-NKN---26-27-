// ========================================
// ABSENSI KEYYENNN
// api.js
// ========================================

const URL_WEB_APP = "https://script.google.com/macros/s/AKfycbz3KWlDE8ivAIhXLVyvDpjhKuUbbJ-LAm3s1Q-dha004ZRU2rXYNTZkbeHkBxRWWlA/exec";

async function kirimKeServer(kode){

    try{

        document.getElementById("hasil").innerHTML="Mengirim data...";

        const response = await fetch(URL_WEB_APP,{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                kode:kode,

                mode:MODE

            })

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

        tampilError(

            "Tidak dapat terhubung ke server."

        );

    }

    finally{

        scanSedangDiproses=false;

    }

}
