cekAdminPertama();

function login(){

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let pengguna =
    JSON.parse(localStorage.getItem("pengguna")) || [];

    let akun = pengguna.find(function(item){

        return item.username == username &&
               item.password == password;

    });

    if(!akun){

        alert("Username atau Password salah.");
        return;

    }

    localStorage.setItem("login","true");
localStorage.setItem("namaPetugas",akun.nama);
localStorage.setItem("role",akun.role);

localStorage.setItem("login","true");
localStorage.setItem("namaPetugas",akun.nama);
localStorage.setItem("role",akun.role);

location.href="index.html";

}

function cekAdminPertama(){

    let pengguna =
    JSON.parse(localStorage.getItem("pengguna")) || [];

    let adaAdmin = pengguna.some(function(item){
        return item.role=="admin";
    });

    if(!adaAdmin){
        document.getElementById("btnDaftarAdmin").style.display="block";
    }

}

function buatAdminPertama(){

    let nama = prompt("Nama Admin");

    if(!nama) return;

    let username = prompt("Username");

    if(!username) return;

    let password = prompt("Password");

    if(!password) return;

    let pengguna =
    JSON.parse(localStorage.getItem("pengguna")) || [];

    pengguna.push({

        nama:nama,
        username:username,
        password:password,
        role:"admin"

    });

    localStorage.setItem(
        "pengguna",
        JSON.stringify(pengguna)
    );

    alert("Admin pertama berhasil dibuat.");

    location.reload();

}
