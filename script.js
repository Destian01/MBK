let lokasiDipilih = null;
let editIndex = -1;

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
        let akurasi = Math.round(pos.coords.accuracy);

        document.getElementById("lat").value = lat;
        document.getElementById("lng").value = lng;
        document.getElementById("akurasi").value = akurasi + " Meter";

        // Lokasi yang akan dipakai saat menyimpan nasabah
        lokasiDipilih = {
            lat: lat,
            lng: lng
        };

        map.setView([lat,lng],18);

        if(markerPetugas){
            map.removeLayer(markerPetugas);
        }

        markerPetugas = L.marker([lat,lng])
            .addTo(map)
            .bindPopup("<b>Lokasi Petugas</b>")
            .openPopup();

        document.getElementById("status").innerHTML =
            "🟢 GPS berhasil diambil";

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
        .bindPopup(`
            <b>${item.nama}</b><br>
            📍 ${item.alamat}<br>
            📞 ${item.hp}
        `);

    markerNasabah.push(item);
tampilkanNasabah();
});

function simpanNasabah(){

    if(lokasiDipilih==null){
    alert("Silakan tekan 'Ambil Lokasi Saya' terlebih dahulu.");
    return;
    }

    let nama=document.getElementById("namaNasabah").value;
    let alamat=document.getElementById("alamatNasabah").value;
    let hp=document.getElementById("hpNasabah").value;
 let petugas = document.getElementById("petugas").value; 

    if(nama==""){
        alert("Nama nasabah harus diisi.");
        return;
    }

    let data={
    nama:nama,
    alamat:alamat,
    hp:hp,
    petugas:petugas,
    lat:lokasiDipilih.lat,
    lng:lokasiDipilih.lng
};

    if(editIndex == -1){
    markerNasabah.push(data);
}else{
    markerNasabah[editIndex] = data;
    editIndex = -1;
    }

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

  tampilkanNasabah();
  updateLaporan();
}

function tampilkanNasabah(){

    let daftar = document.getElementById("daftarNasabah");
    daftar.innerHTML = "";

    markerNasabah.forEach(function(item,index){

        daftar.innerHTML += `
        <div class="itemNasabah">

            <h3>👤 ${item.nama}</h3>

            <p>📍 ${item.alamat}</p>

            <p>📞 ${item.hp}</p>
<p>👮 Petugas : ${item.petugas}</p>

            <div class="aksi">

<button onclick="lihatLokasi(${index})">📍</button>

<button onclick="navigasiKeNasabah(${index})">🧭</button>

<button onclick="editNasabah(${index})">✏️</button>

<button onclick="hapusNasabah(${index})">🗑️</button>

</div>
        </div>
        <hr>
        `;

    });

}

function lihatLokasi(index){

    let item = markerNasabah[index];

    map.setView([item.lat,item.lng],18);

    L.popup()
      .setLatLng([item.lat,item.lng])
      .setContent(`
        <b>${item.nama}</b><br>
        ${item.alamat}<br>
        ${item.hp}
      `)
      .openOn(map);

}

function editNasabah(index){

    let data = markerNasabah[index];

    document.getElementById("namaNasabah").value = data.nama;
    document.getElementById("alamatNasabah").value = data.alamat;
    document.getElementById("hpNasabah").value = data.hp;

    lokasiDipilih = {
        lat: data.lat,
        lng: data.lng
    };

    editIndex = index;

    alert("Silakan ubah data lalu tekan Simpan Nasabah.");
}

function hapusNasabah(index){

    if(!confirm("Yakin ingin menghapus nasabah ini?")){
        return;
    }

    markerNasabah.splice(index,1);

    localStorage.setItem(
        "nasabah",
        JSON.stringify(markerNasabah)
    );

    map.eachLayer(function(layer){
        if(layer instanceof L.Marker && layer !== markerPetugas){
            map.removeLayer(layer);
        }
    });

    markerNasabah.forEach(function(item){

        L.marker([item.lat,item.lng])
        .addTo(map)
        .bindPopup(`
            <b>${item.nama}</b><br>
            ${item.alamat}<br>
            ${item.hp}
        `);

    });

    tampilkanNasabah();
updateLaporan();

}

function navigasiKeNasabah(index){
    let data = JSON.parse(localStorage.getItem("nasabah")) || [];
    let n = data[index];

    window.open(
        "https://www.google.com/maps/dir/?api=1&destination=" +
        n.lat + "," + n.lng,
        "_blank"
    );
}

function bukaMenu(menu){

    console.log(menu);

    const pages = document.querySelectorAll(".page");

    pages.forEach(function(page){
        page.style.display = "none";
    });

    document.getElementById(menu + "Page").style.display = "block";

    if(menu=="home"){
        setTimeout(function(){
            map.invalidateSize();
        },200);
    }

}

function updateLaporan(){

    let data = JSON.parse(localStorage.getItem("nasabah")) || [];

    document.getElementById("totalNasabah").innerText = data.length;

}

tampilkanNasabah();
updateLaporan();
