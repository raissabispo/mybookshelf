
function enviar(event) {
  event.preventDefault(); 

  let nome = document.getElementById('nome').value;
  let autor = document.getElementById('autor').value;
  let descricao = document.getElementById('descricao').value;
  let foto = document.getElementById('foto-livro').value;
  let estrelas = document.querySelectorAll('.stars .fa-star.active').length;

  if (nome === '' || autor === '' || descricao === '' || foto === '') {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return false;
  } else {
      alert(`Livro Cadastrado com sucesso!\n
             Nome: ${nome}\n
             Autor: ${autor}\n
             Descrição: ${descricao}\n
             Foto: ${foto}\n
             Avaliação: ${estrelas} estrelas`);
  }
}

const stars = document.querySelectorAll(".stars .fa-star");
stars.forEach((star, index1) => {
  star.addEventListener("click", () => {
      stars.forEach((star, index2) => {
          if (index1 >= index2) {
              star.classList.add("active");
          } else {
              star.classList.remove("active");
          }
      });
  });
});


ScrollReveal().reveal('.apresentacao', {
    origin: 'left',
    duration: 2000,
    distance: '30%'
});

ScrollReveal().reveal('.livros-recentes', {
    origin: 'left',
    duration: 2000,
    distance: '30%'
});

