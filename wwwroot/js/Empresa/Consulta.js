$(document).ready(function () {

    $('.btn_novo').on('click', function () { window.open('Cadastro', '_self'); });
     

    fcn_carregaEmpresa();
    $('#btn_buscar').on('click', function () { fcn_carregaEmpresa(); });
    $('#cmb_qtdRegistro').on('change', function () {
        $('#tb_busca').find('.paginacao').html('');
        fcn_carregaEmpresa();

    });
});

function fcn_carregaEmpresa() {

    $('#tb_busca tbody').html('<tr><td colspan="100%" class="text-center">Aguarde...</td></tr>');
    var vint_pagina = $('#tb_busca .btn_paginas.btn-success').data('value');
    $('#tb_busca').find('.menssagem,.paginacao').html('');

    dados = fcn_pegarValores('#frm_newi');
    dados['qtdPagina'] = $('#cmb_qtdRegistro').val();
    dados['pagina'] = vint_pagina;


    $.ajax({
        type: "POST",
        datatype: "'application/json'",
        url: window.location.origin + '/Empresa/Carregar',
        cache: false,
        data: fcn_pegarValores('.container-formulario')

    }).done(function (data) {
        $('#tb_busca tbody').html('');
        if (data.status) {
            if (data.resultado[0].length > 0) {

                $('#tb_busca tbody').html('');

                fcn_gera_paginacao('#tb_busca', data.registroInicial, data.resultado[1][0].nr_totalRegistro, $('#cmb_qtdRegistro').val(), data.resultado[0], 1)

                //TRATAMENTOS
                $('#tb_busca .btn_paginas').on('click', function () {
                    $('#tb_busca .btn_paginas').removeClass('btn-success');
                    $(this).addClass('btn-success');
                    fcn_carregaEmpresa();
                });

                $('#tb_busca tbody tr').map(function () {
                    $(this).find('.btn_default_pag').map(function () {
                        $(this).find('button.btn_edit').attr('title', 'Visualizar').find('i').removeClass('fas fa-edit').addClass('fa-solid fa-eye');
                        $(this).prepend('<button type="button" class="btn btn-outline-secondary btn_visualizarHistorico" title="Visualizar Histórico"><i class="fa-solid fa-clock"></i></button>')
                    })
                })

                // //FUNÇÕES
                $('#tb_busca .btn_default_pag .btn_edit').on('click', function () {
                    if ($(this).data('id')) {
                        $('#hdn_idPreCadastro').val($(this).data('id'));
                        $('#frm_newi').prop({
                            action: 'cad_preCadastroCliente',
                            target: '_self'
                        }).submit();
                    }
                });

                $('#tb_busca .btn_default_pag .btn_visualizarHistorico').on('click', function () {
                    if ($(this).parents('tr:first').data('id')) { fcn_carregarHistoricoPreCadastro($(this).parents('tr:first').data('id'), this) }
                });

            } else {
                $('#tb_busca tbody').html('<tr><td colspan="100%" class="text-center">Nenhum registro encontrado!</td></tr>')
            }


        }
    }).fail(function () {
        fcn_alert('Atenção!', 'Ocorreu um erro. Por favor, entre em contato com o administrador do sistema.');
        return false;
    });
}