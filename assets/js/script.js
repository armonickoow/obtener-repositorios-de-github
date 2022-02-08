
// bloque 1: URL base para las peticiones
const baseUrl = 'https://api.github.com/users';

// bloque 2: Función que hace las peticiones a la API y retorna los resultados
const request = async (url) => {
    const results = await fetch(url);
    const response = await results.json();
    return response;
}

// bloque 3: Función que crea una url y llama a la función request()
// enviandole la url como parámetro
const getUser = async (usuario) => {
    const url = `${baseUrl}/${usuario}`
    return request(url);
}

// bloque 4: Función que crea una url y llama a la función request()
// enviandole la url como parámetro
const getRepo = async (usuario,pagina,cantidad_repos) => {
    const url = `${baseUrl}/${usuario}/repos?page=${pagina}&per_page=${cantidad_repos}`;
    return request(url);
}

// bloque 5: Ejecución de la aplicación por medio del evento submit,
// que realiza la implementación en base a Promesas 

let formulario = document.querySelector('form');

// Escucha evento submit del formulario
formulario.addEventListener('submit',(event) => {
    event.preventDefault();

    // Captura los valores de los campos del formulario
    const nombreUsuario = document.getElementById('nombre').value;
    const numeroPagina = document.getElementById('pagina').value;
    const repositoriosPorPagina = document.getElementById('repoPagina').value;


    

    // Promise.all llamando las dos funciones getUser() y getRepo()
    Promise.all([getUser(nombreUsuario),getRepo(nombreUsuario,numeroPagina,repositoriosPorPagina)])
    .then(resp =>{

        // Area de Resultados
        let resultados = document.getElementById('resultados');

        // IF-ELSE, IF para detectar error, else para mostrar datos en página web
        if(resp[0].name === null){
            // Limpia área de Resultados
            resultados.innerHTML = '';

            // Crea error personalizado
            throw new Error('El usuario no existe');
        } 
        else {
            // Agrega las filas a la columna 1
            resultados.innerHTML = `<table class='container'>
                                        <tr>
                                            <th>Datos de Usuario</th>
                                            <th>Nombre de Repositorios</th>
                                        </tr>
                                        <tr>
                                            <td class='p-3'>
                                                <img src=${resp[0].avatar_url} class='avatar'>
                                                <p>Nombre de usuario: ${resp[0].name}</p>
                                                <p>Nombre de login: ${resp[0].login}</p>
                                                <p>Cantidad de Repositorios: ${resp[0].public_repos}</p>
                                                <p>Localidad: ${resp[0].location}</p>
                                                <p>Tipo de usuario: ${resp[0].type}</p>
                                            </td>
                                            <td class='p-3' id='segunda_columna'>
                                                
                                            </td>
                                        </tr>
                                    </table>`;

            // Ciclo FOR para agregar repositorios en la columna 2
            for( let i=0; i < resp[1].length; i++){
                $('#segunda_columna').append(`<a href=${resp[1][i].html_url} target='_blank'>${resp[1][i].name}</a></br>`);
            }
        }
    })
    .catch(err => alert(err)); // Atrapa el error y muestra un alert() con el mensaje de error creado anteriormente

    // Limpia los campos del formulario en cada evento submit
    document.getElementById('nombre').value = '';
    document.getElementById('pagina').value = '';
    document.getElementById('repoPagina').value = '';
})
