// json-server --watch js/livros.json --port 3000
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('form-livro');
    const fileInput = document.getElementById('foto-livro');

    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const nome = document.getElementById('nome').value;
            const autor = document.getElementById('autor').value;
            const descricao = document.getElementById('descricao').value;
            const estrelas = document.querySelectorAll('.stars .fa-star.active').length;

            if (!nome || !autor || !descricao || fileInput.files.length === 0 || estrelas === 0) {
                alert('Por favor, preencha todos os campos obrigatórios e selecione uma avaliação!');
                return;
            }

           
            const file = fileInput.files[0];
            const fileName = `./img/${file.name}`;

            try {
             
                const response = await fetch('js/livros.json');
                if (!response.ok) {
                    throw new Error('Erro ao carregar o arquivo de livros');
                }

                const data = await response.json();
                const livros = data.livros; 
                if (!Array.isArray(livros)) {
                    throw new Error('Formato inválido dos livros: Esperado um array');
                }

                const newId = livros.length > 0 ? (Math.max(...livros.map(l => Number(l.id))) + 1).toString() : "1";

            
                const newBook = {
                    id: newId, 
                    nome,
                    autor,
                    descricao,
                    capa: fileName,
                    avaliacao: estrelas
                };

            
                livros.push(newBook);

             
                const saveResponse = await fetch('http://localhost:3000/livros', {
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newBook), 
                });

                if (saveResponse.ok) {
                    alert(`Livro cadastrado com sucesso! ID: ${newBook.id}`);
                    window.location.href = 'livros.html'; 
                } else {
                    throw new Error('Erro ao salvar o livro no arquivo JSON');
                }

            } catch (error) {
                console.error("Erro ao cadastrar o livro:", error);
                alert("Ocorreu um erro ao cadastrar o livro. Tente novamente mais tarde.");
            }
        });
    }

  
    const stars = document.querySelectorAll(".stars .fa-star");
    stars.forEach((star, index1) => {
        star.addEventListener("click", () => {
            stars.forEach((s, index2) => {
                s.classList.toggle("active", index2 <= index1);
            });
        });
    });
});
