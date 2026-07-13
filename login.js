function login(){

    let username =
    document.getElementById("username").value;

    let password =
    document.getElementById("password").value;

    let akun = [

        {
            username:"admin",
            password:"12345",
            nama:"Administrator"
        },

        {
            username:"budi",
            password:"budi123",
            nama:"Budi Santoso"
        },

        {
            username:"rina",
            password:"rina123",
            nama:"Rina Lestari"
        }

    ];

    let berhasil = false;

    akun.forEach(function(user){

        if(
            user.username==username &&
            user.password==password
        ){

            localStorage.setItem(
                "login","true"
            );

            localStorage.setItem(
                "namaPetugas",
                user.nama
            );

            window.location.href="index.html";

            berhasil=true;

        }

    });

    if(!berhasil){

        document.getElementById("pesan").innerHTML =
        "❌ Username atau Password salah";

    }

}
