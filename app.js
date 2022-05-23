;(function() {
    'use strict';

    const API_URL = `http://localhost:3000/todos`;

    const getTodos = () => {
        fetch(API_URL)
            .then((response) => response.json())
            .then((todos) => {
                console.log(todos);
            })
            .catch((error) => console.log(error.message));
    }

    const init = () => {
        window.addEventListener("DOMContentLoaded", ()=>{
            getTodos();
        });
    };
    
    init();
})();