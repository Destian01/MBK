let role = localStorage.getItem("role");

if(role != "admin"){

    alert("Akses ditolak.");

    location.href = "index_v2.html";

}

let daftarPengguna =
JSON.parse(localStorage.getItem("pengguna")) || [];

let editIndex = -1;

tampilkanPengguna();

function simpanPengguna(){

    let nama = document.getElementById("nama").value;
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let role = document.getElementById("role").value;

    if(nama=="" || username=="" || password==""){
        alert("Semua data harus diisi.");
        return;
    }

    let data = {
        nama:nama,
        username:username,
        password:password,
        role:role
    };

    if(editIndex==-1){
        daftarPengguna.push(data);
    }else{
        daftarPengguna[editIndex]=data;
        editIndex=-1;
    }

    localStorage.setItem(
        "pengguna",
        JSON.stringify(daftarPengguna)
    );

    document.getElementById("nama").value="";
    document.getElementById("username").value="";
    document.getElementById("password").value="";
    document.getElementById("role").value="petugas";

    tampilkanPengguna();

    alert("Pengguna berhasil disimpan.");
}

function tampilkanPengguna(){

    let daftar = document.getElementById("daftarPengguna");

    daftar.innerHTML = "";

    daftarPengguna.forEach(function(item,index){

        let icon = "";

        if(item.role=="admin"){
            icon="";
        }

        if(item.role=="supervisor"){
            icon="";
        }

        daftar.innerHTML += `

        <div class="itemNasabah">

            <div class="atasNasabah">

                <h3>${icon} ${item.nama}</h3>

                <button class="menuBtn"
                onclick="toggleMenu(${index})">
                ⋮
                </button>

            </div>

            <p>👤 ${item.username}</p>

            <p>🔑 ${item.role}</p>

            <div id="menu${index}" class="popupMenu">

                <button onclick="editPengguna(${index})">
                    ✏️ Edit
                </button>

                <button onclick="hapusPengguna(${index})">
                    🗑️ Hapus
                </button>

            </div>

        </div>

        <hr>

        `;

    });

}

function editPengguna(index){

    let data = daftarPengguna[index];

    document.getElementById("nama").value = data.nama;
    document.getElementById("username").value = data.username;
    document.getElementById("password").value = data.password;
    document.getElementById("role").value = data.role;

    editIndex = index;

}

function hapusPengguna(index){

    if(!confirm("Yakin ingin menghapus pengguna ini?")){
        return;
    }

    daftarPengguna.splice(index,1);

    localStorage.setItem(
        "pengguna",
        JSON.stringify(daftarPengguna)
    );

    tampilkanPengguna();

}

function toggleMenu(index){

    document.querySelectorAll(".popupMenu").forEach(function(menu){
        menu.style.display = "none";
    });

    let menu = document.getElementById("menu"+index);

    if(menu.style.display=="block"){
        menu.style.display="none";
    }else{
        menu.style.display="block";
    }

}

document.addEventListener("click",function(e){

    if(!e.target.closest(".menuBtn") &&
       !e.target.closest(".popupMenu")){

        document.querySelectorAll(".popupMenu").forEach(function(menu){
            menu.style.display="none";
        });

    }

});

function kembaliHome(){

    window.location.href = "index_v2.html";

}

