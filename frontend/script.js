// Variáveis de referência aos elementos do DOM
//const=VARIAVEL QUE NÃO VAI MUDAR DE VALOR, APENAS RECEBER O ELEMENTO UMA VEZ
//
const form = document.getElementById("form-financa"); //REFERENCIA AO FORMULARIO DE CADASTRO
const tipoToggle = document.getElementById("tipo-toggle");  //REFERENCIA AO TOGGLE DE TIPO / BOTAO (RECEITA/DESPESA)
const tabelaFinancas = document.getElementById("tabela-financas"); //REFERENCIA A TABELA ONDE AS FINANCAS VÃO SER EXIBIDAS
const listaVencimentos = document.getElementById("lista-vencimentos"); //REFERENCIA A LISTA ONDE OS PROXIMOS VENCIMENTOS VÃO SER EXIBIDOS
const filtroTipo = document.getElementById("filtro-tipo"); //REFERENCIA AO SELECT DE FILTRO DE TIPO
const filtroCategoria = document.getElementById("filtro-categoria"); //REFERENCIA AO SELECT DE FILTRO DE CATEGORIA
const exportarBtn = document.getElementById("exportar"); //REFERENCIA AO BOTAO DE EXPORTAR
const totalReceitas = document.getElementById("total-receitas"); //REFERENCIA AO ELEMENTO QUE EXIBE O TOTAL DE RECEITAS
const totalDespesas = document.getElementById("total-despesas"); //REFERENCIA AO ELEMENTO QUE EXIBE O TOTAL DE DESPESAS
const totalSaldo = document.getElementById("total-saldo"); //REFERENCIA AO ELEMENTO QUE EXIBE O SALDO TOTAL
const totalVencimentos = document.getElementById("total-vencimentos"); //REFERENCIA AO ELEMENTO QUE EXIBE O TOTAL DE VENCIMENTOS PROXIMOS
const vencimentoRow = document.getElementById("vencimento-row");  //REFERENCIA A LINHA DO FORMULARIO ONDE FICA O INPUT DE VENCIMENTO (QUE É OCULTADA QUANDO SELECIONA RECEITA)
const diaPagamentoRow = document.getElementById("dia-pagamento-row");  //REFERENCIA A LINHA DO FORMULARIO ONDE FICA O SELECT DE DIA DE PAGAMENTO (QUE É OCULTADA QUANDO SELECIONA DESPESA
const parcelasGrid = document.getElementById("parcelas-grid");  //REFERENCIA AO GRID DO FORMULARIO ONDE FICA OS CAMPOS DE PARCELAS (QUE SÃO OCULTADOS QUANDO SELECIONA RECEITA)
const vencimentoInput = document.getElementById("vencimento");  //REFERENCIA AO INPUT DE VENCIMENTO DO FORMULARIO     
const diaPagamentoSelect = document.getElementById("diaPagamento"); //REFERENCIA AO SELECT DE DIA DE PAGAMENTO DO FORMULARIO
const parcelasSelect = document.getElementById("parcelas");  //REFERENCIA AO SELECT DE PARCELAS DO FORMULARIO
const parcelaAtualInput = document.getElementById("parcelaAtual"); //REFERENCIA AO INPUT DE PARCELA ATUAL DO FORMULARIO

let tipoSelecionado = "Despesa";  //VARIAVEL QUE ARMAZENA O TIPO SELECIONADO NO FORMULARIO (RECEITA OU DESPESA), INICIALIZADA COMO DESPESA PARA QUE O FORMULARIO INICIE COM AS CONFIGURAÇÕES DE DESPESA
const registros = [];  //ARRAY QUE VAI ARMAZENAR TODOS OS REGISTROS DE FINANCAS CADASTRADOS, CADA REGISTRO É UM OBJETO COM AS PROPRIEDADES: titulo, valor, vencimento, parcelas, parcelaAtual, categoria, tipo
// API_BASE é definido em config.js; se for null, sincronização com backend é desabilitada
const BACKEND = (typeof API_BASE !== 'undefined') ? API_BASE : null;

function formatarMoeda(valor) {  //FUNÇÃO QUE RECEBE UM VALOR NUMÉRICO E RETORNA UMA STRING FORMATADA COMO MOEDA BRASILEIRA (EX: 1234.56 => "1.234,56")
    return Number(valor).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function ehDiaPagamento(item) {
    return item.tipo === "Receita" && /^\d{1,2}$/.test(item.vencimento);
}

function formatarVencimento(item) {
    if (ehDiaPagamento(item)) {
        return `Dia ${String(item.vencimento).padStart(2, "0")}`;
    }

    return item.vencimento.split("-").reverse().join("/");
}

function calcularStatus(item) {
    if (ehDiaPagamento(item)) {
        return "Recebido";
    }

    const hoje = new Date();
    const dataVencimento = new Date(item.vencimento + "T23:59:59");
    return dataVencimento <= hoje ? "Recebido" : "Pendente";
}

function formatarParcela(item) {
    if (item.tipo === "Receita") {
        return "-";
    }

    return `${item.parcelaAtual || 1}/${item.parcelas}`;
}

function atualizarResumo() {
    const receitas = registros
        .filter(item => item.tipo === "Receita")
        .reduce((sum, item) => sum + item.valor, 0);
    const despesas = registros
        .filter(item => item.tipo === "Despesa")
        .reduce((sum, item) => sum + item.valor, 0);

    const vencimentos = registros.filter(item => {
        if (ehDiaPagamento(item)) return false;

        const hoje = new Date();
        const data = new Date(item.vencimento + "T23:59:59");
        const diff = (data - hoje) / (1000 * 60 * 60 * 24);
        return diff >= 0 && diff <= 7;
    }).length;

    totalReceitas.textContent = formatarMoeda(receitas);
    totalDespesas.textContent = formatarMoeda(despesas);
    totalSaldo.textContent = formatarMoeda(receitas - despesas);
    totalVencimentos.textContent = vencimentos;
}

function renderizarTabela() {
    const tipo = filtroTipo.value;
    const categoria = filtroCategoria.value;
    const itensFiltrados = registros.filter(item => {
        const tipoOk = tipo === "todos" || item.tipo === tipo;
        const categoriaOk = categoria === "todos" || item.categoria === categoria;
        return tipoOk && categoriaOk;
    });

    if (!itensFiltrados.length) {
        tabelaFinancas.innerHTML = "<tr><td colspan=\"7\" class=\"empty-row\">Nenhuma finança cadastrada ainda.</td></tr>";
        return;
    }

    tabelaFinancas.innerHTML = itensFiltrados.map(item => {
        const status = calcularStatus(item);
        return `
            <tr>
                <td>${item.titulo}</td>
                <td>${item.categoria}</td>
                <td>${item.tipo}</td>
                <td>R$ ${formatarMoeda(item.valor)}</td>
                <td>${formatarVencimento(item)}</td>
                <td>${formatarParcela(item)}</td>
                <td><span class="status-badge ${status === "Recebido" ? "recebido" : "pendente"}">${status}</span></td>
            </tr>
        `;
    }).join("");
}

function renderizarVencimentos() {
    const proximos = registros
        .filter(item => !ehDiaPagamento(item))
        .slice()
        .sort((a, b) => new Date(a.vencimento) - new Date(b.vencimento))
        .slice(0, 3);

    if (!proximos.length) {
        listaVencimentos.innerHTML = "<p>Nenhum vencimento cadastrado.</p>";
        return;
    }

    listaVencimentos.innerHTML = proximos.map(item => {
        const hoje = new Date();
        const data = new Date(item.vencimento + "T23:59:59");
        const diff = Math.ceil((data - hoje) / (1000 * 60 * 60 * 24));
        const quando = diff === 0 ? "Vence hoje" : `Vence em ${diff} dia${Math.abs(diff) === 1 ? "" : "s"}`;
        return `
            <div class="due-card">
                <div class="due-card__info">
                    <p class="due-card__title">${item.titulo}</p>
                    <p class="due-card__meta">${item.categoria}</p>
                </div>
                <div class="due-card__details">
                    <span class="due-card__amount">R$ ${formatarMoeda(item.valor)}</span>
                    <span class="due-card__when">${quando}</span>
                </div>
            </div>
        `;
    }).join("");
}

function atualizarDashboard() {
    atualizarResumo();
    renderizarTabela();
    renderizarVencimentos();
}

function criarDiasPagamento() {
    if (diaPagamentoSelect.children.length) return;

    for (let dia = 1; dia <= 31; dia++) {
        const valor = String(dia).padStart(2, "0");
        const option = document.createElement("option");

        option.value = valor;
        option.textContent = valor;

        diaPagamentoSelect.appendChild(option);
    }
}

function atualizarCamposTipo() {
    criarDiasPagamento();

    if (tipoSelecionado === "Receita") {
        vencimentoRow.style.display = "none";
        diaPagamentoRow.style.display = "";
        parcelasGrid.style.display = "none";

        vencimentoInput.required = false;
        diaPagamentoSelect.required = true;
        parcelasSelect.value = "1";
        parcelaAtualInput.value = "1";
    } else {
        vencimentoRow.style.display = "";
        diaPagamentoRow.style.display = "none";
        parcelasGrid.style.display = "grid";

        vencimentoInput.required = true;
        diaPagamentoSelect.required = false;
        diaPagamentoSelect.value = "1";
    }
}

tipoToggle.addEventListener("click", event => {
    const button = event.target.closest(".type-button");
    if (!button) return;

    document.querySelectorAll(".type-button").forEach(el => el.classList.remove("active"));
    button.classList.add("active");
    tipoSelecionado = button.dataset.value;
    atualizarCamposTipo();
});

form.addEventListener("submit", event => {
    event.preventDefault();

    const titulo = document.getElementById("titulo").value.trim();
    const valor = parseFloat(document.getElementById("valor").value.replace(",", ".")) || 0;
    const diaPagamento = diaPagamentoSelect.value;
    const vencimento = tipoSelecionado === "Receita" ? diaPagamento : vencimentoInput.value;
    const parcelas = parcelasSelect.value;
    const parcelaAtual = tipoSelecionado === "Receita" ? "1" : parcelaAtualInput.value;
    const categoria = document.getElementById("categoria").value;

    if (!titulo || !valor || !vencimento || !parcelaAtual) {
        return;
    }

    const totalParcelas = parseInt(parcelas);
    const grupoId = Date.now();

    for (let i = 0; i < totalParcelas; i++) {

        let dataParcela = new Date(vencimento);
        dataParcela.setMonth(dataParcela.getMonth() + i);

        const item = {
            grupoId,
            titulo,
            valor,
            vencimento: dataParcela.toISOString().split("T")[0],
            parcelas: totalParcelas,
            parcelaAtual: i + 1,
            categoria,
            tipo: tipoSelecionado,
        };

        registros.unshift(item);

        // Se houver BACKEND configurado e token, tente sincronizar cada parcela criada
        try {
            const token = localStorage.getItem('token');
            if (BACKEND && token) {
                fetch(`${BACKEND}/finances`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(item)
                }).then(res => {
                    if (!res.ok) return res.json().then(r => Promise.reject(r));
                    return res.json();
                }).catch(err => console.warn('Sync to backend failed', err));
            }
        } catch (e) {
            console.warn('Sync skipped', e);
        }

    }

form.reset();
document.querySelector(".type-button[data-value=\"Despesa\"]").classList.add("active");
document.querySelector(".type-button[data-value=\"Receita\"]").classList.remove("active");
tipoSelecionado = "Despesa";
atualizarCamposTipo();

atualizarDashboard();

});

filtroTipo.addEventListener("change", renderizarTabela);
filtroCategoria.addEventListener("change", renderizarTabela);

exportarBtn.addEventListener("click", () => {
    const csv = [
        ["Título", "Categoria", "Tipo", "Valor", "Vencimento", "Parcelas", "Status"],
        ...registros.map(item => [
            item.titulo,
            item.categoria,
            item.tipo,
            `R$ ${formatarMoeda(item.valor)}`,
            formatarVencimento(item),
            formatarParcela(item),
            calcularStatus(item),
        ])
    ].map(row => row.join(";")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "financas.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
});

atualizarDashboard();
atualizarCamposTipo();
