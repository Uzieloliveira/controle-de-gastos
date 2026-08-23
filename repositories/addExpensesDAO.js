
// Função responsável por receber os dados de cadastro de uma nova desepesa e enviar para o banco de dados
export function salvarDados(desc, amount, month, type, situation) {

    const datas = [desc, amount, month, type, situation]

    let is_True;

    for (let i = 0; i < datas.length; i++) {

        // validação dos dados
        if (datas[i] === undefined || datas[i] === null || datas[i] === '') {

            is_True = false

        } else {
            is_True = true
        }

    }

    if (is_True) {

        let expenses = {
            descricao: desc,
            valor: amount,
            mes: month,
            tipo: type,
            situacao: situation
        };
        try {
            localStorage.setItem(Date.now(), JSON.stringify(expenses))
            const msg = 'Despesa cadastrada com sucesso!';

            alert(msg)

        } catch {
            console.error(Error);
            alert(Error)
        }
    } else {
        alert('erro ao salvar dados, todos os campos devem estar preenchidos')
    }
}

export function obterTodoLocalStorage() {
    const dados = {};

    // Percorre todas as chaves salvas no localStorage
    for (let i = 0; i < localStorage.length; i++) {
        const chave = localStorage.key(i);
        const valor = localStorage.getItem(chave);

        // Tenta converter de JSON (caso você tenha salvo arrays/objetos),
        // senão mantém o valor em formato de string
        try {
            dados[chave] = JSON.parse(valor);
        } catch (e) {
            dados[chave] = valor;
        }
    }

    return dados;
}

//recebe um objeto do tipo JSON e verifica se os dados recebidos são válidos
function verificaDados(listData) {

    var result = null;

    if (listData.descricao !== undefined && listData.valor !== undefined && listData.mes !== undefined) {
        result = true;
    } else {
        result = false;
    }
    //retorna True or False
    return result;
}

// define uma cor para cada tipo de valor da coluna 'situação'(pago, a pagar, agendado),apresentada na lista de despesas!
function definirCor(dado) {
    if (dado === "pago") {
        return "#5fff4a";
    } else if (dado === "a pagar") {
        return "#ff3f3f";
    } else if (dado === "agendado") {
        return "#56c9ff";
    }
}

export function inserirDadosNaLista() {

    //adiciona os dados em uma constante
    const dados = obterTodoLocalStorage();
    let totalSum = 0;
    let lista = '';

    for (let dado in dados) {

        //constante usada para fazer a verificação da validade dos dados
        const dataVerify = verificaDados(dados[dado]);

        if (dataVerify) {

            let color = definirCor(dados[dado].situacao);

            //insere na tela, uma lista de todos os dados armazenados no localStorage
            lista +=
                `<tr id = "table_row">
            <td style= "color: var(---theme-color);">${dados[dado].descricao}</td>
            <td><span style= "color: var(---theme-color);">${dados[dado].valor}</span>&nbsp&nbspR$</td>
            <td>${dados[dado].tipo}</td>
            <td style= "color: ${color}">${dados[dado].situacao} </td>
            </tr>`

            // faz a soma de todos os valores dos resultados armazenados
            totalSum += Number(dados[dado].valor)

        }
    }

    fetch("./Views/listScreen").then(response => {
        if (!response.ok) {
            // se o arquivo não existir ou der erro, avisa no console
            throw new Error("Erro ao carregar a tela: " + response.statusText);
        }
        return response.text();
    })
        .then(html => {
            const tabela = document.querySelector('tbody');
            if (tabela) {
                tabela.innerHTML = lista;
            }
            const informacoes = document.querySelector("#displayInformations");

            if (informacoes) {
                informacoes.innerHTML = ` <div id="total_Sum"><p>Valor total:</p>&nbsp<p>${totalSum} R$</p></div>`
            }
        })
}

export function filtrarDadosNaLista(month) {

    const dados = obterTodoLocalStorage();
    let totalSum = 0;
    let lista = '';

    for (let dado in dados) {

        if (dados[dado].mes === month) {

            let color = definirCor(dados[dado].situacao);
            lista +=
                `<tr id = "table_row">
            <td style= "color: var(---theme-color);">${dados[dado].descricao}</td>
            <td><span style= "color: var(---theme-color);">${dados[dado].valor}</span>&nbsp&nbspR$</td>
            <td>${dados[dado].tipo}</td>
            <td style= "color: ${color}">${dados[dado].situacao}</td>
            </tr>`

            // faz a soma de todos os valores dos resultados armazenados
            totalSum += Number(dados[dado].valor)

        }

    }

    fetch("./Views/listScreen").then(response => {
        if (!response.ok) {
            // se o arquivo não existir ou der erro, avisa no console
            throw new Error("Erro ao carregar a tela: " + response.statusText);
        }
        return response.text();
    })
        .then(html => {
            const tabela = document.querySelector('tbody');
            if (tabela) {
                tabela.innerHTML = lista;
            }
            const informacoes = document.querySelector("#displayInformations");

            if (informacoes) {
                informacoes.innerHTML = ` <div id="total_Sum"><p>Valor total:</p>&nbsp<p>${totalSum} R$</p></div>`
            }
        })
}

