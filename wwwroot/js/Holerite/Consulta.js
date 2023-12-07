const vstr_local = window.location.origin + '/Holerite/';
$(document).ready(function () {

    $('#txt_empresa').on('change', function () {
        $('#txt_funcionario').trigger('limparCampo');
        $('#txt_funcionario').trigger('change');
    });

    $('#txt_funcionario').data('parametros', {
        id_empresa: { cmd: '($("#hdn_txt_empresa").val()?$("#hdn_txt_empresa").val():-1)' }
    }).on('change', function () {
        $('#txt_contrato').trigger('limparCampo');
    });

    $('#txt_contrato').data('parametros', {
        fl_status: 1,
        id_empresa: { cmd: '($("#hdn_txt_empresa").val()?$("#hdn_txt_empresa").val():-1)' },
        id_funcionario: { cmd: '($("#hdn_txt_funcionario").val()?$("#hdn_txt_funcionario").val():-1)' }
    });

    $('.btn_novo').on('click', function () { window.open('Cadastro', '_self'); });
      
    fcn_carregaHolerite();
    $('#btn_buscar').on('click', function () { fcn_carregaHolerite(); });
    $('#cmb_qtdRegistro').on('change', function () {
        $('#tb_busca').find('.paginacao').html('');
        fcn_carregaHolerite();

    });
});

function fcn_carregaHolerite() {

    $('#tb_busca tbody').html('<tr><td colspan="100%" class="text-center">Aguarde...</td></tr>');
    var vint_pagina = $('#tb_busca .btn_paginas.btn-success').data('value');
    $('#tb_busca').find('.menssagem,.paginacao').html('');

    dados = fcn_pegarValores('#frm_consulta');
    dados['qtdPagina'] = $('#cmb_qtdRegistro').val();
    dados['pagina'] = vint_pagina;

     
    $.ajax({
        type: "POST",
        datatype: "application/json",
        url: vstr_local + 'Carregar',
        cache: false,
        data: dados

    }).done(function (data) {
        $('#tb_busca tbody').html('');
        if (data.success) {
            if (data.resultado[0].length > 0) {  

                const paginacao = {
                    seletor_tb: '#tb_busca',
                    nr_registroInicial: data.registroInicial,
                    nr_totalRegistro: data.resultado[1][0].nr_totalRegistro,
                    nr_registroPagina: $('#cmb_qtdRegistro').val(),
                    resultado: data.resultado[0],
                    fl_criarBotaoEdicao: 1
                }
                fcn_gera_paginacao(paginacao)

                $('#tb_busca tr > td.btn_default_pag').map(function () {
                    $(this).append('<button type="button" class="btn btn-outline-secondary btn_view" data-id="1" title="Visualizar"><i class="fas fa-eye"></i></button>')
                })

                //TRATAMENTOS
                $('#tb_busca .btn_paginas').on('click', function () {
                    $('#tb_busca .btn_paginas').removeClass('btn-success');
                    $(this).addClass('btn-success');
                    fcn_carregaHolerite();
                });
                 
                // //FUNÇÕES
                $('#tb_busca .btn_default_pag .btn_edit').on('click', function () {
                    if ($(this).data('id')) { 
                        $('#frm_consulta').prop({
                            action: vstr_local + 'Alteracao/' + $(this).data('id'),
                            target: '_self'
                        }).submit();
                    }
                }); 

                $('#tb_busca .btn_default_pag .btn_view').on('click', function () {
                    if ($(this).data('id')) {
                        $('#frm_consulta').prop({
                            action: vstr_local + 'Visualizar/' + $(this).data('id'),
                            target: '_blank'
                        }).submit();
                    }
                }); 

            } else {
                $('#tb_busca tbody').html('<tr><td colspan="100%" class="text-center">Nenhum registro encontrado!</td></tr>')
            } 
        }
    }) 
}