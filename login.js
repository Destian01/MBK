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
