// Obtiene el elemento de entrada de texto para mostrar el resultado
const display = document.getElementById('display'); 
// Contenedor de botones
const buttonsContainer = document.getElementById('buttonsContainer'); 
// Lista para mostrar el historial de cálculos
const historyList = document.getElementById('historyList'); 

// Array de botones disponibles en la calculadora
const buttons = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', '=', '+', 'C', 'AC'
];

// Itera sobre cada botón y crea un elemento de botón en el DOM
buttons.forEach(button => {   
    const btnElement = document.createElement('button'); 
    btnElement.textContent = button; 
    // Agrega clases de Bootstrap para estilizar los botones
    btnElement.classList.add('btn', 'btn-secondary', 'button', 'col-3'); 
    // Agrega el botón al contenedor en el DOM
    buttonsContainer.appendChild(btnElement); 

    // Agrega un evento click a cada botón
    btnElement.addEventListener('click', () => {
        // Si se hace clic en el botón de igual
        if (button === '=') { 
            try {
                // Evalúa la expresión matemática en el campo de texto de entrada
                const result = eval(display.value); 
                addToHistory(`${display.value} = ${result}`); 

                // Envia el cálculo al backend
                fetch('http://localhost:3000/calcular', {
                    // Método POST para enviar datos al servidor
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json' 
                    },
                    // Cuerpo de la solicitud: operación y resultado en formato JSON
                    body: JSON.stringify({ operacion: display.value, resultado: result }) 
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al guardar el cálculo'); 
                    }
                    console.log('Cálculo guardado correctamente en el backend');
                })
                .catch(error => {
                    console.error('Error al enviar el cálculo al backend:', error); 
                });

            } catch (error) {
                // Manejo de errores si ocurre un problema al evaluar la expresión
                display.value = 'Error'; 
            }           
        } else if (button === 'C') {            
            display.value = '';            
        } else if (button === 'AC') {            
            display.value = '';             
            historyList.innerHTML = '';             
        } else { 
            display.value += button; 
        }
    });
});

// Función para agregar un cálculo al historial
function addToHistory(calculation) {    
    const listItem = document.createElement('li');     
    listItem.classList.add('list-group-item');     
    listItem.textContent = calculation; 
    // Agrega el elemento de lista al historial en el DOM
    historyList.appendChild(listItem); 
}

// fetch para obtener el historial de operaciones
fetch('/historial')
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Error al obtener el historial');
    }).then(data => {
        console.log(data); // Datos del historial de operaciones
        // Actualizar la interfaz con el historial obtenido
        const historyList = document.getElementById('historyList');
        historyList.innerHTML = ''; // Limpiar lista existente
        data.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `Operación: ${item.operacion}, Resultado: ${item.resultado}`;
            historyList.appendChild(li);
        });
    }).catch(error => {
        console.error('Error:', error.message);
    });