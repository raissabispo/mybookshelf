
function pesquisarLivros() {
    const query = document.getElementById("pesquisar").value.toLowerCase();
    const mensagemErro = document.getElementById("mensagem-erro");  
    if (!query) {
        mensagemErro.innerHTML = `
            <div class="mensagem-erro">
                <p>Nada foi encontrado. Precisa digitar o Título do livro.</p>
            </div>
        `;
        return;
    }
    fetch('js/livros.json')
        .then(response => response.json())
        .then(data => {
            const resultados = data.filter(livro => 
                livro.titulo.toLowerCase().includes(query)
            );
            exibirResultados(resultados);
        });

       
}
    
function exibirResultados(resultados) {
    const divResultados = document.getElementById("livros");
    divResultados.innerHTML = '';
    resultados.forEach(livro => {
        const livroDiv = document.createElement("div");
        livroDiv.classList.add("livro");
        livroDiv.innerHTML = `
            <h2 class="titulo-livro">${livro.titulo}</h2>
            <p>${livro.autor}</p>
            <p>${livro.descricao}</p>
            <img src="${livro.capa}" alt="Capa do livro ${livro.titulo}">
        `;
        divResultados.appendChild(livroDiv);
    });
}