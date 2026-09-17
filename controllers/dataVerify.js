//recebe um objeto do tipo JSON e verifica se os dados recebidos são válidos
export function verificarDados(listData) {

    var result = null;

    if (listData.vencimento) {

        if (listData.descricao !== undefined && listData.valor !== undefined && listData.mes !== undefined && listData.tipo !== undefined && listData.situacao !== undefined && listData.vencimento !== undefined) {

            result = true;

        } else {

            result = false;
        }

    } else {

        if (listData.descricao !== undefined && listData.valor !== undefined && listData.mes !== undefined && listData.tipo !== undefined && listData.situacao !== undefined) {

            result = true;

        } else {

            result = false;
        }
    }

    //retorna True or False
    return result;
}

export function verificarDadosEditados(desc, amount, type, situation, dueDate) {

    var result = null;

    if (desc !== '' || amount !== '' || type !== '--selecione--' || situation !== '--selecione--' || dueDate !== '') {

       if(type === 'repetição' && dueDate === ''){
            return false;
       } else {
            return true;
       }

    } else {

        result = false;
    }

    //retorna True or False
    return result;
}
