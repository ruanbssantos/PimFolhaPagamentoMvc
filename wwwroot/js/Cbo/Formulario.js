
const vstr_local = window.location.origin + '/Cbo/';
$(document).ready(function () { 
    $('#btn_gravar').on('click', function () { fcn_gravar(); });
    $('#btn_voltar').on('click', function () {
        window.open(vstr_local + 'Consulta', '_self');
    }); 
    if ($('#hdn_idCbo').val()) fcn_carregarCampos();
    else fcn_removerLoading();
});

function fcn_removerLoading() {
    setTimeout(function () {
        $('.container-formulario').removeClass('loading');
    }, 1000);
}

function fcn_gravar() {

    if (fcn_validaCampos('.container-formulario')) {
        $('#btn_gravar').prop('disabled', true);
        fcn_confirmSN("Atenção", 'Deseja realmente continuar?').done(function () {
            $.ajax({
                type: "POST",
                datatype: "application/json",
                url: vstr_local + 'Gravar',
                cache: false,
                data: fcn_pegarValores('.container-formulario')
            }).done(function (data) {
                if (data.message) fcn_alert("Atenção!", data.message);

                if (data.success) {
                    if ($('#hdn_idCbo').val()) fcn_carregarCampos();
                    else fcn_limparCampos('.container-formulario');
                }
            }).always(function () {
                $('#btn_gravar').prop('disabled', false);
            });
        }).fail(function () {
            $('#btn_gravar').prop('disabled', false);
            return false
        });
        
    }

}
 
function fcn_carregarCampos() {

    fcn_limparCampos('.container-formulario');

    if ($('#hdn_idCbo').val()) {
        $('.container-formulario').addClass('loading'); 
        $.ajax({
            type: "POST",
            datatype: "application/json",
            url: vstr_local + 'CarregarCampos',
            cache: false,
            data: {
                id_cbo: $('#hdn_idCbo').val()
            }
        }).done(function (data) {
            if (data.success) { 
                if (data.resultado[0].length > 0) {

                    //1 - PRÉ-CADASTRO
                    $.each(data.resultado[0][0], function (campo, valor) {
                        fcn_colocarValor('[name="' + campo + '"]', valor);
                    }); 
                    fcn_removerLoading();


                } else {
                    window.open(vstr_local + 'Consulta', '_self');
                }

            } 
        });
    }

}