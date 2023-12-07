const vstr_local = window.location.origin + '/Funcionario/';
$(document).ready(function () {

    $('.btn_novo').on('click', function () { window.open('Cadastro', '_self'); });
      
    fcn_carregaFuncionario();
    $('#btn_buscar').on('click', function () { fcn_carregaFuncionario(); });
    $('#cmb_qtdRegistro').on('change', function () {
        $('#tb_busca').find('.paginacao').html('');
        fcn_carregaFuncionario();

    });
});

function fcn_carregaFuncionario() {

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

                //TRATAMENTOS
                $('#tb_busca .btn_paginas').on('click', function () {
                    $('#tb_busca .btn_paginas').removeClass('btn-success');
                    $(this).addClass('btn-success');
                    fcn_carregaFuncionario();
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

            } else {
                $('#tb_busca tbody').html('<tr><td colspan="100%" class="text-center">Nenhum registro encontrado!</td></tr>')
            } 
        }
    }) 
}