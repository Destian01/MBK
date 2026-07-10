// Membuat peta
var map = L.map('map').setView([-6.2, 106.8], 5);

// Menampilkan OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
}).addTo(map);

let markerPetugas = null;

// Ambil lokasi petugas
function ambilLokasi(){

    if(!navigator.geolocation){
        alert("Browser tidak mendukung GPS");
        return;
    }

    navigator.geolocation.getCurrentPosition(function(pos){

        let lat = pos.coords.latitude;
        let lng = pos.coords.longitude;

        document.getElementById("lat").value = lat;
        document.getElementById("lng").value = lng;

        document.getElementById("status").innerHTML="✅ Lokasi berhasil diambil.";

        map.setView([lat,lng],17);

        if(markerPetugas){
            map.removeLayer(markerPetugas);
        }

        let nama = document.getElementById("petugas").value || "Petugas";

        markerPetugas = L.marker([lat,lng])
            .addTo(map)
            .bindPopup("<b>"+nama+"</b><br>Lokasi Petugas")
            .openPopup();

    },function(err){

        alert(err.message);

    },{
        enableHighAccuracy:true
    });

}
