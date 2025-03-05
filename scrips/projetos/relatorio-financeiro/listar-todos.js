document.addEventListener('DOMContentLoaded', function () {
    const urlApi = "https://public.franciscosensaulas.com";  // URL da API
    const tabelaRelatorio = document.getElementById("tabela-relatorio")?.getElementsByTagName('tbody')[0];  // Correção para tabela-relatorio
    const btnConsultarRelatorio = document.getElementById("consultar-relatorio"); // Correção do ID
    const btnPesquisar = document.getElementById("btn-pesquisar");
    const campoPesquisa = document.getElementById("search");

    // Verifica se os elementos essenciais estão presentes no DOM
    if (!tabelaRelatorio || !btnConsultarRelatorio || !btnPesquisar || !campoPesquisa) {
        console.error("Um ou mais elementos não foram encontrados no DOM.");
        return;  // Encerra a execução do script se algum dos elementos não existir
    }

    // Função para consultar todos os relatórios
    async function consultarRelatorio() {
        const url = `${urlApi}/api/v1/trabalho/relatorios-financeiros`;  // URL atualizada
        try {
            const resposta = await fetch(url);
            if (!resposta.ok) throw new Error("Não foi possível carregar os dados.");
            const relatorios = await resposta.json();
            preencherTabela(relatorios);  // Usando 'relatorios' no lugar de 'projetos'
        } catch (erro) {
            console.error(erro);
            Swal.fire({
                title: "Erro!",
                text: erro.message,
                icon: "error"
            });
        }
    }

    // Função para pesquisar um relatório por ID
    async function pesquisarRelatorioPorId(id) {
        const url = `${urlApi}/api/v1/trabalho/relatorios-financeiros/${id}`;  // URL atualizada
        try {
            const resposta = await fetch(url);
            if (!resposta.ok) throw new Error("Relatório não encontrado.");
            const relatorio = await resposta.json();
            preencherTabela([relatorio]);  // Passa um array com o relatório encontrado
        } catch (erro) {
            console.error(erro);
            Swal.fire({
                title: "Erro!",
                text: erro.message,
                icon: "error"
            });
        }
    }

    // Função para preencher a tabela com os relatórios
    function preencherTabela(relatorios) {
        tabelaRelatorio.innerHTML = "";  // Limpa a tabela antes de preencher

        relatorios.forEach(relatorio => {
            const linha = document.createElement("tr");

            // Adiciona as células na linha da tabela
            linha.innerHTML = `
                <td>${relatorio.id}</td>
                <td>${relatorio.titulo}</td>
                <td>${relatorio.tipo || "Não disponível"}</td>
                <td>${relatorio.valorTotal !== null && relatorio.valorTotal !== undefined ? relatorio.valorTotal : "Não disponível"}</td>
                <td>${relatorio.dataEmissao || "Não disponível"}</td>
                <td>${relatorio.responsavel || "Não disponível"}</td>
                <td>
                    <a href="editar.html?id=${relatorio.id}" class="btn btn-warning">
                        <i class="fas fa-pencil-alt"></i> Editar
                    </a>
                    <button class="btn btn-danger botao-apagar" data-id="${relatorio.id}" data-titulo="${relatorio.titulo}">
                        <i class="fas fa-trash"></i> Apagar
                    </button>
                </td>
            `;
            tabelaRelatorio.appendChild(linha);
        });

        // Atribui o evento de clique para o botão de apagar
        atribuirCliqueBotoesApagar();
    }

    // Função para atribuir o evento de clique para o botão de apagar
    function atribuirCliqueBotoesApagar() {
        const botoesApagar = document.querySelectorAll(".botao-apagar");
        botoesApagar.forEach(botao => {
            botao.addEventListener('click', function (evento) {
                const titulo = botao.getAttribute("data-titulo");
                const id = botao.getAttribute("data-id");

                Swal.fire({
                    title: `Deseja apagar o cadastro do relatório '${titulo}'?`,
                    text: "Você não poderá reverter isso!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Sim, apagar!",
                    cancelButtonText: "Não",
                    reverseButtons: true
                }).then((result) => {
                    if (result.isConfirmed) {
                        apagarRelatorio(id);  // Chama a função para apagar o relatório
                    }
                });
            });
        });
    }

    // Função para apagar um relatório
    async function apagarRelatorio(id) {
        const url = `${urlApi}/api/v1/trabalho/relatorios-financeiros/${id}`;  // URL atualizada
        try {
            const resposta = await fetch(url, { method: "DELETE" });
            if (!resposta.ok) throw new Error("Não foi possível apagar o relatório.");

            Swal.fire({
                title: "Apagado!",
                text: "Relatório removido com sucesso!",
                icon: "success"
            });

            consultarRelatorio();  // Recarrega a lista de relatórios após apagar
        } catch (erro) {
            console.error(erro);
            Swal.fire({
                title: "Erro!",
                text: erro.message,
                icon: "error"
            });
        }
    }

    // Evento de clique no botão "Consultar Relatórios"
    btnConsultarRelatorio.addEventListener("click", consultarRelatorio);

    // Evento de clique no botão "Buscar"
    btnPesquisar.addEventListener("click", function () {
        const pesquisa = campoPesquisa.value.trim();
        if (pesquisa === "") {
            Swal.fire({
                title: "Erro!",
                text: "Digite um ID válido para pesquisa.",
                icon: "error"
            });
            return;
        }

        if (isNaN(pesquisa) || parseInt(pesquisa) <= 0) {
            Swal.fire({
                title: "Erro!",
                text: "Por favor, insira um ID numérico válido.",
                icon: "error"
            });
            return;
        }

        // Chama a função para pesquisar o relatório por ID
        pesquisarRelatorioPorId(pesquisa);
    });

    // Consulta todos os relatórios ao carregar a página
    consultarRelatorio();
});
