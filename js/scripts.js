let pokemonRepository = (function (){

  //empty array to load from api
  let pokemonList = [];

  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/';

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
    button.addEventListener('click', function(){showDetails(pokemon)});
  }


  //load a list of pokemon from api. Promise fetch function.
  function loadList() {
    return fetch(apiUrl).then(function (response) {
      // convert response to json
      return response.json();
    }).then(function (json) {
      // api uses 'results' for array of pokemon. Each result, we are calling item.
      //For each item, we assign keys to parameters (items from api)
      json.results.forEach(function (item) {
        let pokemon = {
          name: item.name,
          detailsUrl: item.url
        };
        // add function which pushes pokemon
        add(pokemon);
      });
      // if any error occurs, it will be cought right here
    }).catch(function (e) {
      console.error(e);
    })
  }

  //load pokemon details - promise (image, height, type)
  function loadDetails(item) {
    console.log("Loading details", item)
    // defining url from json results and then fetching those details
    let url = item.detailsUrl;
    return fetch(url).then(function (response) {
      return response.json();
    }).then(function (details) {
      // Now we add the details to the item. Details coming from api (all the info on each pokemon)
      //after selecting which detail is needed (sprites, height, types-array)
      item.imageUrl = details.sprites.front_default;
      item.height = details.height;
      item.types = details.types;
      //// any errors will be cought here
    }).catch(function (e) {
      console.error(e);
    });
  }

  // info to log when pokemon is clicked. Execute loadDetails and pass pokemon as parameter and then executes
  function showDetails(pokemon) {
    loadDetails(pokemon).then(function () {
      let modalContainer = document.querySelector ('#modal-container');

      modalContainer.innerHTML = '';

      let modal = document.createElement('div');
      modal.classList.add ('modal');

      let sprite = document.createElement('img');
      sprite.classList.add ('sprite');
      sprite.src = pokemon.imageUrl;

      let closeButtonElement = document.createElement ('button');
      closeButtonElement.classList.add('modal-close');
      closeButtonElement.innerText = 'X';
      closeButtonElement.addEventListener ('click', hideModal)

      let titleElement = document.createElement ('h1');
      titleElement.innerText =  (pokemon.name);

      let contentElement = document.createElement ('p');

      // variable declared as empty string to be used to store the names of the types
      let pokemonTypes = "";

      // for loop used to iterate through the pokemon.types object.
      for (let i = 0; i < pokemon.types.length; i++) {
        //name of the current type is concatenated to the typeNames variable (appending to the end of the string)
        pokemonTypes += pokemon.types[i].type.name;
        //if i is less than length - 1, a comma and space are added to typeNames (to avoid adding comma after las type)
        if (i < pokemon.types.length - 1) {
          pokemonTypes += ", ";
        }
      }

      // value of typeNames is then assigned to the innertext property of contentElement.
      contentElement.innerText =('Height: ' + pokemon.height + '\n' +  '\n' + 'Types: ' + pokemonTypes);


      modal.appendChild (closeButtonElement);
      modal.appendChild (titleElement);
      modal.appendChild (contentElement);
      modalContainer.appendChild (modal);
      modal.appendChild (sprite);


      modalContainer.classList.add('is-visible');


      function hideModal (){
        modalContainer.classList.remove ('is-visible');
      }

      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')){
          hideModal();
        }
      });

      modalContainer.addEventListener('click', (e) => {
        let target = e.target;
        if (target === modalContainer) {
          hideModal();
        }
      });
    });
  }

  // all functions to return
  return {
    getAll:getAll,
    add:add,
    addListItem:addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showDetails: showDetails,
  }
})()

// function that goes through the list of pokemon and displays them on index
pokemonRepository.loadList().then(function() {
  pokemonRepository.getAll().forEach(function(pokemon){
    pokemonRepository.addListItem(pokemon);
  });
});
