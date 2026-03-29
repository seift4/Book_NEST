function checkPass(){
    pass = document.getElementById("pass").value;
    confirmPass = document.getElementById("confirmPass").value;
    if (pass !== confirmPass){
        document.getElementById("error").style.display = ("block");
        return false;
    }
    else{
        return true;

    }
}

function removeError(){
    document.getElementById("error").innerText = "";
}