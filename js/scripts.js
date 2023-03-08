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
    listItem.classList.add ('list-group-item');
    let button=document.createElement('button');
    button.innerText= pokemon.name;
    button.classList.add('btn');
    button.classList.add('btn-outline-primary');
    button.classList.add('btn-lg');
    button.classList.add('btn-block');
    button.setAttribute('data-toggle','modal');
    button.setAttribute('data-target','#exampleModal');
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

      //here we write code for the Modal
      let modalBody = $(".modal-body");
      let modalTitle =$(".modal-title");
      let modalHeader = $(".modal-header");
      modalTitle.empty ();
      modalBody.empty();
      //creating element for name in modal content
      let nameElement = $("<h1>"+ pokemon.name + "</h1>");
      //creating img in modal content
      let imageElement = $('<img class="modal-img" style="width:50%">');
      imageElement.attr("src", pokemon.imageUrl);
      let heightElement = $("<p>"+"height:"+ pokemon.height + "</p>");

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
      //let typesElement = $("<p>" + "types:" + pokemon.types + "<p>");
      modalTitle.append(nameElement);
      modalBody.append(imageElement);
      modalBody.append(heightElement);
      modalBody.append(contentElement);
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
