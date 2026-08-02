// ========================================
// ABSENKU SMK
// api.js
// ========================================

// GANTI DENGAN URL WEB APP APPS SCRIPT
const URL_WEB_APP = "PASTE_URL_WEB_APP_DISINI";

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
