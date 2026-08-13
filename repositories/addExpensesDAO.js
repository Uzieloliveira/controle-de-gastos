
// Função responsável por receber os dados de cadastro de uma nova desepesa e enviar para o banco de dados
export function salvarDados(desc, amount, month) {

    const datas = [desc, amount, month]

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
            mes: month
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

export function inserirDadosNaLista() {

    const dados = obterTodoLocalStorage();
    let totalSum = 0;
    let lista = '';

    for (let dado in dados) {

        lista +=
            `<tr id = "table_row">
            <td style= "color: var(---theme-color);">${dados[dado].descricao}</td>
            <td style= ""><span style= "color: var(---theme-color);">${dados[dado].valor}</span>&nbsp&nbspR$</td>
            </tr>`

        // faz a soma de todos os valores dos resultados armazenados
        totalSum += Number(dados[dado].valor)

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
            lista +=
                `<tr id = "table_row">
            <td style= "color: var(---theme-color);">${dados[dado].descricao}</td>
            <td style= ""><span style= "color: var(---theme-color);">${dados[dado].valor}</span>&nbsp&nbspR$</td>
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

