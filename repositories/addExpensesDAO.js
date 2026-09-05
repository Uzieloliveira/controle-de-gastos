// Função responsável por receber os dados de cadastro de uma nova desepesa e enviar para o banco de dados
export function salvarDados(desc, amount, month, type, situation, day) {

    const datas = [desc, amount, month, type, situation]

    let is_True;

    for (let i = 0; i < datas.length; i++) {

        // validação dos dados
        if (datas[i] == undefined || datas[i] == null || datas[i] === '') {

            is_True = false

        } else {
            is_True = true
        }

    }

    if (is_True) {
        let expenses = {}

        // caso a despesa cadastrada seja do tipo repetição, adiciona o dia do vencimento no cadastro
        if (type === 'variável') {
            expenses = {
                descricao: desc,
                valor: amount,
                mes: month,
                tipo: type,
                situacao: situation
            };
        } else if (type === 'repetição') {
            expenses = {
                descricao: desc,
                valor: amount,
                vencimento: day,
                mes: month,
                tipo: type,
                situacao: situation
            };
        }

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

    if (listData.descricao !== undefined && listData.valor !== undefined && listData.mes !== undefined && listData.tipo !== undefined && listData.situacao !== undefined) {
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
    
    if(dado < 0){
        return "#ff3f3f";
    }else{
        return "rgb(8, 194, 132);"
    }
}

// insere os valores dentro de um texto
function inserirInfomacaoRodapeLista(totalSum, totalSumPayable, balance) {

    let sum = balance - totalSumPayable
    let colorBalance =  definirCor(sum)

    return ` 
    <div id="total_SumPayable"><p style= "color: #fafafa">Valor total a pagar / agendado:</p>&nbsp<p style= "color: var(---theme-color)">R$ ${totalSumPayable} </p></div>

    <div id="total_Sum"><p style= "color: #fafafa">Soma total:</p>&nbsp<p style= "color: var(---theme-color)">R$ ${totalSum}</p></div>

    <div id="total_Balance"><p style= "color: #fafafa">Saldo atual:</p>&nbsp<p style= "color: var(---theme-color)">R$ ${balance}</p></div>
    
    <div id="total_Balance"><p style= "color: #fafafa">Restante:</p>&nbsp<p style= "color: ${colorBalance}">R$ ${balance - totalSumPayable}</p></div>`


}

export function inserirDadosNaLista() {

    //adiciona os dados em uma constante
    const dados = obterTodoLocalStorage();
    let totalSum = 0;
    let totalSumPayable = 0;
    let balance = 0;
    let lista = '';

    for (let dado in dados) {

        //constante usada para fazer a verificação da validade dos dados
        const dataVerify = verificaDados(dados[dado]);

        if (dataVerify) {

            let color = definirCor(dados[dado].situacao);

            if (dados[dado].vencimento) {
                //insere na tela, uma lista de todos os dados armazenados no localStorage
                lista +=
                    `<tr id = "table_row">
                    <td style= "color: var(---theme-color); text-align: left;">&nbsp&nbsp${dados[dado].descricao}</td>
                    <td style = "text-align: left;">R$&nbsp&nbsp<span style= "color: var(---theme-color);">${dados[dado].valor}</span></td>
                    <td>${dados[dado].tipo}<p>(dia ${dados[dado].vencimento})</p></td>
                    <td style= "color: ${color}">${dados[dado].situacao} </td>
                    </tr>`

                // faz a soma de todos os valores dos resultados armazenados
                totalSum += Number(dados[dado].valor)
            } else {
                //insere na tela, uma lista de todos os dados armazenados no localStorage
                lista +=
                    `<tr id = "table_row">
                    <td style= "color: var(---theme-color); text-align: left;">&nbsp&nbsp${dados[dado].descricao}</td>
                    <td style = "text-align: left;">R$&nbsp&nbsp<span style= "color: var(---theme-color);">${dados[dado].valor}</span></td>
                    <td>${dados[dado].tipo}</td>
                    <td style= "color: ${color}">${dados[dado].situacao} </td>
                    </tr>`

                // faz a soma de todos os valores dos resultados armazenados
                totalSum += Number(dados[dado].valor)
            }

            if (dados[dado].situacao === "a pagar" || dados[dado].situacao === "agendado") {
                totalSumPayable += Number(dados[dado].valor)
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

            if (informacoes) {

                informacoes.innerHTML = inserirInfomacaoRodapeLista(totalSum, totalSumPayable, balance);
            }
        })
}

export function filtrarDadosNaLista(month) {

    const dados = obterTodoLocalStorage();
    let dataVerify = null;
    let totalSum = 0;
    let totalSumPayable = 0;
    let balance = 0;
    let lista = '';


    for (let dado in dados) {

        dataVerify = verificaDados(dados[dado]);

        if (dados[dado].salario) {
            if (dados[dado].mes === month) {
                balance = dados[dado].salario
            }
        }

        if (dataVerify) {

            if (dados[dado].mes === month) {

                let color = definirCor(dados[dado].situacao);
                lista +=
                    `<tr id = "table_row">
            <td style= "color: var(---theme-color); text-align: left;">&nbsp&nbsp${dados[dado].descricao}</td>
            <td style = "text-align: left;">R$&nbsp&nbsp<span style= "color: var(---theme-color);">${dados[dado].valor}</span></td>
            <td>${dados[dado].tipo}</td>
            <td style= "color: ${color}">${dados[dado].situacao}</td>
            </tr>`

                // faz a soma de todos os valores dos resultados armazenados
                totalSum += Number(dados[dado].valor)

                // faz a soma de todos os valores de despesas 'a pagar' e 'agendada'
                if (dados[dado].situacao === "a pagar" || dados[dado].situacao === "agendado") {
                    totalSumPayable += Number(dados[dado].valor)
                }

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

            if (informacoes) {

                // atualiza as informações mostradas no rodapé da página da lista de despesas
                informacoes.innerHTML = inserirInfomacaoRodapeLista(totalSum, totalSumPayable, balance);

            }
        })
}

export function adicionarReceita(income, month_income) {

    if (income !== null && income !== undefined && month_income !== null && month_income !== undefined) {

        let data_income = {
            salario: income,
            mes: month_income
        }

        try {
            localStorage.setItem(Date.now(), JSON.stringify(data_income))

            alert("Receita cadastrada com sucesso!");
        } catch {
            console.error('erro ao cadastrar receita!');
            alert("erro ao cadastrar receita!");
        }

    }
}