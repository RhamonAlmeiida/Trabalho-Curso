
let urlApi = "https://public.franciscosensaulas.com/api/v1/trabalho/projetos/";

// Referência ao botão de pesquisa e campo de input para ID
const btnPesquisar = document.getElementById("btn-pesquisar");
const campoPesquisa = document.getElementById("search");

// Evento de clique no botão de pesquisa
btnPesquisar.addEventListener('click', function() {
    const pesquisa = campoPesquisa.value;

    // Validando se o campo está vazio ou contém um valor inválido
    if (pesquisa.trim() === "") {
        alert("Digite um ID válido.");
        return;
    }

    if (isNaN(pesquisa) || parseInt(pesquisa) <= 0) {
        alert("Por favor, insira um ID numérico válido.");
        return;
    }

    // Procurar o projeto pelo ID
    consultarProjetoPorId(pesquisa);
});

// Função para consultar o projeto por ID
async function consultarProjetoPorId(id) {
    const urlProjeto = `${urlApi}/api/v1/trabalho/projetos/${id}`;

    try {
        const resposta = await fetch(urlProjeto);

        // Verificando se a resposta foi bem-sucedida
        if (!resposta.ok) {
            throw new Error("Projeto não encontrado.");
        }

        const projeto = await resposta.json();
        preencherTabelaProjeto(projeto);  // Preenche a tabela com o projeto encontrado

    } catch (erro) {
        console.error(erro);
        alert(erro.message);  // Exibe mensagem de erro se o projeto não for encontrado
    }
}

// Função para preencher a tabela com os dados do projeto
function preencherTabelaProjeto(projeto) {
    const tabelaProjetos = document.getElementById('tabela-projetos').getElementsByTagName('tbody')[0];
    tabelaProjetos.innerHTML = "";  // Limpa qualquer dado anterior na tabela

    const linha = tabelaProjetos.insertRow();

    const celulaId = linha.insertCell(0);
    celulaId.textContent = projeto.id;

    const celulaNome = linha.insertCell(1);
    celulaNome.textContent = projeto.nome;

    const celulaCodigo = linha.insertCell(2);
    celulaCodigo.textContent = projeto.codigoProjeto;

    const celulaCusto = linha.insertCell(3);
    celulaCusto.textContent = projeto.custoEstimado;

    const celulaAcoes = linha.insertCell(4);
    celulaAcoes.innerHTML = `
        <a href="editar.html?id=${projeto.id}" class="btn btn-warning">
            <i class="fas fa-pencil-alt"></i> Editar
        </a>
        <button class="btn btn-danger" onclick="apagarProjeto(${projeto.id})">
            <i class="fas fa-trash"></i> Apagar
        </button>
    `;
}

// Função para apagar o projeto (caso necessário)
async function apagarProjeto(id) {
    const url = `${urlApi}/api/v1/trabalho/projetos/${id}`;

    // Confirmar a exclusão
    if (!confirm("Tem certeza que deseja apagar este projeto?")) {
        return;  // Se o usuário cancelar, não faz nada
    }

    try {
        const resposta = await fetch(url, { method: 'DELETE' });

        if (resposta.ok) {
            alert("Projeto apagado com sucesso!");
            // Após apagar, limpamos a tabela ou podemos redirecionar para outra página
            document.getElementById('tabela-projetos').getElementsByTagName('tbody')[0].innerHTML = "";
        } else {
            const errorData = await resposta.json();
            alert(`Erro ao tentar apagar o projeto: ${errorData.message || 'Erro desconhecido'}`);
        }
    } catch (erro) {
        console.error(erro);
        alert("Erro ao tentar apagar o projeto.");
    }
}
