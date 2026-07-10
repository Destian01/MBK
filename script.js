let lokasiDipilih = null;

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

function tambahNasabah() {

    modeTambah = true;

    alert("Silakan ketuk lokasi nasabah pada peta.");

}

map.on("click", function(e){

    if(!modeTambah) return;

    lokasiDipilih = e.latlng;

    L.marker(lokasiDipilih)
        .addTo(map)
        .bindPopup("Lokasi Nasabah")
        .openPopup();

    alert("Lokasi berhasil dipilih.");

    modeTambah = false;

});

let data = JSON.parse(localStorage.getItem("nasabah")) || [];

data.forEach(function(item){

    L.marker([item.lat,item.lng])
        .addTo(map)
        .bindPopup("<b>"+item.nama+"</b><br>Nasabah");

    markerNasabah.push(item);

});

function simpanNasabah(){

    if(lokasiDipilih==null){
        alert("Pilih lokasi di peta terlebih dahulu.");
        return;
    }

    let nama=document.getElementById("namaNasabah").value;
    let alamat=document.getElementById("alamatNasabah").value;
    let hp=document.getElementById("hpNasabah").value;

    if(nama==""){
        alert("Nama nasabah harus diisi.");
        return;
    }

    let data={
        nama:nama,
        alamat:alamat,
        hp:hp,
        lat:lokasiDipilih.lat,
        lng:lokasiDipilih.lng
    };

    markerNasabah.push(data);

    localStorage.setItem(
        "nasabah",
        JSON.stringify(markerNasabah)
    );

    L.marker([data.lat,data.lng])
    .addTo(map)
    .bindPopup(
        "<b>"+data.nama+"</b><br>"+data.alamat+"<br>"+data.hp
    );

    document.getElementById("namaNasabah").value="";
    document.getElementById("alamatNasabah").value="";
    document.getElementById("hpNasabah").value="";

    lokasiDipilih=null;

    alert("Nasabah berhasil disimpan.");
}
