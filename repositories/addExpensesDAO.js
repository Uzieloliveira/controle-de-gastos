// Função responsável por receber os dados de cadastro de uma nova desepesa e enviar para o banco de dados
export function salvarDados(desc, amount, day, month, year) {

    const datas = [desc, amount]

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
            data: [day, month, year]
        };

        localStorage.setItem(Date.now(), JSON.stringify(expenses))
    } else {
        console.log('erro ao salvar dados, todos os campos devem estar preenchidos')
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

// função para verificar se existe valor cadastrado para data
function verificarData(data) {

    let result = null

    for (let i = 0; i < 3; i++) {

        if (data[i] !== "") {
            result = true
        } else {
            result = false
        }
    }

    return result;
}

export function inserirDadosNaLista() {

    const dados = obterTodoLocalStorage();
    let dateVerified = null;
    let totalSum = 0;
    let lista = '';

    for (let dado in dados) {

        // chamada da função
        dateVerified = verificarData(dados[dado].data)

        if (dateVerified) {
            lista +=
                `<tr id = "table_row">
            <td style= "color: var(---theme-color);">${dados[dado].descricao}</td>
            <td style= "text-align: right;"><span style= "color: var(---theme-color);">${dados[dado].valor}</span>&nbsp&nbspR$</td>
            <td>${dados[dado].data[0]}-${dados[dado].data[1]}-${dados[dado].data[2]}</td>
            </tr>`

             // faz a soma de todos os valores dos resultados armazenados
            totalSum += Number(dados[dado].valor) 

        } else {
            lista +=
                `<tr id = "table_row">
            <td style= "color: var(---theme-color);">${dados[dado].descricao}</td>
            <td style= "text-align: right;"><span style= "color: var(---theme-color);">${dados[dado].valor}</span>&nbsp&nbspR$</td>
            <td>Na</td>
            </tr>`

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

            if(informacoes){
                informacoes.innerHTML = ` <div id="total_Sum"><p>Valor total:</p>&nbsp<p>${totalSum} R$</p></div>`
            }
        })
}


export function filtrarDadosNaLista(month_home, month_end) {

    const dados = obterTodoLocalStorage();
    let dateVerified = null;
    let totalSumFilter = 0;

    let lista = '';
    let month_home_splited = '';
    let year_home_splited = '';
    let month_end_splited = '';
    let year_end_splited = '';

    if (month_home != null && month_end != null) {

        const date_splited_home = month_home.split("-")
        const date_splited_end = month_end.split("-")

        month_home_splited = date_splited_home[1]
        year_home_splited = date_splited_home[0]
        month_end_splited = date_splited_end[1]
        year_end_splited = date_splited_end[0]

    }

    for (let dado in dados) {

        // chamada da função
        dateVerified = verificarData(dados[dado].data)

        if (dateVerified) {

            if (dados[dado].data[1] >= month_home_splited && dados[dado].data[1] <= month_end_splited){
                lista +=
                `<tr id = "table_row">
                <td style= "color: var(---theme-color);">${dados[dado].descricao}</td>
                <td style= "text-align: right;"><span style= "color: var(---theme-color);">${dados[dado].valor}</span>&nbsp&nbspR$</td>
                <td>${dados[dado].data[0]}-${dados[dado].data[1]}-${dados[dado].data[2]}</td>
                </tr>`

                // faz a soma de todos os valores dos resultados filtrados
                totalSumFilter += Number(dados[dado].valor) 
            }

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

            if(informacoes){
                informacoes.innerHTML = ` <div id="total_Sum"><p>Valor total:</p>&nbsp<p>${totalSumFilter} R$</p></div>`
            }
        })
}
