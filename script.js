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

let modeTambah = false;
let markerNasabah = [];

function modeTambahNasabah(){

    alert("Tekan lokasi di peta untuk menambahkan nasabah.");

    modeTambah = true;

}

map.on("click", function(e){

    if(!modeTambah) return;

    let nama = prompt("Masukkan Nama Nasabah");

    if(nama==null || nama==""){
        modeTambah=false;
        return;
    }

    let marker = L.marker([e.latlng.lat,e.latlng.lng]).addTo(map);

    marker.bindPopup(
        "<b>"+nama+"</b><br>Nasabah"
    );

    markerNasabah.push({
        nama:nama,
        lat:e.latlng.lat,
        lng:e.latlng.lng
    });

    localStorage.setItem(
        "nasabah",
        JSON.stringify(markerNasabah)
    );

    modeTambah=false;

    alert("Nasabah berhasil ditambahkan.");

});

let data = JSON.parse(localStorage.getItem("nasabah")) || [];

data.forEach(function(item){

    L.marker([item.lat,item.lng])
        .addTo(map)
        .bindPopup("<b>"+item.nama+"</b><br>Nasabah");

    markerNasabah.push(item);

});
