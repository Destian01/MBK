function ambilLokasi(){

    if(navigator.geolocation){

        navigator.geolocation.getCurrentPosition(function(pos){

            document.getElementById("lat").value=pos.coords.latitude;

            document.getElementById("lng").value=pos.coords.longitude;

            document.getElementById("status").innerHTML="✅ Lokasi berhasil diambil.";

        },function(){

            alert("Lokasi gagal diambil.");

        });

    }else{

        alert("Browser tidak mendukung GPS.");

    }

}