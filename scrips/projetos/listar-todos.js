document.addEventListener('DOMContentLoaded', function () {
    const urlApi = "https://public.franciscosensaulas.com";  // URL da API
    const tabelaProjetos = document.getElementById("tabela-projetos").getElementsByTagName('tbody')[0];
    const btnConsultarProjetos = document.getElementById("consultar-projetos");
    const btnPesquisar = document.getElementById("btn-pesquisar");
    const campoPesquisa = document.getElementById("search");

    // Função para consultar todos os projetos
    async function consultarProjetos() {
        const url = `${urlApi}/api/v1/trabalho/projetos`;
        try {
            const resposta = await fetch(url);
            if (!resposta.ok) throw new Error("Não foi possível carregar os dados.");
            const projetos = await resposta.json();
            preencherTabela(projetos);
        } catch (erro) {
            console.error(erro);
            Swal.fire({
                title: "Erro!",
                text: erro.message,
                icon: "error"
            });
        }
    }

    // Função para pesquisar um projeto por ID
    async function pesquisarProjetoPorId(id) {
        const url = `${urlApi}/api/v1/trabalho/projetos/${id}`;
        try {
            const resposta = await fetch(url);
            if (!resposta.ok) throw new Error("Projeto não encontrado.");
            const projeto = await resposta.json();
            preencherTabela([projeto]);  // Passa um array com o projeto encontrado
        } catch (erro) {
            console.error(erro);
            Swal.fire({
                title: "Erro!",
                text: erro.message,
                icon: "error"
            });
        }
    }

    // Função para preencher a tabela com os projetos
    function preencherTabela(projetos) {
        tabelaProjetos.innerHTML = "";  // Limpa a tabela antes de preencher

        projetos.forEach(projeto => {
            const linha = document.createElement("tr");

            // Adiciona as células na linha da tabela
            linha.innerHTML = `
                <td>${projeto.id}</td>
                <td>${projeto.nome}</td>
                <td>${projeto.codigoProjeto || "Não disponível"}</td>
                <td>${projeto.custoEstimado !== null && projeto.custoEstimado !== undefined ? projeto.custoEstimado : "Não disponível"}</td>
                <td>
                    <a href="editar.html?id=${projeto.id}" class="btn btn-warning">
                        <i class="fas fa-pencil-alt"></i> Editar
                    </a>
                    <button class="btn btn-danger botao-apagar" data-id="${projeto.id}" data-nome="${projeto.nome}">
                        <i class="fas fa-trash"></i> Apagar
                    </button>
                </td>
            `;
            tabelaProjetos.appendChild(linha);
        });

        // Atribui o evento de clique para o botão de apagar
        atribuirCliqueBotoesApagar();
    }

    // Função para atribuir o evento de clique para o botão de apagar
    function atribuirCliqueBotoesApagar() {
        const botoesApagar = document.querySelectorAll(".botao-apagar");
        botoesApagar.forEach(botao => {
            botao.addEventListener('click', function (evento) {
                const nome = botao.getAttribute("data-nome");
                const id = botao.getAttribute("data-id");

                Swal.fire({
                    title: `Deseja apagar o cadastro do projeto '${nome}'?`,
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
                        apagarProjeto(id);
                    }
                });
            });
        });
    }

    // Função para apagar um projeto
    async function apagarProjeto(id) {
        const url = `${urlApi}/api/v1/trabalho/projetos/${id}`;
        try {
            const resposta = await fetch(url, { method: "DELETE" });
            if (!resposta.ok) throw new Error("Não foi possível apagar o projeto.");

            Swal.fire({
                title: "Apagado!",
                text: "Projeto removido com sucesso!",
                icon: "success"
            });

            consultarProjetos();  // Recarrega a lista de projetos após apagar
        } catch (erro) {
            console.error(erro);
            Swal.fire({
                title: "Erro!",
                text: erro.message,
                icon: "error"
            });
        }
    }

    // Evento de clique no botão "Consultar Projetos"
    btnConsultarProjetos.addEventListener("click", consultarProjetos);

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

        // Chama a função para pesquisar o projeto por ID
        pesquisarProjetoPorId(pesquisa);
    });

    // Consulta todos os projetos ao carregar a página
    consultarProjetos();
});


