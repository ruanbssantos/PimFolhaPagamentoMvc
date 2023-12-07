const vstr_local = window.location.origin + '/Holerite/';
const vstr_msgTableVazia = 'Nenhum registro adicionado!'
$(document).ready(function () { 

    var vobj_sortable = new Sortable.create(container_sortable, {
        animation: 150,
        ghostClass: 'ghost',
        filter: '.tr_remove',
        //FIM DO ARRASTAR
        //onEnd: function (/**Event*/evt) {
        //    fcn_reordenarIndexTable();
        //},
    });


    $('#txt_empresa').on('change', function () {
        $('#txt_funcionario').trigger('limparCampo');
        $('#txt_funcionario').trigger('change');
    });

    $('#txt_funcionario').data('parametros', {
        id_empresa: { cmd: '($("#hdn_txt_empresa").val()?$("#hdn_txt_empresa").val():-1)'}
    }).on('change', function () {
        $('#txt_contrato').trigger('limparCampo');
    });

    $('#txt_contrato').data('parametros', {
        fl_status: 1,
        id_empresa: { cmd: '($("#hdn_txt_empresa").val()?$("#hdn_txt_empresa").val():-1)' },
        id_funcionario: { cmd: '($("#hdn_txt_funcionario").val()?$("#hdn_txt_funcionario").val():-1)' }
    }).on('change', function () {
        const registro = $('#txt_contrato').data('values')

        $('#txt_dtAdmissao').val(registro.txt_dtAdmissao);
        $('#txt_salarioBase').val(registro.nr_salarioBruto);
        $('#txt_baseINSS').val(registro.nr_baseINSS);
        $('#txt_baseFGTS').val(registro.nr_baseFGTS);
        $('#txt_valorFGTS').val(registro.nr_valorFGTS);
        $('#txt_baseIRRF').val(registro.nr_baseIRRF);
    });

    $('#btn_gravar').on('click', function () { fcn_gravar(); });
    $('#btn_voltar').on('click', function () {
        window.open(vstr_local + 'Consulta', '_self');
    });

    if ($('#hdn_idHolerite').val()) fcn_carregarCampos();
    else {
        fcn_resetarCampos();
        fcn_removerLoading();
    } 

    $('#btn_addLancamento').on('click', function () {

        if (fcn_validaCampos('.frm_lancamento')) {
            data = {
                cmb_tipo: $('#cmb_tipo').val(),
                tipo: $('#cmb_tipo > option:selected').html(),
                txt_descricao: $('#txt_descricao').val(),
                txt_referencia: $('#txt_referencia').val(),
                txt_valor: $('#txt_valor').val()
            }
            fcn_addLancamento(data);
        }

    })
}); 

function fcn_addLancamento(p_data) {

     
    vstr_layout = '<tr data-id_tipo="' + p_data.cmb_tipo + '">' +
        '<td class="tipo">' + p_data.tipo + '</td>' +
        '<td class="descricao">' + p_data.txt_descricao + '</td>' +
        '<td class="referencia">' + p_data.txt_referencia + '</td>' +
        '<td class="valor">' + p_data.txt_valor + '</td>' +
        '<td class="text-center"><i class="fas fa-trash cursor-pointer btn_remove" title="Remover"></i></td>' +
        '</tr>'

    $('#tb_lancamentos tbody')
        .find('tr.tr_remove')
        .remove()

    $('#tb_lancamentos tbody')
        .append(vstr_layout)
        .find('tr:last')
        .data('registro', p_data)
        .find('i.btn_remove:last')
        .on('click', function () {

            var tr = $(this).parents('tr:first');
            fcn_confirmSN('Atenção!', 'Deseja realmente remover?').done(function () {
                tr.remove();
                fcn_verificaTabelaVazia('#tb_lancamentos tbody', vstr_msgTableVazia)
            });

        });

    fcn_limparCampos('.frm_lancamento');
}
function fcn_resetarCampos() {
    fcn_limparCampos('.container-formulario');
    fcn_verificaTabelaVazia('.tb_clear > tbody', vstr_msgTableVazia);
}
function fcn_removerLoading() {
    setTimeout(function () {
        $('.container-formulario').removeClass('loading');
    }, 1000);
}

function fcn_gravar() {

    if (fcn_validaCampos('.frm_request')) {


        const vstr_lancamentos = $('#tb_lancamentos tbody > tr:not(.tr_remove)').map(function (index) {
            return (index + 1) + '|-|' + $(this).data('id_tipo') + '|-|' + $(this).find('td:not(:first-child):not(:last-child)').map(function () { return ($(this).html().length > 0 ? $(this).html():'') }).get().join('|-|')
        }).get().join('|,|');


        if (vstr_lancamentos == "") {
            fcn_alert("Atenção!","Selecione ao menos um lançamento!")
            return false;
        }

        $('#btn_gravar').prop('disabled', true);
        fcn_confirmSN("Atenção", 'Deseja realmente continuar?').done(function () {

            var dados = fcn_pegarValores('.frm_request');

            dados["lancamentos"] = vstr_lancamentos;

                $.ajax({
                    type: "POST",
                    datatype: "application/json",
                    url: vstr_local + 'Gravar',
                    cache: false,
                    data: dados
                }).done(function (data) {
                    if (data.message) fcn_alert("Atenção!", data.message);

                    if (data.success) {
                        if ($('#hdn_idHolerite').val()) fcn_carregarCampos();
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

    fcn_resetarCampos();

    if ($('#hdn_idHolerite').val()) {
        $('.container-formulario').addClass('loading'); 
        $.ajax({
            type: "POST",
            datatype: "application/json",
            url: vstr_local + 'CarregarCampos',
            cache: false,
            data: {
                id_holerite: $('#hdn_idHolerite').val()
            }
        }).done(function (data) {
            if (data.success) { 
                if (data.resultado[0].length > 0) {

                    //1 - DADOS
                    $.each(data.resultado[0][0], function (campo, valor) {
                        fcn_colocarValor('[name="' + campo + '"]', valor);
                    });


                    //1 - LANÇAMENTOS
                    $.each(data.resultado[1], function (index, registro) {
                        fcn_addLancamento(registro);
                    }); 
                    fcn_removerLoading();


                } else {
                    //
                    window.open(vstr_local + 'Consulta', '_self');
                }

            } 
        });
    }

}