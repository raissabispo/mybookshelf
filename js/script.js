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

            const livros = JSON.parse(localStorage.getItem('livros')) || [];

            const newId = livros.length > 0 ? Math.max(...livros.map(l => parseInt(l.id, 10))) + 1 : 1;

            const newBook = {
                id: newId,
                nome,
                autor,
                descricao,
                capa: fileName,
                avaliacao: estrelas
            };

            livros.push(newBook);
            localStorage.setItem('livros', JSON.stringify(livros));

            alert("Livro cadastrado com sucesso!");
            window.location.href = 'livros.html';
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
