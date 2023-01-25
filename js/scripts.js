let pokemonRepository = (function (){
  let pokemonList = [
      {
      name:'Bulbasaur',
      height: 7,
      types: ['grass','poison']
    },
    {
      name:'Ivysaur',
      height: 1,
      types: ['grass','poison']
    },
    {
      name: 'Venusaur',
      height: 2,
      types: ['grass','poison']
    },
    {
      name:'Charmander',
      height: 6,
      types: ['fire']
    }
  ]

function getAll(){
  return pokemonList;
}

function add(pokemon){
  pokemonList.push (pokemon);
}

function addListItem(pokemon){
  let container=document.querySelector('.pokemon-list');
  let listItem=document.createElement('li');
  let button=document.createElement('button');
  button.innerText= pokemon.name;
  button.classList.add('buttonStyle');
  listItem.appendChild (button);
  container.appendChild (listItem);
  button.addEventListener('click', function(event){showPokemonDetails(pokemon)});
}


function showPokemonDetails(pokemonArgument) {
  console.log(pokemonArgument);
}

return {
  getAll:getAll,
  add:add,
  addListItem:addListItem,
  }
})()

pokemonRepository.getAll().forEach(function(pokemon){
pokemonRepository.addListItem(pokemon);
});
