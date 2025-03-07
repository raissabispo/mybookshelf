
function pesquisarLivros() {
    const query = document.getElementById("pesquisar").value.toLowerCase();
    const mensagemErro = document.getElementById("mensagem-erro");

    if (!query) {
        mensagemErro.innerHTML = `
            <div class="mensagem-erro">
                <p>Nada foi encontrado. Precisa digitar o título do livro.</p>
            </div>
        `;
        return;
    }

    fetch('http://localhost:3000/livros')
        .then(response => response.json())
        .then(data => {
            const resultados = data.filter(livro =>
                livro.nome.toLowerCase().includes(query)
            );

            if (resultados.length === 0) {
                mensagemErro.innerHTML = `
                    <div class="mensagem-erro">
                        <p>Nenhum livro encontrado com esse título.</p>
                    </div>
                `;
            } else {
                mensagemErro.innerHTML = '';
                exibirResultados(resultados);
            }
        })
        .catch(error => {
            console.error('Erro ao buscar livros:', error);
            mensagemErro.innerHTML = `
                <div class="mensagem-erro">
                    <p>Ocorreu um erro ao buscar os livros. Tente novamente.</p>
                </div>
            `;
        });
}

function exibirResultados(resultados) {
    const divResultados = document.getElementById("livros");
    divResultados.innerHTML = '';

    resultados.forEach(livro => {
        const livroDiv = document.createElement("div");
        livroDiv.classList.add("livro");
        livroDiv.innerHTML = `
            <h3>${livro.nome}</h3>
            <p>Autor: ${livro.autor}</p>
            <p>${livro.descricao}</p>
            <img src="${livro.capa}" alt="${livro.nome}" width="150" />
            <p>Avaliação: ${'⭐'.repeat(Math.max(0, Math.min(5, livro.avaliacao || 0)))}</p>
            <button class="botao-editar-editar" data-id="${livro.id}">Editar</button>
            <button onclick="excluirLivro(${livro.id})" class="botao-editar-excluir">Excluir</button>
        `;

        divResultados.appendChild(livroDiv);
    });

    document.querySelectorAll(".botao-editar-editar").forEach(botao => {
        botao.addEventListener("click", function () {
            const livroId = this.getAttribute("data-id");
            editarLivro(livroId);
        });
    });
}

async function excluirLivro(id) {
    const confirmacao = confirm("Tem certeza que deseja excluir este livro?");
    if (!confirmacao) return;

    try {
        const resposta = await fetch(`http://localhost:3000/livros/${id}`, {
            method: 'DELETE'
        });

        if (!resposta.ok) {
            throw new Error(`Erro ao excluir o livro. Código: ${resposta.status}`);
        }

        alert("Livro excluído com sucesso!");
        pesquisarLivros();
    } catch (error) {
        console.error("Erro ao excluir o livro:", error);
    }
}

async function editarLivro(id) {
    try {
        const resposta = await fetch(`http://localhost:3000/livros/${id}`);
        const livro = await resposta.json();

        const formEditar = document.getElementById("form-editar-livro");
        formEditar.style.display = "block";
        formEditar.innerHTML = `
            <h3>Editar Livro</h3>
            <label for="editar-nome">Nome:</label>
            <input type="text" id="editar-nome" value="${livro.nome}">
            <label for="editar-autor">Autor:</label>
            <input type="text" id="editar-autor" value="${livro.autor}">
            <label for="editar-descricao">Descrição:</label>
            <textarea id="editar-descricao">${livro.descricao}</textarea>
            <label for="editar-avaliacao">Avaliação:</label>
            <input type="number" id="editar-avaliacao" value="${livro.avaliacao}" min="0" max="5">
            <label for="editar-imagem">Imagem (opcional):</label>
            <input type="file" id="editar-imagem" accept="image/*">
            <button onclick="salvarEdicao(${livro.id})" class="botao-salvar">Salvar</button>
            <button onclick="fecharFormulario()" class="botao-cancelar">Cancelar</button>
        `;
    } catch (error) {
        console.error("Erro ao buscar os dados do livro para edição:", error);
    }
}

async function salvarEdicao(id) {
    const nome = document.getElementById("editar-nome").value;
    const autor = document.getElementById("editar-autor").value;
    const descricao = document.getElementById("editar-descricao").value;
    const avaliacao = parseInt(document.getElementById("editar-avaliacao").value);
    const imagemInput = document.getElementById("editar-imagem");

    try {
        const resposta = await fetch(`http://localhost:3000/livros/${id}`);
        const livro = await resposta.json();

        const livroAtualizado = {
            nome,
            autor,
            descricao,
            avaliacao,
            capa: livro.capa 
        };

        if (imagemInput.files.length > 0) {
            const imagem = imagemInput.files[0];
            livroAtualizado.capa = `./img/${imagem.name}`; 
        }

        await salvarLivro(id, livroAtualizado);
    } catch (error) {
        console.error("Erro ao buscar os dados do livro para edição:", error);
    }
}

async function salvarLivro(id, livroAtualizado) {
    try {
        const resposta = await fetch(`http://localhost:3000/livros/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(livroAtualizado)
        });

        if (!resposta.ok) {
            throw new Error(`Erro ao salvar as alterações. Código: ${resposta.status}`);
        }

        alert("Livro atualizado com sucesso!");
        fecharFormulario();
        pesquisarLivros();
    } catch (error) {
        console.error("Erro ao salvar as alterações do livro:", error);
    }
}
function fecharFormulario() {
    document.getElementById("form-editar-livro").style.display = "none";
}
