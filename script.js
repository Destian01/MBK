

if(localStorage.getItem("login")!="true"){

    window.location.href="login.html";

}

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

});
tampilkanNasabah();

function simpanNasabah(){

    if(lokasiDipilih==null){
    alert("Silakan tekan 'Ambil Lokasi Saya' terlebih dahulu.");
    return;
    }

    let nama=document.getElementById("namaNasabah").value;
    let alamat=document.getElementById("alamatNasabah").value;
    let hp=document.getElementById("hpNasabah").value;
  
let role = localStorage.getItem("role");

if(role=="admin"){

    petugas =
    document.getElementById("petugasNasabah").value;

}else{

    petugas =
    localStorage.getItem("namaPetugas");

}
  
let status =
document.getElementById("statusNasabah").value;

    if(nama==""){
        alert("Nama nasabah harus diisi.");
        return;
    }

    let data={
    nama:nama,
    alamat:alamat,
    hp:hp,
    petugas:petugas,
    status:status,
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

    let role = localStorage.getItem("role");
let namaPetugas = localStorage.getItem("namaPetugas");

markerNasabah.forEach(function(item,index){

    if(role=="petugas" && item.petugas!=namaPetugas){
        return;
    }

        daftar.innerHTML += `
        
        <div class="itemNasabah">

    <div class="atasNasabah">

        <h3>👤 ${item.nama}</h3>

        <button class="menuBtn"
        onclick="toggleMenu(${index})">
        ⋮
        </button>

    </div>
  

    <p>Alamat: ${item.alamat}</p>

    <p>No.Hp: ${item.hp}</p>

    <p>Petugas: ${item.petugas}</p>

<p>${statusBadge(item.status)}</p>

    <div id="menu${index}" class="popupMenu">

    <button onclick="lihatLokasi(${index})">
        📍 Lihat Lokasi
    </button>

    <button onclick="navigasiKeNasabah(${index})">
        🧭 Navigasi
    </button>

    ${
        role!="supervisor" ?
        `
        <button onclick="catatanNasabah(${index})">
    📝 Catatan
</button>
        <button onclick="editNasabah(${index})">
            ✏️ Edit
        </button>

        <button onclick="hapusNasabah(${index})">
            🗑️ Hapus
        </button>
        `
        :
        ""
    }

</div>

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
  
tutupSemuaMenu();
  
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

    let role = localStorage.getItem("role");
    let namaPetugas = localStorage.getItem("namaPetugas");

    if(role == "petugas"){
        data = data.filter(function(item){
            return item.petugas == namaPetugas;
        });
    }

    document.getElementById("totalNasabah").innerText = data.length;

}

function toggleMenu(index){

    let menu = document.getElementById("menu"+index);

    let buka = menu.style.display == "block";

    tutupSemuaMenu();

    if(!buka){
        menu.style.display = "block";
    }

}

function tutupSemuaMenu(){

    let menu = document.querySelectorAll(".popupMenu");

    menu.forEach(function(item){
        item.style.display = "none";
    });

}

function statusBadge(status){

    if(status=="Proses Pengajuan"){
        return "🟡 Proses Pengajuan";
    }

    if(status=="Butuh Disurvei"){
        return "🔵 Butuh Disurvei";
    }

    if(status=="Aktif Angsuran"){
        return "🟢 Aktif Angsuran";
    }

    return status;

}

function logout(){

    if(confirm("Yakin ingin keluar?")){

        localStorage.removeItem("login");
        localStorage.removeItem("namaPetugas");
      localStorage.removeItem("role");

        window.location.href="login.html";

    }

}

function tampilkanPetugas(){

    let nama = localStorage.getItem("namaPetugas");

    document.getElementById("namaPetugas").innerHTML = nama;

}


    let role = localStorage.getItem("role");

let menuPengguna = document.getElementById("menuPengguna");
let formNasabah = document.getElementById("formNasabah");

if(role !== "admin" && menuPengguna){
    menuPengguna.style.display = "none";
}

if(role === "supervisor" && formNasabah){
    formNasabah.style.display = "none";
}

function tampilkanPetugas(){

    let nama = localStorage.getItem("namaPetugas");
    let role = localStorage.getItem("role");

    let jabatan = "";

    if(role=="admin"){
        jabatan = "Admin";
    }else if(role=="petugas"){
        jabatan = "Petugas";
    }else if(role=="supervisor"){
        jabatan = "Supervisor";
    }

    document.getElementById("namaPetugas").innerHTML = nama;
    document.getElementById("jabatanPetugas").innerHTML = jabatan;

}

function isiDaftarPetugas(){

    let pengguna =
    JSON.parse(localStorage.getItem("pengguna")) || [];

    let select =
    document.getElementById("petugasNasabah");

    if(!select) return;

    select.innerHTML = "";

    pengguna.forEach(function(item){

        if(item.role=="petugas"){

            select.innerHTML +=
            `<option value="${item.nama}">
                ${item.nama}
            </option>`;

        }

    });

}

function aturHakAkses(){

    let role = localStorage.getItem("role");

    if(role=="admin"){
        document.getElementById("pilihPetugas").style.display="block";
    }

    if(role=="supervisor"){
        document.getElementById("formNasabah").style.display="none";
    }

    if(role!="admin"){
        document.getElementById("menuPengguna").style.display="none";
    }

}

function catatanNasabah(index){

  

    let role = localStorage.getItem("role");

    if(role=="supervisor"){
        alert("Supervisor hanya dapat melihat catatan.");
        return;
    }

    let data = markerNasabah[index];

    let catatan = prompt(
        "Masukkan catatan kunjungan untuk\n"+data.nama
    );

    if(catatan==null || catatan==""){
        return;
    }

    if(!data.catatan){
        data.catatan = [];
    }

    data.catatan.push({

        tanggal:new Date().toLocaleString("id-ID"),

        petugas:localStorage.getItem("namaPetugas"),

        isi:catatan

    });

    markerNasabah[index]=data;

    localStorage.setItem(
        "nasabah",
        JSON.stringify(markerNasabah)
    );

    alert("Catatan berhasil disimpan.");
tampilkanLaporanCatatan();
  
}

function tampilkanLaporanCatatan(){

    let data = JSON.parse(localStorage.getItem("nasabah")) || [];

    let role = localStorage.getItem("role");
    let namaPetugas = localStorage.getItem("namaPetugas");

    let html = "";

    data.forEach(function(nasabah){

        // Petugas hanya melihat nasabah miliknya
        if(role=="petugas" && nasabah.petugas!=namaPetugas){
            return;
        }

        if(nasabah.catatan){

            nasabah.catatan.forEach(function(c){

                html += `
                <div class="itemNasabah">

                    <b>Nasabah: ${nasabah.nama}</b><br>

                    Tanggal: ${c.tanggal}<br>

                    Petugas: ${c.petugas}<br>

                    Catatan: ${c.isi}

                </div>
                <hr>
                `;

            });

        }

    });

    if(html==""){
        html = "Belum ada catatan.";
    }

    document.getElementById("laporanCatatan").innerHTML = html;

}


tampilkanNasabah();
updateLaporan();
tampilkanPetugas();
isiDaftarPetugas();
aturHakAkses();
tampilkanLaporanCatatan();
