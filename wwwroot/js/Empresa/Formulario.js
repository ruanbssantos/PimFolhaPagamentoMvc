
$(document).ready(function () { 
    $('#txt_cnpj').on('blur', function () {
        fcn_validarDocumentoPessoa($(this), 'cnpj');
    }); 
    $('#btn_gravar').on('click', function () { fcn_gravar(); });
    $('#btn_voltar').on('click', function () { window.open('Consulta', '_self'); });

});


function fcn_gravar() {

    if (fcn_validaCampos('.container-formulario')) {

        $.ajax({
            type: "POST",
            datatype: "'application/json'",
            url: window.location.origin + '/Empresa/Gravar',
            cache: false,
            data: fcn_pegarValores('.container-formulario')
        }).done(function (data) {
            if (data.message) fcn_alert("Atenção!", data.message);
            if (data.success) {
            }
        });
    }

}