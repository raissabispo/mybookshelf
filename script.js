let nome = document.querySelector("#nome");
let autor = document.querySelector("#autor");
let  genero = document.querySelector("#genero");
let descricao = document.querySelector("#descricao");
let fotoLivro = document.querySelector("#foto-livro");


// estrelas

const stars = document.querySelectorAll(".stars i")
stars.forEach((star, index1) =>{
  star.addEventListener("click",()=>{
  
    stars.forEach((star, index2) =>{
        index1 >= index2 ? star.classList.add("active") : star.classList.remove("active");
    });
  });
});