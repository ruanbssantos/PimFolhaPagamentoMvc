const vstr_local = window.location.origin + '/Login/';
$(document).ready(function () { 
     
    $('#btn_gravar').on('click', function () { fcn_entrar(); });
    
}); 
function fcn_verificaEnter(e) {

    var keycode = e.witch ? e.witch : e.keyCode

    if (keycode == 13) {
        fcn_entrar()
    }

}
function fcn_entrar() {

    if (fcn_validaCampos('#container-login')) {

        $('#btn_gravar').prop('disabled', true); 
        $.ajax({
            type: "POST",
            datatype: "application/json",
            url: vstr_local + 'Entrar',
            cache: false,
            data: fcn_pegarValores('#container-login')
        }).done(function (data) {
            if (data.message) fcn_alert("Atenção!", data.message);

            if (data.success) window.open(window.location.origin + '/Home/Index', '_self');
        }).always(function () {
            $('#btn_gravar').prop('disabled', false);
        });

    } 

}
 