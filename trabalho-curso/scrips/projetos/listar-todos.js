let tabelaProjetos = document.getElementById("tabela-projetos");
let botaoConsultarProjetos = document.getElementById("consultar-projetos");  // Alterado para corresponder ao ID no HTML

let urlApi = "https://public.franciscosensaulas.com";

// Função para atribuir os eventos de clique nos botões de apagar
function atribuirCliqueBotoesApagar() {
    let botoesApagar = document.getElementsByClassName("botao-apagar");
    Array.from(botoesApagar).forEach((botao) => {
        botao.addEventListener('click', apagar);
    });
}

// Função para confirmar e apagar o projeto
function apagar(evento) {
    const botaoClique = evento.target;
    const nome = botaoClique.getAttribute("data-nome");
    const id = botaoClique.getAttribute("data-id");

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
            apagarProjetos(id);
        }
    });
}

// Função para fazer a requisição de exclusão do projeto
async function apagarProjetos(id) {
    let url = `${urlApi}/api/v1/trabalho/projetos/${id}`;
    try {
        const resposta = await fetch(url, { method: "DELETE" });
        if (!resposta.ok) {
            throw new Error("Não foi possível apagar o projeto.");
        }

        Swal.fire({
            title: "Apagado!",
            text: "Projeto removido com sucesso!",
            icon: "success"
        });
        ConsultarProjetos(); // Recarregar a lista de projetos após apagar
    } catch (error) {
        console.error(error);
        Swal.fire({
            title: "Erro!",
            text: error.message,
            icon: "error"
        });
    }
}

// Função para consultar e listar todos os projetos
async function ConsultarProjetos() {
    let url = `${urlApi}/api/v1/trabalho/projetos`;
    try {
        const resposta = await fetch(url);
        if (!resposta.ok) {
            throw new Error("Não foi possível carregar os dados.");
        }

        const projetos = await resposta.json();
        let tbody = tabelaProjetos.querySelector("tbody");
        tbody.innerHTML = ""; // Limpar a tabela antes de preencher

        // Preencher a tabela com os projetos retornados pela API
        projetos.forEach(projeto => {
            const colunas = `
                <td>${projeto.id}</td>
                <td>${projeto.nome}</td>
                <td>${projeto.codigoProjeto || "Não disponível"}</td> <!-- Aqui foi alterado para 'codigoProjeto' -->
                <td>${projeto.custoEstimado !== null && projeto.custoEstimado !== undefined ? projeto.custoEstimado : "Não disponível"}</td> <!-- Aqui foi alterado para 'custoEstimado' -->
                <td>
                    <a href="editar.html?id=${projeto.id}" class="btn btn-warning">
                        <i class="fas fa-pencil"></i> Editar
                    </a>
                    <button class="btn btn-danger botao-apagar" data-id="${projeto.id}" data-nome="${projeto.nome}">
                        <i class="fas fa-trash"></i> Apagar
                    </button>
                </td>
            `;
            const linha = document.createElement("tr");
            linha.innerHTML = colunas;
            tbody.appendChild(linha);
        });

        atribuirCliqueBotoesApagar(); // Atribui os eventos de clique nos botões de apagar
    } catch (error) {
        console.error(error);
        Swal.fire({
            title: "Erro!",
            text: error.message,
            icon: "error"
        });
    }
}


// Adiciona o evento de clique para o botão de consultar projetos
botaoConsultarProjetos.addEventListener("click", ConsultarProjetos);

// Consultar os projetos ao carregar a página
ConsultarProjetos();
