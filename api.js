//========================================
// ABSENSI KEYYENNN
// api.js
//========================================

const URL_WEB_APP =
"https://script.google.com/macros/s/AKfycbz3KWlDE8ivAIhXLVyvDpjhKuUbbJ-LAm3s1Q-dha004ZRU2rXYNTZkbeHkBxRWWlA/exec";

async function kirimKeServer(kode){

    try{

        document.getElementById("hasil").innerHTML="Mengirim data...";

        const form = new URLSearchParams();

        form.append("kode",kode);

        form.append("mode",MODE);

        const response = await fetch(URL_WEB_APP,{

            method:"POST",

            body:form

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

        console.log(err);

        tampilError(err.toString());

    }

    finally{

        scanSedangDiproses=false;

    }

}
