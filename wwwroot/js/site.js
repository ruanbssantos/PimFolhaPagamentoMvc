// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

window.addEventListener('DOMContentLoaded', event => {

    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        // MANTEM ABERTO OU FECHADO QUANDO ATUALIZA A PÁGINA
        // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        //     document.body.classList.toggle('sb-sidenav-toggled');
        // }
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }

});

/* FUNÇÕES PADRÃO V2 */ 

$(document).ready(function () {

    fcn_fieldAutoBusca_gera('');
    fcn_valoresPadroes('');
    fcn_accordionControlArrow('');
    $('input[type=date]').not('.notMinMax').attr({
        min: '1000-01-01'
        , max: '9999-12-31'
    });

})

$.ajaxSetup({

    error: function (xhr, textStatus, errorThrown) {
        //alert("Erro");
        fcn_alert('Atenção!', 'Desculpe-nos, mas ocorreu um erro inesperado. Por favor, tente atualizar a página e, caso o problema persista, entre em contato com o administrador do sistema. Detalhe do erro: <br />' + xhr.responseText);
        //if (this.url.toUpperCase().indexOf('WEB_SALVARERRO.ASP') == -1) {
        //    var responseText = xhr.responseText;
        //    dados = new Object;
        //    dados['urlNotRequest'] = this.url;
        //    dados['url_aspNotRequest'] = cstr_urlCompleta;
        //    dados['erroAjaxNotRequest'] = responseText;
        //    if (vstr_nomeCompletoConexaoG2L) dados['nomeUsuario'] = fcn_limparNomeArquivo(vstr_nomeCompletoConexaoG2L).toUpperCase();

        //    var arr_dadosEnviados = [];
        //    if (this.data) arr_dadosEnviados = this.data.split("&");

        //    for (var i = 0; i < arr_dadosEnviados.length; i++) {
        //        var keyValue = arr_dadosEnviados[i].split("=");
        //        var key = keyValue[0];
        //        var value = keyValue[1];

        //        // Decodificar o valor da URL
        //        value = fcn_decodeURL(value);

        //        // Adicionar ao objeto de resultado
        //        dados[key] = value;
        //    }


        //    $.ajax({
        //        type: "post",
        //        datatype: "json",
        //        url: vstr_localJs + 'webservices/web_salvarErro.asp',
        //        cache: false,
        //        data: dados
        //    })
        //}

    },
    complete: function (jqXHR, textStatus) {
        if (jqXHR.statusCode().status == 200) {
            //if (jqXHR.responseJSON) {
            //    if (jqXHR.responseJSON.sessaoExpirada) {
            //        window.open(vstr_localJs + 'index.asp', '_self')
            //    }
            //}
        }
    }
});


// Função para formatar o JSON
function fnc_formatStringJSON(jsonString, indentation = 3) {
    function formatValue(value, indentLevel) {
        if (typeof value === 'string') {
            return '<span class="json-value-string">' + JSON.stringify(value) + '</span>';
        } else if (typeof value === 'boolean') {
            return '<span class="json-value-boolean">' + JSON.stringify(value) + '</span>';
        } else if (typeof value === 'number') {
            return '<span class="json-value-number">' + JSON.stringify(value) + '</span>';
        } else if (Array.isArray(value)) {
            return formatArray(value, indentLevel);
        } else if (typeof value === 'object' && value !== null) {
            return formatObject(value, indentLevel);
        } else {
            return '<span class="json-value-other">' + JSON.stringify(value) + '</span>';
        }
    }

    function formatArray(arr, indentLevel) {
        var result = '[\n';
        indentLevel++;

        for (var i = 0; i < arr.length; i++) {
            var value = arr[i];
            result += ' '.repeat(indentLevel * indentation) + formatValue(value, indentLevel);

            if (i < arr.length - 1) {
                result += ',\n';
            }
        }

        indentLevel--;
        result += '\n' + ' '.repeat(indentLevel * indentation) + ']';
        return result;
    }

    function formatObject(obj, indentLevel) {
        var result = '{\n';
        indentLevel++;

        var keys = Object.keys(obj);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var value = obj[key];
            result += ' '.repeat(indentLevel * indentation) + '<span class="json-key">"' + key + '"</span>: ';
            result += formatValue(value, indentLevel);

            if (i < keys.length - 1) {
                result += ',';
            }
            result += '\n';
        }

        indentLevel--;
        result += ' '.repeat(indentLevel * indentation) + '}';
        return result;
    }

    try {
        var jsonObject = JSON.parse(jsonString);
        return formatValue(jsonObject, 0);
    } catch (error) {
        // Se houver um erro de parsing, retorna a string original sem formatação
        return jsonString;
    }
}

function fcn_JsonString(str) {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
}

function fcn_convertStringToJson(strJSON) {
    try {
        const objetoJSON = JSON.parse(strJSON);
        return objetoJSON;
    } catch (error) {
        console.error("Erro ao analisar a string JSON:", error);
        return null;
    }
}

function fcn_decodeURL(encoded) {
    return decodeURIComponent(encoded.replace(/\+/g, " "));
}

function fcn_inserirRegistroTabelaGenerica(pstr_seletorTabela, pstr_msgTabelaVazia, p_registro) {

    if (!p_registro.value) {
        console.log('Atenção!', 'Value não encontrado.');
        return false;
    } else if (!p_registro.descricao) p_registro.descricao = p_registro.value;


    if ($(pstr_seletorTabela + ' tbody').length == 0) {
        console.log('Atenção!', 'Seletor não encontrado.\n' + pstr_seletorTabela);
        return false;
    }

    $(pstr_seletorTabela + ' tbody')
        .find('tr.tr_remove')
        .remove()

    let vstr_layout = '';
    if (p_registro.caminho) {
        var vstr_caminho = p_registro.caminho + '/' + p_registro.value;

        vstr_layout = '<tr>' +
            '<td class="tag_a"><a href="' + vstr_caminho + '" target="_blank">' + p_registro.descricao + '</a></td>' +
            '<td class="btns_defaultFcn text-center">' +
            '<i class="fas fa-eye cursor-pointer btn_viewArquivo"></i>' +
            '<i class="fas fa-trash cursor-pointer ml-2 btn_remove"></i>' +
            '</td>' +
            '</tr>'

    } else {
        vstr_layout = '<tr>' +
            '<td class="descricao">' + p_registro.descricao + '</td>' +
            '<td class="text-center"><i class="fas fa-trash cursor-pointer btn_remove" title="Remover"></i></td>' +
            '</tr>'
    }

    $(pstr_seletorTabela + ' tbody')
        .append(vstr_layout)
        .find('tr:last')
        .data('registro', p_registro)
        .find('i.btn_remove:last')
        .on('click', function () {

            var tr = $(this).parents('tr:first');
            fcn_confirmSN('Atenção!', 'Deseja realmente remover?').done(function () {
                tr.remove();
                fcn_verificaTabelaVazia(pstr_seletorTabela + ' tbody', pstr_msgTabelaVazia)
            });

        });

    if (p_registro.caminho) {
        $(pstr_seletorTabela + ' tbody').find('i.btn_viewArquivo:last').on('click', function () {
            window.open(vstr_caminho, '_blank');
        })
    }
}

function fcn_pegarValorTabelaGenerica(pstr_seletorTabela, pstr_split) {

    if (!pstr_split) pstr_split = ',';

    if ($(pstr_seletorTabela + ' tbody').length == 0) {
        fcn_alert('Atenção!', 'Seletor não encontrado.\n' + pstr_seletorTabela);
        return false;
    }
    return $(pstr_seletorTabela + ' tbody tr:not(.tr_remove)').map(function () {
        if ($(this).data('registro')) return $(this).data('registro').value
    }).get().join(pstr_split);
}

function fcn_validarValoresTabelaGenerica(pstr_seletorTabela) {

    if ($(pstr_seletorTabela + ' tbody').length == 0) {
        fcn_alert('Atenção!', 'Seletor não encontrado.\n' + pstr_seletorTabela);
        return false;
    }

    if (fcn_pegarValorTabelaGenerica(pstr_seletorTabela) != '') return true;
    else return false;
}

function fcn_buscarCEP(p_campo, callback) {
    //LIMPA TODOS OS ESPAÇOS VAZIOS
    var cepSearchFinal = p_campo.value.replace(/\s+/g, '');
    var vobj_enderecoRetorno = new Object;

    if (cepSearchFinal != "") {
        var cepTratado = cepSearchFinal.replace(/\D/g, '')
        if (cepTratado.length != 8) {
            p_campo.focus();
            p_campo.value = "";
            fcn_alert('Atenção!', 'O CEP deve conter obrigatoriamente 8 dígitos.');
            return false
        } else p_campo.value = cepTratado;
        cepSearchFinal = cepTratado;

        const caminhoJsonCep = "https://maps.google.com/maps/api/geocode/json?key=" + vstr_chaveGoogleMapsJs + "&amp;&address=" + cepSearchFinal + "&sensor=false";
        $.getJSON(caminhoJsonCep)
            .done(function (data, status) {
                if (status == 'success') {
                    if (data.status == "OK") {

                        //Tratamento para quando API retornar endereço
                        if (data.results[0].address_components[1].types[0] == "route") {

                            vobj_enderecoRetorno['numero_rua'] = "";
                            vobj_enderecoRetorno['endereco'] = "";
                            vobj_enderecoRetorno['bairro'] = "";
                            vobj_enderecoRetorno['cidade'] = "";
                            vobj_enderecoRetorno['UF'] = "";
                            vobj_enderecoRetorno['cep'] = "";

                            $.each(data.results[0].address_components, function (index, registro) {
                                if (registro.types.filter(dado => dado == 'street_number').length > 0) {
                                    vobj_enderecoRetorno['numero_rua'] = registro.long_name;

                                } else if (registro.types.filter(dado => dado == 'route').length > 0) {
                                    vobj_enderecoRetorno['endereco'] = registro.long_name;

                                } else if (registro.types.filter(dado => dado == 'sublocality' || dado.indexOf('sublocality_level_') != -1).length > 0) {
                                    vobj_enderecoRetorno['bairro'] = registro.long_name;

                                } else if (registro.types.filter(dado => dado == 'administrative_area_level_1').length > 0) {
                                    vobj_enderecoRetorno['UF'] = registro.short_name;

                                } else if (registro.types.filter(dado => dado.indexOf('administrative_area_level_') != -1 || dado == 'locality').length > 0) {
                                    vobj_enderecoRetorno['cidade'] = registro.long_name;

                                } else if (registro.types.filter(dado => dado == 'postal_code').length > 0) {
                                    vobj_enderecoRetorno['cep'] = registro.short_name.replace(/\D/g, '');
                                }
                            });

                            vobj_enderecoRetorno['latitude'] = data.results[0].geometry.location.lat;
                            vobj_enderecoRetorno['longitude'] = data.results[0].geometry.location.lng;
                            fcn_buscarIdsCep(vobj_enderecoRetorno, callback);
                        } else fcn_buscarLatLong(data.results[0].geometry.location.lat, data.results[0].geometry.location.lng, callback);

                    } else {
                        fcn_alert('Atenção!', 'CEP informado não encontrado.');
                        callback(vobj_enderecoRetorno);
                    }

                } else {
                    fcn_alert('Atenção!', 'CEP informado não encontrado.');
                    callback(vobj_enderecoRetorno);
                }
            }).fail(function () {
                fcn_alert('Atenção!', 'ocorreu um erro ao buscar o cep informado. por favor, entre em contato com o administrador do sistema.');
                callback(vobj_enderecoRetorno);
            });

    } else callback(vobj_enderecoRetorno);

}

function fcn_buscarLatLong(pstr_lat, pstr_long, callback) {
    var vobj_enderecoRetorno = new Object;

    if (pstr_lat != "" && pstr_long != "") {

        const caminhoJsonLatLong = "https://maps.google.com/maps/api/geocode/json?key=" + vstr_chaveGoogleMapsJs + "&amp;&latlng=" + pstr_lat + "," + pstr_long;

        $.getJSON(caminhoJsonLatLong)
            .done(function (data, status) {
                if (status == 'success') {
                    if (data.status == "OK") {
                        vobj_enderecoRetorno['numero_rua'] = "";
                        vobj_enderecoRetorno['endereco'] = "";
                        vobj_enderecoRetorno['bairro'] = "";
                        vobj_enderecoRetorno['cidade'] = "";
                        vobj_enderecoRetorno['UF'] = "";
                        vobj_enderecoRetorno['cep'] = "";

                        $.each(data.results[0].address_components, function (index, registro) {
                            if (registro.types.filter(dado => dado == 'street_number').length > 0) {
                                vobj_enderecoRetorno['numero_rua'] = registro.long_name;

                            } else if (registro.types.filter(dado => dado == 'route').length > 0) {
                                vobj_enderecoRetorno['endereco'] = registro.long_name;

                            } else if (registro.types.filter(dado => dado == 'sublocality' || dado.indexOf('sublocality_level_') != -1).length > 0) {
                                vobj_enderecoRetorno['bairro'] = registro.long_name;

                            } else if (registro.types.filter(dado => dado == 'administrative_area_level_1').length > 0) {
                                vobj_enderecoRetorno['UF'] = registro.short_name;

                            } else if (registro.types.filter(dado => dado.indexOf('administrative_area_level_') != -1 || dado == 'locality').length > 0) {
                                vobj_enderecoRetorno['cidade'] = registro.long_name;

                            } else if (registro.types.filter(dado => dado == 'postal_code').length > 0) {
                                vobj_enderecoRetorno['cep'] = registro.short_name.replace(/\D/g, '');
                            }
                        });

                        vobj_enderecoRetorno['latitude'] = data.results[0].geometry.location.lat;
                        vobj_enderecoRetorno['longitude'] = data.results[0].geometry.location.lng;
                        fcn_buscarIdsCep(vobj_enderecoRetorno, callback);
                    } else {
                        fcn_alert('Atenção!', 'Localização informada não encontrada.');
                        callback(vobj_enderecoRetorno);
                    }


                } else {
                    fcn_alert('Atenção!', 'Localização informada não encontrada.');
                    callback(vobj_enderecoRetorno);
                }

            }).fail(function () {
                fcn_alert('Atenção!', 'Ocorreu um erro ao buscar a localização informada. Por favor, entre em contato com o administrador do sistema.');
                callback(vobj_enderecoRetorno);
            });

    } else callback(vobj_enderecoRetorno);

}

function fcn_buscarEndereco(p_seletoCampo, callback) {

    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: $(p_seletoCampo).val() }, function (results, status) {

        if (status == google.maps.GeocoderStatus.OK) {

            lat = results[0].geometry.location.lat();
            lng = results[0].geometry.location.lng();

            fcn_buscarLatLong(lat, lng, callback);

        } else fcn_alert('Atenção!', 'Endereço informado não encontrado.');

    });
}

function fcn_buscarIdsCep(pobj_enderecoRetorno, callback) {
    $.ajax({
        type: "POST",
        datatype: "json",
        url: vstr_localJs + 'webservices/web_cep.asp?tipoOper=SEL&acao=BUSCAR_IDS_CEP',
        cache: false,
        data: {
            UF: pobj_enderecoRetorno['UF']
            , municipio: pobj_enderecoRetorno['cidade']
            , endereco: pobj_enderecoRetorno['endereco']
        }
    }).done(function (data) {
        if (data.status) {
            //[0] - TIPO DE LOGRADOURO
            if (data.resultado[0].length > 0) {
                pobj_enderecoRetorno['ds_tipoLogradouro'] = data.resultado[0][0].ds_tipoLogradouro;
                pobj_enderecoRetorno['id_tipoLogradouro'] = data.resultado[0][0].id_tipoLogradouro;
            }
            //[1] - UF
            if (data.resultado[1].length > 0) {
                pobj_enderecoRetorno['ds_uf'] = data.resultado[1][0].ds_uf;
                pobj_enderecoRetorno['id_uf'] = data.resultado[1][0].id_uf;
            }
            //[2] - CODIGOMUNICIPIO
            if (data.resultado[2].length > 0) {
                pobj_enderecoRetorno['ds_municipio'] = data.resultado[2][0].ds_municipio;
                pobj_enderecoRetorno['id_codigoMunicipio'] = data.resultado[2][0].id_codigoMunicipio;
            }
            callback(pobj_enderecoRetorno);
        }
    }).fail(function () {
        fcn_alert('Error!', 'Erro inesperado. Favor contate o administrador do sistema.')
    });
}

function fcn_valoresPadroes(p_seletor) {

    const seletorInicial = (p_seletor ? p_seletor : 'body');
    p_seletor += ' input';

    $(p_seletor + '.maskTelefoneCelular').off('input.maskTelefoneCelular').on({
        'input.maskTelefoneCelular': function (event) { fcn_mascaraTelefoneCelular(event, this) }
    });

    $(p_seletor + '[type="text"].campoNumerico,[type="number"].campoNumerico').on({
        'keypress.campoNumerico': function (event) { return fcn_validaTecla('[0]', event) },
        'blur.campoNumerico': function () { $(this).val($(this).val().replace(/\D/g, '')) }
    });

    $(p_seletor + '[type="text"].campoAlfanumerico').off('keypress.campoAlfanumerico blur.campoAlfanumerico').on({
        'keypress.campoAlfanumerico': function (event) { return fcn_validaTecla('[0][A][a]', event) },
        'blur.campoAlfanumerico': function () { $(this).val($(this).val().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9\s]/g, "").toUpperCase()) }
    });



    // Declaração de mascaras
    $(p_seletor + '.maskMoeda').mask('###.###.##0,00', { reverse: true });
    $(p_seletor + '.maskDiaBarraMes').mask('##/##');
    $(p_seletor + '.maskMesBarraAno').mask('##/####');

    //marca campos
    $(seletorInicial).find('input.obg,textarea.obg,select.obg').map(function () {
        const label = $('label[for=' + $(this).prop('id') + ']');
        if (label.length > 0) {
            if (!label.hasClass('obgMark')) label.addClass('obgMark');
        }
    });
}

function fcn_accordionControlArrow(p_seletor) {

    //ACOORDION ARROW
    //aberto
    $(p_seletor + '.accordionControlArrow').on('shown.bs.collapse hidden.bs.collapse dsp.arrow.collapse', function (element) {
        const vobj_seletoCollapsenPai = $(element.currentTarget);
        const vobj_seletorSeta = vobj_seletoCollapsenPai.find('[data-target="#' + element.target.id + '"]');
        if (!vobj_seletorSeta.hasClass('arrow-collapse')) vobj_seletorSeta.addClass('arrow-collapse')
        if (vobj_seletorSeta.attr('aria-expanded') == 'false') vobj_seletorSeta.removeClass('rotacionar-180 rotacionar-0').addClass('rotacionar-0')
        else vobj_seletorSeta.removeClass('rotacionar-180 rotacionar-0').addClass('rotacionar-180')

        if (element.type == 'shown' && $(vobj_seletoCollapsenPai).hasClass('notScrollAuto') == false) {
            setTimeout(() => {
                $('html, body').animate({ scrollTop: vobj_seletorSeta.offset().top - 150 }, 'fast');
            }, 100);
        }
    });
    $(p_seletor + '.accordionControlArrow').find('.collapse').each(function (index, element) {
        $(element).trigger('dsp.arrow.collapse')
    });

}

function fcn_verificaTabelaVazia(p_seletor, pstr_msg) {
    $(p_seletor).map(function () {
        if ($(this).find('tr').length == 0) {
            $(this).html('<tr class="tr_remove"><td class="text-center" colspan="100%">' + pstr_msg + '</td></tr>')
        }
    });

}

function fcn_bloquearCampos(seletor, bloquear_fl) {

    let camposDisabled = 'input[type=checkbox]:not(.notDisabled)' +
        ',input[type=radio]:not(.notDisabled)' +
        ',input[type=button]:not(.notDisabled)' +
        ',select:not(.notDisabled)' +
        ',button:not(.notDisabled)'

    let camposReadOnly = 'input[type=text]:not(.notDisabled)' +
        ',input[type=number]:not(.notDisabled)' +
        ',input[type=date]:not(.notDisabled)' +
        ',input[type=time]:not(.notDisabled)' +
        ',textarea:not(.notDisabled)'

    let classeBloqueio = 'campo_disabled';

    if (bloquear_fl == '1') {
        $(seletor).find(camposDisabled).addClass(classeBloqueio).prop('disabled', 'disabled');
        $(seletor).find(camposReadOnly).addClass(classeBloqueio).prop('readOnly', 'readOnly');

    } else {
        $(seletor).find('.' + classeBloqueio + '.field_upload').removeClass(classeBloqueio);
        $(seletor).find('.' + classeBloqueio).not('.field_upload').removeAttr('disabled').removeAttr('readOnly').removeClass(classeBloqueio);
    }

}

function fcn_limparNomeArquivo(input) {
    const extensionIndex = input.lastIndexOf(".");
    const extension = input.slice(extensionIndex);
    const filename = input.slice(0, extensionIndex);

    const output = filename
        .normalize("NFD") // converte caracteres acentuados em caracteres sem acentuação
        .replace(/[\u0300-\u036f]/g, "") // remove caracteres de marcação de acentuação
        .replace(/[^a-zA-Z0-9\s]/g, "") // remove todos os caracteres que não são letras ou números
        .replace(/_/g, "-") // substitui "_" por "-"
        .replace(/(^|\s)\s*(\S)/g, "$1$2") // remove espaços extras
        .replace(/\s/g, "-") // substitui espaços por "-"
        .toUpperCase()
        + extension; // adiciona a extensão do arquivo de volta

    return output;
}

function fcn_upload(campo) {

    if (!fcn_validaTipoArquivo(campo)) return false;

    var pobj;
    if (campo.files.length > 0) {

        if ($(campo).data('caminho')) {
            vstr_caminho = $(campo).data('caminho')
        } else {
            fcn_alert('Error!', 'Caminho não definido.')
            return false;
        }

        var formData = new FormData();
        formData.append("caminho", vstr_caminho);

        const files = campo.files;
        for (let i = 0; i < files.length; i++) {
            formData.append('files[]', files[i], fcn_limparNomeArquivo(files[i].name));
        }


        vstr_nomeArquivo = $(campo).data('nome_arquivo')
        if (vstr_nomeArquivo) formData.append("nomeArquivo", vstr_nomeArquivo);

        $.ajax({
            url: vstr_localJs + 'includes/upload/upload.asp?hdn_operacaoUpload=1',
            type: 'POST',
            data: formData,
            cache: false,
            async: false,
            contentType: false,
            processData: false
        })
            .fail(function (data) {
                if (data.status) pobj = data;
                else fcn_alert('Atenção!', data.message)
            })
            .done(function (data) {
                if (data.status) pobj = data;
                else fcn_alert('Atenção!', data.message)

                if ($(campo).data('campo_atrelado')) {
                    if ($('#' + $(campo).data('campo_atrelado'))) {
                        $('#' + $(campo).data('campo_atrelado')).val(data.arquivos[0].FinalName).trigger("val-change");
                    }
                }
            });
    }

    $(campo).val('');
    return pobj;
}

function fcn_removeObg(pstr_seletor) {
    $(pstr_seletor).find('.obgMark, .obg').not('.notRemove').removeClass('obgMark obg has-error')
}

function fcn_marcarObg(pstr_seletor) {
    $(pstr_seletor).find('.obg-control').map(function () {
        $(this).addClass('obg');

        // Verifica se o elemento é um input radio para colocar a marcação de obrigatoriedade na label certa (e não em cada option)
        if ($(this).prop('type') == 'radio' || $(this).prop('type') == 'checkbox') $('label[for=' + $(this).prop('name') + ']').addClass('obgMark');
        else $('label[for=' + $(this).prop('id') + ']').addClass('obgMark');
    })
}

function fcn_validaTipoArquivo(campo) {

    const vstr_typeAllAccept = ".JPG,.JPEG,.PNG,.GIF,.SVG" + //IMAGENS
        ",.TXT,.PDF,.DOC,.DOCX,.RTF" + //DOCUMENTOS DE TEXTO
        ",.XLS,.XLSX,.CSV" + //PLANILHAS
        ",.PPT,.PPTX" + //APRESENTAÇÕES
        ",.ZIP,.RAR,.7Z" + //ARQUIVOS COMPACTADOS
        ",.MP3,.WAV" + //ARQUIVOS DE ÁUDIO
        ",.MP4,.AVI,.MKV,.MOV,.WMV" + //ARQUIVOS DE VÍDEO
        ",.JSON,.XML" //ARQUIVOS DE DADOS


    for (vobj_arquivo of campo.files) {

        arr_extencoes = vobj_arquivo.name.split(".")
        vstr_extencao = arr_extencoes[arr_extencoes.length - 1];
        vstr_extencao = vstr_extencao.toUpperCase();

        if ($(campo).attr('accept')) {
            if ($(campo).attr('accept').toUpperCase().indexOf(vstr_extencao) == '-1') {
                $(campo).val('');
                fcn_alert('Atenção!', 'A extenção do arquivo não está entre as permitidas <b>(' + $(campo).attr('accept') + ')</b>');
                return false;
            }
        } else {
            if (vstr_typeAllAccept.toUpperCase().indexOf(vstr_extencao) == '-1') {
                $(campo).val('');
                fcn_alert('Atenção!', 'A extenção do arquivo não é permitida.');
                return false;
            }
        }

    }

    return true;
}

function fcn_fieldUpload_gera(p_seletorAlvo) {
    /*
        EX: <input type="text" name="txt_perfil" id="txt_perfil" class="form-control field_autoBusca" data-field_type="field_perfil" />
            EXPLICAÇÃO: ADD CLASSE field_autoBusca
            data-field_type: TIPO DE CAMPO, ENVIADO PARA O AJAX SABER O QUE PROCURAR.
    */

    $(p_seletorAlvo + '.field_upload').each(function () {

        //ID DO CAMPO
        if ($(this).attr('id')) {
            var vstr_idCampo = $(this).attr('id');

            if ($('input[type=file][data-campo_atrelado=' + vstr_idCampo + ']').length > 0) {
                var vstr_idCampoFile = $('input[type=file][data-campo_atrelado=' + vstr_idCampo + ']').prop('id');
            } else {
                console.log('Error! Campo file não encontrado.');
                return false;
            }
        } else {
            console.log('Error! Declaração de ID.');
            return false;
        }

        var btn = '<button type="button" class="btn btn-outline-secondary btn_fieldUpload btn_fieldUpload_upload ml-1" title="Anexar"><i class="fas fa-cloud-upload-alt"></i></button>' +
            '<button type="button" class="btn btn-outline-secondary btn_fieldUpload btn_fieldUpload_view ml-1 notDisabled" title="Visualizar" disabled><i class="fas fa-eye"></i></button>' +
            '<button type="button" class="btn btn-outline-secondary btn_fieldUpload btn_fieldUpload_delete ml-1" title="Remover" disabled><i class="fas fa-times"></i></button> '

        //GERA O CONTAINER;
        $('#' + vstr_idCampo)
            .before('<div class="container-field d-flex">')
            .siblings('.container-field:first')
            .append($('#' + vstr_idCampo).addClass('cursor-pointer').attr({ placeholder: 'Clique aqui para anexar...' }))
            .append(btn);


        //title
        if ($('#' + vstr_idCampoFile).attr('accept')) {
            $('label[for="' + vstr_idCampo + '"]').append('<span class="showAccept">(Arquivos válidos: ' + $('#' + vstr_idCampoFile).attr('accept') + ')</span>')
        }

        //FUNÇÕES BTN

        //VISUALIZA ARQUIVO
        $('#' + vstr_idCampo).siblings('button.btn_fieldUpload_view').on('click', function () {
            window.open(vstr_localJs + $('#' + vstr_idCampoFile).data('caminho') + '/' + $('#' + vstr_idCampo).val(), '_blank')
        })
        //SOBE ARQUIVO - BTN
        $('#' + vstr_idCampo).siblings('button.btn_fieldUpload_upload').on('click', function () {
            if ($(this).hasClass('campo_disabled')) return false;
            $('#' + vstr_idCampoFile).click();
        })
        //SOBE ARQUIVO - TEXT
        $('#' + vstr_idCampo).on('click', function () {
            if ($(this).hasClass('campo_disabled')) return false;
            $('#' + vstr_idCampoFile).click();
        })
        //FCNS BTNS - VIEW E REMOVE
        $('#' + vstr_idCampo).on('val-change', function () {
            if ($(this).val() == '') vbln_disabled = true
            else vbln_disabled = false
            $(this).siblings('button.btn_fieldUpload_view, button.btn_fieldUpload_delete').prop('disabled', vbln_disabled);
        })
        //FCNS BTNS - REMOVE
        $('#' + vstr_idCampo).siblings('button.btn_fieldUpload_delete').on('click', function () {
            if ($(this).hasClass('campo_disabled')) return false;
            $('#' + vstr_idCampo).val('').siblings('button.btn_fieldUpload_view, button.btn_fieldUpload_delete').prop('disabled', true);
        })
        //FCNS BTNS - REMOVE
        $('#' + vstr_idCampo).on('disabled', function () {
            fcn_bloquearCampos($(this).parents('.container-field')[0], 1)
        })


    });
}

function fcn_validaTecla(pstr_validacao, evento) {
    // onKeyPress="return validaTecla('[0]{,}', event);"
    var tecla = (window.event) ? event.keyCode : evento.which;
    var retorno = false;
    //alert('TECLA: ' + tecla + validacao.indexOf('[A]') + '\n' + validacao.indexOf('[a]') + '\n' + validacao.indexOf('[0]') + '\n' + validacao.indexOf('[!]') + '\n' + validacao.indexOf('{'));
    if (tecla == 8) {
        retorno = true;
    }
    if (pstr_validacao.indexOf('[A]') > -1) {//alert('Maiusculo');//A-Z
        if ((tecla > 64 && tecla < 91)) { retorno = true };
    }
    if (pstr_validacao.indexOf('[a]') > -1) {//a-z
        if ((tecla > 96 && tecla < 123)) { retorno = true };
    }
    if (pstr_validacao.indexOf('[0]') > -1) {//0-9
        if ((tecla > 47 && tecla < 58)) { retorno = true };
    }
    if (pstr_validacao.indexOf('[!]') > -1) {
        if ((tecla > 31 && tecla < 48)
            || (tecla > 57 && tecla < 64)
            || (tecla > 90 && tecla < 97)
            || (tecla > 122 && tecla < 127)) { retorno = true };
    }
    if (pstr_validacao.indexOf('{') > 0 && pstr_validacao.indexOf('}') > 0) {//{#,@,!,A,1,-}
        if (pstr_validacao.indexOf('{') < pstr_validacao.indexOf('}')) {
            var caracteres = pstr_validacao.substr(pstr_validacao.indexOf('{'), pstr_validacao.indexOf('}'));
            caracteres = caracteres.split("");
            for (index = 0; index < caracteres.length; ++index) {
                if (caracteres[index].charCodeAt(0) == tecla) retorno = true;
            }
        }
    }
    //alert(retorno);
    return retorno;

}

function fcn_fieldAutoBusca_gera(p_seletorAlvo) {
    /*
        EX: <input type="text" name="txt_perfil" id="txt_perfil" class="form-control field_autoBusca" data-field_type="field_perfil" />
            EXPLICAÇÃO: ADD CLASSE field_autoBusca
            data-field_tyoe: TIPO DE CAMPO, ENVIADO PARA O AJAX SABER O QUE PROCURAR.
    */

    if (!p_seletorAlvo) p_seletorAlvo = '';
    else p_seletorAlvo += ' ';


    $(p_seletorAlvo + 'input.field_autoBusca').each(function () {
        //PEGA TODOS OS TIPOS DE CAMPOS
        if ($(this).data('field_type')) {


            var vbln_maisDeUmCampo = 0;

            //NAME DO CAMPO
            if ($(this).attr('name')) {
                var vstr_nameCampo = $(this).attr('name');
                var vstr_nameCamposIn = $('input.field_autoBusca[type=text][name=' + vstr_nameCampo + ']')

                if (vstr_nameCamposIn.length > 1) vbln_maisDeUmCampo = 1

            } else {
                console.log('Error! Declaração de name.');
                return false;
            }

            //ID DO CAMPO
            if ($(this).attr('id')) {
                var vstr_idCampo = $(this).attr('id');
                var vstr_idCampoHdn = 'hdn_' + vstr_idCampo;
            } else {
                console.log('Error! Declaração de ID.');
                return false;
            }

            var btn = '<button type="button" class="btn btn-outline-secondary btn_fieldAutoBusca btn_fieldAutoBusca_search ms-1" title="Buscar"><i class="fa fa-search font-size-12"></i></button>' +
                '<button type="button" class="btn btn-outline-secondary btn_fieldAutoBusca btn_fieldAutoBusca_delete ms-1" title="Remover"><i class="fas fa-times"></i></button> '

            //GERA O CONTAINER;
            $('#' + vstr_idCampo)
                .before('<div class="container-field d-flex">')
                .siblings('.container-field:first')
                .append($('#' + vstr_idCampo).attr({ maxlength: 255 }))
                .append(btn);


            //GERA AS HDNS QUE RECEBERAM OS IDS;
            $('#' + vstr_idCampo).before(
                $('<input>').attr({
                    type: 'hidden',
                    id: vstr_idCampoHdn,
                    name: vstr_idCampoHdn
                })
            );

            $('#' + vstr_idCampo).data('values', { id: '', label: '' });

            //AUTO COMPLETE - JQUERY
            $("#" + vstr_idCampo).autocomplete({
                delay: 800,
                minLength: 0,
                source: function (request, response) {

                    /*
                        EX: $('#[ID_DO_CAMPO]').data('parametros',{
                                fl_status: 1 -- PARAMETRO ATRIBUIDO PELO PROGRAMDOR
                                ,id_perfil: {seletor_campo: '#hdn_txt_perfil'} --PARAMETRO ATRIBUIDO POR DETERMINADO VALOR DO CAMPO
                                ,id_perfilIn: {cmd: '$('tbody').find('tr').map(function(){return $(this).id}).get().join()'} --PARAMETRO ATRIBUIDO POR CMD
                            })
                    */
                    var dados = new Object();
                    if (request.term != '') dados['ds_busca'] = request.term;
                    $.each($('#' + vstr_idCampo).data('parametros'), function (campo, value) {

                        let pstr_value = '';

                        if ($.isPlainObject(value)) {
                            if (value.cmd) pstr_value = eval(value.cmd); // EVAL
                            else if (value.seletor_campo) pstr_value = $(value.seletor_campo).val(); // BUSCA CAMPO
                        } else pstr_value = value;// VALOR PADRÃO

                        if (pstr_value != '' && pstr_value != undefined && pstr_value != null) dados[campo] = pstr_value
                    });
                     
                    $.ajax({
                        type: "POST",
                        datatype: "json",
                        url: window.location.origin + '/AutoBusca/' + $("#" + vstr_idCampo).data('field_type'),
                        cache: false,
                        data: dados
                    }).done(function (data) {
                        if (data.resultado[0].length > 0) {
                            dados_retorno = data.resultado[0]
                        } else {
                            dados_retorno = [{
                                label: 'Nenhum registro encontrado!'
                                , disabled: true
                            }];
                        }
                        $('#' + vstr_idCampo).removeClass('ui-autocomplete-loading');
                        response(dados_retorno);
                    }).fail(function () {
                        $('#' + vstr_idCampo).removeClass('ui-autocomplete-loading');
                        fcn_alert('Atenção!', 'Desculpe-nos, mas ocorreu um erro inesperado. Por favor, tente atualizar a página e, caso o problema persista, entre em contato com o administrador do sistema.');
                    });
                },
                select: function (event, ui) {

                    if ($('#' + vstr_idCampo).hasClass('ui-autocomplete-loading')) $('#' + vstr_idCampo).removeClass('ui-autocomplete-loading');

                    if (ui.item.id != '') {
                        if (vbln_maisDeUmCampo == 1) {
                            $.each(vstr_nameCamposIn, function (index, element) {
                                let vstr_idCampoIn = $(element).prop('id');
                                $('#' + 'hdn_' + vstr_idCampoIn).val(ui.item.id);
                                $('#' + vstr_idCampoIn).val(ui.item.label);
                                $('#' + vstr_idCampoIn).data('values', ui.item);
                            })
                        } else {
                            $('#' + vstr_idCampoHdn).val(ui.item.id);
                            $('#' + vstr_idCampo).data('values', ui.item);
                        }
                    }
                },
                change: function () {
                    if ($('#' + vstr_idCampo).hasClass('ui-autocomplete-loading')) $('#' + vstr_idCampo).removeClass('ui-autocomplete-loading');

                    if ($('#' + vstr_idCampo).val() != $('#' + vstr_idCampo).data('values').label) {
                        $('#' + vstr_idCampo).val($('#' + vstr_idCampo).data('values').label)
                        $('#' + vstr_idCampoHdn).val($('#' + vstr_idCampo).data('values').id);
                    }
                    $('#' + vstr_idCampoHdn).trigger('change').trigger('val-change');
                    $('#' + vstr_idCampo).trigger('change').trigger('val-change');
                }
            })
                .data("ui-autocomplete")._renderMenu = function (ul, items) {
                    //PARA DISABILITAR UMA OPÇÃO BASTA COLOCAR UM CASE COM NOME DISABLED com valor;
                    /*EX:
                        CASE
                            WHEN FL_STATUS = 1 THEN 1
                        END DISABLED
                        */
                    var that = this;
                    $.each(items, function (index, item) {
                        that._renderItemData(ul, item);
                    });
                    $(ul).find('li').filter(function () {
                        if ($(this).data('uiAutocompleteItem').disabled == true) return this
                    }).addClass('ui-state-disabled')
                    //.css('color','darkred');
                };


            var fcn_removeDados = function () {
                $('#' + vstr_idCampo).data('values', '');
                $('#' + vstr_idCampo).val('');
                $('#' + vstr_idCampoHdn).val('');
                $('#' + vstr_idCampo).trigger('change').trigger('val-change');
                $('#' + vstr_idCampoHdn).trigger('change').trigger('val-change');
            }


            //FUINÇÕES BTN

            var fcn_removeDados = function () {
                $('#' + vstr_idCampo).data('values', '');
                $('#' + vstr_idCampo).val('');
                $('#' + vstr_idCampoHdn).val('');
                $('#' + vstr_idCampo).trigger('change').trigger('val-change');
                $('#' + vstr_idCampoHdn).trigger('change').trigger('val-change');
            }
            $('#' + vstr_idCampo).siblings('button.btn_fieldAutoBusca_delete').on('click', function () { fcn_removeDados() });
            $('#' + vstr_idCampo).on('limparCampo', function () { fcn_removeDados() });
            $('#' + vstr_idCampo).siblings('button.btn_fieldAutoBusca_search').on('click', function () {
                $('#' + vstr_idCampo).autocomplete("search", "")
            })

            ////GUARDA VALORES SELECIONADOS
            $('#' + vstr_idCampo).on('focus preenche-autoBusca', function (event) {
                if ($(this).data('values').id == '' && $('#hdn_' + vstr_idCampo).val() != '') $(this).data('values').id = $('#hdn_' + vstr_idCampo).val()
                if ($(this).data('values').label == '' && $('#' + vstr_idCampo).val() != '') $(this).data('values').label = $('#' + vstr_idCampo).val()
            })

            ////BLOQUEIA USAR .trigger('disabled')
            $('#' + vstr_idCampo).on('disabled', function () {
                fcn_bloquearCampos($(this).parents('.container-field')[0], 1)
            })


        } else console.log('Error! Declaração de tipo de campo.')
    });
}
function fcn_colocarValor(p_seletor, p_valor) {
    var elemento = $(p_seletor);
    var Tag = elemento.prop('tagName');
    var Tipo = elemento.prop('type');
    var Nome = elemento.prop('name');
    if (Tag == 'SELECT' || Tag == 'TEXTAREA' || (Tag == 'INPUT' && (Tipo == 'text' || Tipo == 'number' || Tipo == 'hidden' || Tipo == 'date' || Tipo == 'time' || Tipo == 'password'))) {
        elemento.val(p_valor);
        if (Tipo == 'text' && p_valor != '') { elemento.trigger('paste').trigger("val-change"); }
    }
    else if (Tag == 'INPUT' && (Tipo == 'checkbox' || Tipo == 'radio')) {
        elemento.removeProp('checked');
        if (p_valor.indexOf(',') > 0) {
            p_valor = p_valor.split(',');
            i = 0;
            while (p_valor[i]) { $('[name="' + Nome + '"][value="' + p_valor[i] + '"]').prop('checked', true); i++; }
        } else $('[name="' + Nome + '"][value="' + p_valor + '"]').prop('checked', true);
    } else if (Tag == 'LABEL' || Tag == 'SPAN' || Tag == 'P') {
        elemento.html(p_valor);
    }
}

function fcn_pegarValor(p_seletor) {

    var retorno = '';

    $(p_seletor).filter("input[type=text], input[type=password], input[type=hidden], input[type=date],input[type=number],input[type=time], select, textarea:not(.ck_editor)").each(function () {
        retorno = $(this).val().trim();
    });

    $(p_seletor).filter("input[type=radio]:checked").each(function () {
        retorno = $(this).val().trim();
    });
    $(p_seletor).filter("input[type=checkbox]:checked").each(function () {
        var p_valor = '';
        if (retorno != '' && retorno != undefined) { retorno += ',' + $(this).val().trim(); }
        else { retorno = $(this).val().trim(); }
    });

    $(p_seletor).filter("table").each(function () {
        var p_valor = '';
        p_valor += fcn_pegarValorTabelaGenerica('#' + $(this).prop('id'));
        if (p_valor != '') retorno = p_valor;
    });


    return retorno;

}

function fcn_pegarValores(p_seletor) {

    var dados = new Object;

    $.each(
        $.unique(
            $(p_seletor)
                .find("input, select:not(.multiple-select,.multiple-selectVeiculo), textarea, table")
                .map(function () {
                    var dados = new Object;
                    dados['nodeName'] = $(this).prop('nodeName');

                    if (dados['nodeName'] == 'TABLE') {
                        dados['seletor_campo'] = $(this).prop('id');
                    } else dados['seletor_campo'] = $(this).prop('name');

                    if (dados['seletor_campo'] != '') return dados;
                })
        )
        , function (index, registro) {

            let vstr_seletor = '';
            if (registro.nodeName == 'TABLE') {
                vstr_seletor = '#' + registro.seletor_campo;
            } else vstr_seletor = '[name="' + registro.seletor_campo + '"]';

            var p_valor = fcn_pegarValor(vstr_seletor);
            if (p_valor != '') dados[registro.seletor_campo] = p_valor;
        });
    return dados;

}

function fcn_alertObg(p_seletor) {
    var vstr_campoNome = '';

    if ($("label[for=" + p_seletor.attr("name") + "]").length > 0) vstr_campoNome = $("label[for=" + p_seletor.attr("name") + "]").html();
    else if (p_seletor.data('label')) vstr_campoNome = p_seletor.data('label')

    if (vstr_campoNome) {
        vstr_campoNome = vstr_campoNome.replace(/\*/g, "");
    } else {
        vstr_campoNome = 'com o NAME "' + p_seletor.prop('name') + '"';
    }

    //ARRUMA O ERRO DO FOCUS
    const callBack = function () {
        p_seletor.focus();
    };
    callBack();
    fcn_alertCallback("Atenção!", "Preencha o campo <b>'" + vstr_campoNome.trim() + "'<b>.", '', callBack);

}

function fcn_validaCampos(form) {

    var retorno = true;
    let vbln_msgDispara = false;
    $.unique($(form).find(".obg")
        .map(function () {

            var dados = new Object;
            dados['nodeName'] = $(this).prop('nodeName');

            if (dados['nodeName'] == 'TABLE') {
                dados['seletor_campo'] = $(this).prop('id');
                dados['seletor_tableModal'] = $(this).parents('.modal.show:first').prop('id');
            } else dados['seletor_campo'] = $(this).prop('name');

            return dados;
        }))
        .each(function (index, registro) {
            if (registro.nodeName == 'TABLE') {
                vobj_campo = $('#' + registro.seletor_campo);
                vstr_campoValor = fcn_pegarValorTabelaGenerica('#' + registro.seletor_campo);

            } else {
                vobj_campo = $('[name="' + registro.seletor_campo + '"]:first')

                vobj_campo.removeClass('has-error')
                if (vobj_campo.prop('type') == 'radio' || vobj_campo.prop('type') == 'checkbox') {
                    var vstr_campoValor = '' + $('[name="' + vobj_campo.attr("name") + '"].obg:checked').map(function () { return $(this).val() }).get().toString();
                } else {
                    vstr_campoValor += vobj_campo.val();

                }
            }

            vstr_campoValor = vstr_campoValor.trim()

            if (vstr_campoValor == '' || vstr_campoValor == 'undefined' || vstr_campoValor == 'null') {

                let vstr_campoNome = '';
                if ($("label[for=" + vobj_campo.attr("name") + "]").length > 0) vstr_campoNome = $("label[for=" + vobj_campo.attr("name") + "]").html();
                else if (vobj_campo.data('label')) vstr_campoNome = vobj_campo.data('label');

                if (vstr_campoNome) {
                    vstr_campoNome = vstr_campoNome.replace(/\*/g, "");
                } else {
                    vstr_campoNome = 'com o SELETOR "' + registro.seletor_campo + '"';
                }


                if (registro.nodeName == 'TABLE') {
                    if (vbln_msgDispara == false) {
                        vstr_seletorScroll = 'html, body'
                        if (registro.seletor_tableModal) {
                            vstr_seletorScroll = '#' + registro.seletor_tableModal
                        }
                        fcn_alert("Atenção!", vstr_campoNome.trim());
                        $(vstr_seletorScroll).animate({ scrollTop: $('#' + registro.seletor_campo).offset().top - 160 }, 'fast');
                        vbln_msgDispara = true;
                    }
                } else {
                    if (vobj_campo.prop('type') != 'radio' && vobj_campo.prop('type') != 'checkbox') {
                        vobj_campo.addClass('has-error');

                        $(vobj_campo).off('blur', fcn_removerErroCampo)
                        $(vobj_campo).on('blur', fcn_removerErroCampo)
                    }
                    if (vbln_msgDispara == false) {
                        fcn_alertObg(vobj_campo);
                        vbln_msgDispara = true;
                    }

                }

                retorno = false;
                //return false;
            }


        });

    if (!retorno) return false;
    else return true;

}

function fcn_removerErroCampo(p_campo) {
    if ($(p_campo.target).hasClass('has-error')) {
        const dado = fcn_pegarValor(p_campo.target);
        if (dado) {
            $(p_campo.target).removeClass('has-error').off('blur', fcn_removerErroCampo);
        }
    }
}

function fcn_limparCampos(p_seletor) {
    $(p_seletor).each(function (i) {
        $(this).find('input[type=checkbox]:checked,input[type=radio]:checked').not('.notClear').removeAttr('checked', false).prop('checked', false);
        $(this).find('input[type=text],input[type=hidden],input[type=number],input[type=date],input[type=time],select,textarea,input[type=password]').removeClass('has-error').not('.notClear').val('');
        $(this).find("table.tb_clear tbody,table.tb_clear tfoot").html('');
    });

}

function fcn_gera_paginacao(p_seletor, pint_registroInicial, pint_totalRegistro, pint_qtdRegistroPagina, pobj_resultado, pbln_criarBotaoEdicao) {
    let arr_data = [];
    //PERCORRER LINHAS

    if (pobj_resultado.length > 0) {
        $.each(pobj_resultado, function (indice, registro) {

            var registroTratado = new Object;

            let vstr_linha = '';
            let pk = '';
            arr_data = [];
            //PERCORRE CAMPOS
            $.each(registro, function (campo, valor) {
                let vstr_campoTratado = campo;
                let oculto = '';
                let data = '';
                if (campo.indexOf('|') > 0) {
                    if (campo.split('|')[1].toString().toUpperCase() == 'OCULTO') oculto = 1;
                    if (campo.split('|')[1].toString().toUpperCase() == 'PK') {
                        pk = valor;
                        oculto = 1;
                    }
                    if (campo.split('|')[1].toString().toUpperCase() == 'DATA') {
                        data = 1;
                        arr_data.push([campo.split('|')[0], valor]);
                    }
                    vstr_campoTratado = campo.split('|')[0];
                }
                if (oculto != '1' && data != '1') vstr_linha += '<td class="' + vstr_campoTratado + '">' + valor + '</td>'

                registroTratado[vstr_campoTratado] = valor;

            })
            //CRIA BOTÃO EDIT DEFAULT
            vstr_linha += (pk != '' && pbln_criarBotaoEdicao == '1' ? '<td class="text-center btn_default_pag"><button type="button" class="btn btn-outline-secondary btn_edit" data-id="' + pk + '" title="Alterar"><i class="fas fa-edit"></i></button></td>' : '')
            $(p_seletor + ' tbody').append('<tr data-id="' + pk + '">' + vstr_linha + '</tr>').find('tr:last').data('registro', registroTratado);
            if (arr_data.length > 0) {
                arr_data.forEach(function (e, i) {
                    $(p_seletor + ' tbody tr:last').data(e[0], e[1])
                })
            }
        });

        vint_ultimoRegistro = (pint_registroInicial + (+pint_qtdRegistroPagina));
        vint_paginaAtual = Math.ceil(pint_registroInicial / pint_qtdRegistroPagina);
        vint_paginaFinal = Math.ceil(pint_totalRegistro / pint_qtdRegistroPagina);
        vint_rangeBtn = 1;
        $(p_seletor + ' .menssagem').html('Mostrando registros de ' + pint_registroInicial + ' até ' + (pint_totalRegistro > (vint_ultimoRegistro - 1) ? (vint_ultimoRegistro - 1) : pint_totalRegistro) + ', de ' + pint_totalRegistro);

        //INCLUI BOTÃO COM PÁGINA ATUAL
        $(p_seletor + ' .paginacao').html('<input name="btn_paginas" id="btn_pagina_' + vint_paginaAtual + '" class="btn btn_paginas btn-success" type="button" data-value="' + vint_paginaAtual + '" value="' + vint_paginaAtual + '">');

        //CRIA BOTÕES ANTES E DEPOIS DA PÁGINA ATUAL (SOMANDO E SUBTRAINDO)
        if (vint_rangeBtn > 0) {
            for (let i = 1; i <= vint_rangeBtn; i++) {
                $(p_seletor + ' .paginacao').prepend('<input name="btn_paginas" id="btn_pagina_' + (vint_paginaAtual - i) + '" class="btn btn_paginas btn-secondary" type="button" data-value="' + (vint_paginaAtual - i) + '" value="' + (vint_paginaAtual - i) + '">');
                $(p_seletor + ' .paginacao').append('<input name="btn_paginas" id="btn_pagina_' + (vint_paginaAtual + i) + '" class="btn btn_paginas btn-secondary" type="button" data-value="' + (vint_paginaAtual + i) + '" value="' + (vint_paginaAtual + i) + '">');
            }
        }

        //REMOVE BTNS MAIORES QUE A PÁGINA FINAL E MENOR QUE A PÁGINA ATUAL
        $(p_seletor + ' .btn_paginas').filter(function () { return $(this).val() < 1 || $(this).val() > vint_paginaFinal }).remove();

        //ADD PÁGINA INCIAL E FINAL
        if (vint_paginaFinal > 5) {
            $(p_seletor + ' .paginacao').prepend('<input name="btn_paginas" id="btn_pagina_primeiro" class="btn btn_paginas btn-secondary" type="button" data-value="1" value="Primeiro">');
            $(p_seletor + ' .paginacao').append('<input name="btn_paginas" id="btn_pagina_ultimo" class="btn btn_paginas btn-secondary"  data-value="' + vint_paginaFinal + '" type="button" value="Último">');
        }

    } else {
        $(p_seletor + ' tbody').html('<tr class="tr_remove text-center"><td  colspan="100%">Nenhum registro encontrado!</td></tr>');
    }
    
}
function fcn_testaRegex(regex, str) {
    return regex.test(str);
}

function fcn_preparaDownloadCSV(pstr_dataRetornoCsv, pstr_nomeArquivo) {
    var link = document.createElement("a");
    $(link).attr({
        href: "data:text/csv;charset=UTF-8," + "\uFEFF" + encodeURIComponent(pstr_dataRetornoCsv)
        , download: pstr_nomeArquivo + ".csv"
    }).addClass('link-relatorio');

    // Adiciona o link ao documento e simula o clique para iniciar o download
    document.body.appendChild(link);
    link.click();
    $('a.link-relatorio').removeClass();
}

/* FIM FUNÇÕES PADRÃO V2 */

//TRIM
function fcn_trim(pstr_string) {
    return pstr_string.replace(/^\s+|\s+$/g, "");
}

function fcn_validaDataMaxima(dataFormulario, addDays) {

    //Data digitada no formulário
    var diaDigitado, mesDigitado, anoDigitado;
    var diaFuturo, mesFuturo, anoFuturo;

    //Converte data para formato necessário
    split = dataFormulario.split('-');
    dataConvertida = split[0] + "-" + split[1] + "-" + split[2];

    diaDigitado = split[2];
    mesDigitado = split[1];
    anoDigitado = split[0];

    var depois = new Date();
    depois.setDate(depois.getDate() + addDays);

    if (depois.getDate() <= 9) {
        diaFuturo = "0" + depois.getDate();
    } else {
        diaFuturo = depois.getDate();
    }

    if ((depois.getMonth() + 1) <= 9) {
        mesFuturo = "0" + (depois.getMonth() + 1);
    } else {
        mesFuturo = (depois.getMonth() + 1);
    }

    if (depois.getFullYear() <= 9) {
        anoFuturo = "0" + depois.getFullYear();
    } else {
        anoFuturo = depois.getFullYear();
    }

    //Se dia digitado for maior que dia limite então barra
    if (parseInt(anoDigitado.toString() + mesDigitado.toString() + diaDigitado.toString()) > parseInt(anoFuturo.toString() + mesFuturo.toString() + diaFuturo.toString())) {
        return 1;
    } else {
        return 0;
    }

}

function fcn_validaDataMinima(dataFormulario, addDays) {

    //Data digitada no formulário
    var diaDigitado, mesDigitado, anoDigitado;
    var diaPassado, mesPassado, anoPassado;

    //Converte data para formato necessário
    split = dataFormulario.split('-');
    dataConvertida = split[0] + "-" + split[1] + "-" + split[2];

    diaDigitado = split[2];
    mesDigitado = split[1];
    anoDigitado = split[0];

    var antes = new Date();
    antes.setDate(antes.getDate() - addDays);

    if (antes.getDate() <= 9) {
        diaPassado = "0" + antes.getDate();
    } else {
        diaPassado = antes.getDate();
    }

    if ((antes.getMonth() + 1) <= 9) {
        mesPassado = "0" + (antes.getMonth() + 1);
    } else {
        mesPassado = (antes.getMonth() + 1);
    }

    if (antes.getFullYear() <= 9) {
        anoPassado = "0" + antes.getFullYear();
    } else {
        anoPassado = antes.getFullYear();
    }

    //Se dia digitado for maior que dia limite então barra
    if (parseInt(anoDigitado.toString() + mesDigitado.toString() + diaDigitado.toString()) < parseInt(anoPassado.toString() + mesPassado.toString() + diaPassado.toString())) {
        return 1;
    } else {
        return 0;
    }

}

/* ALERT */
function fcn_alert(title, text, pstr_tamanho) {
    if (!pstr_tamanho) pstr_tamanho = "small"
    $.alert({
        title: title,
        content: text,
        columnClass: pstr_tamanho,
        containerFluid: true,
        scrollToPreviousElement: false,
    });
}

function fcn_alertCallback(title, message, pstr_tamanho, callBack) {
    var def = $.Deferred();

    if (!pstr_tamanho) pstr_tamanho = "small"

    $.confirm({
        title: title,
        content: message,
        columnClass: pstr_tamanho,
        containerFluid: true,
        scrollToPreviousElement: false,//desativa rolamento para o inicio
        buttons: {
            op1: {
                text: 'Ok',
                action: function () {
                    def.resolve();
                    callBack();
                }
            },
        }
    });
    return def.promise();
}

function fcn_confirmSN(title, message, pstr_tamanho) {
    var def = $.Deferred();

    if (!pstr_tamanho) pstr_tamanho = "small"

    $.confirm({
        title: title,
        content: message,
        columnClass: pstr_tamanho,
        containerFluid: true,
        buttons: {
            op1: {
                text: 'Sim',
                action: function () {
                    def.resolve();
                }
            },
            op2: {
                text: 'Não',
                action: function () {
                    def.reject();
                }
            }
        }
    });
    return def.promise();
}

/* codifica string em methodos ajax por post */
function fcn_codifyString(stringCode) {

    let x = stringCode;
    let array = x.split("");
    let pstr_strigArray = ""

    for (i = 0; i < stringCode.length; i++) {
        if (pstr_strigArray.length > 0) {
            pstr_strigArray += "####" + array[i].charCodeAt(0);
        } else {
            pstr_strigArray += array[i].charCodeAt(0);
        }
    }
    return pstr_strigArray
}


//------------------------------------------------------
// Função para validação de documento pessoa fisica/juridica
//------------------------------------------------------

function fcn_validarDocumentoPessoa(p_campo, pstr_tipoValidacao) {

    if (p_campo) {
        var pbln_retorno = '';

        p_campo = p_campo[0];

        if (p_campo.value.replace(/[^\d]+/g, '') != '') {
            if (pstr_tipoValidacao === 'cpf') {

                pbln_retorno = fcn_validarCPF(p_campo);
            } else if (pstr_tipoValidacao === 'cnpj') {
                pbln_retorno = fcn_validarCNPJ(p_campo);
            } else {
                pbln_retorno = fcn_validarCPF(p_campo) || fcn_validarCNPJ(p_campo);
            }

            if (!pbln_retorno) {
                p_campo.value = "";
                p_campo.focus();
                fcn_alert('Atenção!', 'Número do documento inválido.')
            }

            return pbln_retorno
        } //aquielse p_campo.value = p_campo.value.replace(/[^\d]+/g, '');


    } else fcn_alert('Atenção', 'Seletor inválido!')
}

function fcn_validarCPF(p_campo) {


    var cpf = p_campo.value.replace(/[^\d]+/g, '');

    if (cpf.length !== 11) {
        return false;
    }

    if (/^(\d)\1+$/.test(cpf)) {
        return false;
    }

    var sum = 0;
    var remainder;

    for (var i = 1; i <= 9; i++) {
        sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    remainder = (sum * 10) % 11;

    if (remainder === 10 || remainder === 11) {
        remainder = 0;
    }

    if (remainder !== parseInt(cpf.substring(9, 10))) {
        return false;
    }

    sum = 0;

    for (var i = 1; i <= 10; i++) {
        sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    remainder = (sum * 10) % 11;

    if (remainder === 10 || remainder === 11) {
        remainder = 0;
    }

    if (remainder !== parseInt(cpf.substring(10, 11))) {
        return false;
    }

    return true;
}

function fcn_validarCNPJ(p_campo) {


    cnpj = p_campo.value.replace(/[^\d]+/g, '');

    if (cnpj.length !== 14) {
        return false;
    }

    if (/^(\d)\1+$/.test(cnpj)) {
        return false;
    }

    var size = cnpj.length - 2;
    var numbers = cnpj.substring(0, size);
    var digits = cnpj.substring(size);
    var sum = 0;
    var pos = size - 7;

    for (var i = size; i >= 1; i--) {
        sum += parseInt(numbers.charAt(size - i)) * pos--;

        if (pos < 2) {
            pos = 9;
        }
    }

    var result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

    if (result !== parseInt(digits.charAt(0))) {
        return false;
    }

    size = size + 1;
    numbers = cnpj.substring(0, size);
    sum = 0;
    pos = size - 7;

    for (var i = size; i >= 1; i--) {
        sum += parseInt(numbers.charAt(size - i)) * pos--;

        if (pos < 2) {
            pos = 9;
        }
    }

    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

    if (result !== parseInt(digits.charAt(1))) {
        return false;
    }

    return true;
}


//------------------------------------------------------
// Usado para pegar a lat/lng
//------------------------------------------------------
var getJSON = function (url, callback) {

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function () {
        var status = xhr.status;

        if (status == 200) {
            callback(null, xhr.response);
        } else {
            callback(status);
        }
    };
    xhr.send();
};

//------------------------------------------------------
// Funções para lidar com valores de moeda
//------------------------------------------------------
function fcn_preparaValorEntrada(pint_valor) {
    return parseFloat(pint_valor.toString().replaceAll(' ', '').replaceAll('R$', '').replaceAll('$', '').replaceAll('.', '').replaceAll(',', '.')).toFixed(2);
}

function fcn_preparaValorSaida(pint_valor) {
    return FCN_FORMATAR_MOEDA_BR(parseFloat(pint_valor).toFixed(2).replaceAll('.', ','), 14, 2);
}

function FCN_FORMATAR_MOEDA_BR(v, i, d) {
    if (!$.isNumeric(i) || !$.isNumeric(d)) { return 0; }
    v = v.replace(/[^\d,]/g, "")// permite digitar apenas numero e virgulas
    v = v.split(',')
    if (v[0] == '') { v[0] = '0' }
    if (v[1] === undefined) { v[1] = '' }
    if (v[0].length > i) v[0] = v[0].slice(-i)
    if (v[1].length > d) v[1] = v[1].slice(0, d)
    //v = parseInt(v[0]) + c
    if (v[0] != "") {
        v[0] = (+v[0]).toString();
        v[0] = (v[0]).split("").reverse().join('').replace(/(\d{3})/g, "$1.").split("").reverse().join('')//Coloca os pontos
        if (v[0].slice(0, 1) == '.') v[0] = v[0].slice(1, v[0].length);
        v[1] = v[1].replace(/0+$/, '');
        v[1] = v[1] + (v[1].length == 0 ? '00' : (v[1].length == 1 ? '0' : ''))
        v = v[0] + ',' + v[1]
    } else {
        v = '';
    }
    return v;
}

//------------------------------------------------------
// Função para mostrar/esconder campo
//------------------------------------------------------
function fcn_abrirCampos(pstr_seletor, pbln_marcaObg) {
    $(pstr_seletor).show('fast', function () {
        if (pbln_marcaObg) fcn_marcarObg(pstr_seletor);
    });

}

function fcn_ocultarCampos(pstr_seletor, pbln_marcaObg) {
    $(pstr_seletor).hide('fast', function () {
        if (pbln_marcaObg) fcn_removeObg(pstr_seletor);
    });

}

//------------------------------------------------------
// Função para validar cookie genérica
//------------------------------------------------------
function fcn_validaCookie(pstr_nomeCookie) {

    var nameEQ = pstr_nomeCookie + "=";
    var arr_allCookies = document.cookie.split(';');

    for (var i = 0; i < arr_allCookies.length; i++) {

        var vstr_cookie = arr_allCookies[i];

        // Tira o espaço do começo do nome do cookie
        while (vstr_cookie.charAt(0) == ' ') vstr_cookie = vstr_cookie.substring(1, vstr_cookie.length);

        if (vstr_cookie.indexOf(nameEQ) == 0) return true;

    }

    return false;

}
