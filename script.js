document.addEventListener('DOMContentLoaded', loadProducts);
const form = document.getElementById('product-form');



const productList = document.getElementById('product-list');





const totalCalories = document.getElementById('total-calories-value');

form.addEventListener('submit', addProduct);

function addDateHeader(day) {
    const productList = document.getElementById('product-list');
    const existingHeaders = document.querySelectorAll('.day');
    let existingHeader = false;

    existingHeaders.forEach(header => {
        if (header.textContent.trim() === `Date: ${day}`) {
            existingHeader = true;
        }
    });

    if (!existingHeader) {
        const dateHeader = document.createElement('h3');
        dateHeader.textContent = ` ${day}`;
        dateHeader.classList.add('day');
        productList.appendChild(dateHeader);

        // Добавляем элемент для среднего балла
        const averageElement = document.createElement('p');
        averageElement.textContent = `средний балл: `;
        averageElement.classList.add('average');
        dateHeader.appendChild(averageElement);

        // Обновляем средний балл при добавлении продукта
        function addProductToList(product) {
            if (product.day === day) {
                const products = getProducts();
                let totalCalories = 0;
                let count = 0;
                products.forEach(function(p) {
                    if (p.day === day) {
                        totalCalories += p.calories;
                        count++;
                    }
                });
                const average = totalCalories / count;
                averageElement.textContent = `Средний балл: ${average.toFixed(2)}`;
            }
        };

        // Вызываем функцию addProductToList для обновления среднего балла
        addProductToList({ day: day, calories: 0 });
    }
}
let lastDay = null;

function loadProducts() {
    const products = getProducts();
    let lastDay = null;

    products.forEach(function(product) {
        if (lastDay !== product.day) {
            addDateHeader(product.day);
            lastDay = product.day;
        }
        addProductToList(product);
    });

    updateTotalCalories();
}

function addProduct(event) {
    // event.preventDefault();
    const calories = parseInt(document.getElementById('calories').value);
    if (calories) {
        let date = new Date();
        const day = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear(); // Adding 1 to get the correct month
        const product = {
            id: Date.now(),
            calories: calories,
            day: day
        };

        addProductToList(product);
        saveProduct(product);
        updateTotalCalories();
        document.getElementById('calories').value = '';

        if (lastDay !== day) {
            addDateHeader(day);
            lastDay = day;
        }

        const productList = document.getElementById('product-list');
        const dateHeader = document.createElement('h3');
        dateHeader.textContent = `Date: ${day}`;
        productList.appendChild(dateHeader); // Add the date header at the bottom of the list
    }
}
function addProductToList(product) {
    
    const listItem = document.createElement('li');
    listItem.setAttribute('data-id', product.id); // Добавьте атрибут data-id
    listItem.textContent = product.calories;
    listItem.classList.add(product.day);
    
    const editButton = document.createElement('button');
    editButton.textContent = 'Редактировать';
    editButton.addEventListener('click', function() {
        // const updatedName = prompt('Введите новое название продукта:');
        const updatedCalories = parseInt(prompt('Введите новое количество калорий:'));
        
        if (!isNaN(updatedCalories)) {
            editProduct(product.id, {  calories: updatedCalories });
        }
    });
    
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Удалить';
    deleteButton.addEventListener('click', function() {
        deleteProduct(product.id);
        productList.removeChild(listItem);
        updateTotalCalories();
       
    });
    
    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);
    productList.appendChild(listItem);
}

function saveProduct(product) {
    const products = getProducts();
    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));
    console.log(products.length);
}

function deleteProduct(id) {
    const products = getProducts();
    const updatedProducts = products.filter(function(product) {
        return product.id !== id;
    });
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    updateTotalCalories();
}

function loadProducts() {
    const products = getProducts();
    let lastDay = null;

    products.forEach(function(product) {
        if (lastDay !== product.day) {
            addDateHeader(product.day);
            lastDay = product.day;
        }
        addProductToList(product);
    });

    updateTotalCalories();
}

function getProducts() {
    const products = localStorage.getItem('products');
    return products ? JSON.parse(products) : [];
}

function updateTotalCalories() {
    const products = getProducts();
    let totalCalories = 0;
    products.forEach(function(product) {
        totalCalories += product.calories;
    });
    const totalCaloriesElement = document.getElementById('total-calories-value');
    totalCaloriesElement.textContent = (totalCalories / products.length).toFixed(2);
}

function editProduct(id, updatedProduct) {
    const products = getProducts();
    const updatedProducts = products.map(product => {
        if (product.id === id) {
            return { ...product, ...updatedProduct };
        }
        return product;
    });
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    loadProducts();
}

function editProduct(id, updatedProduct) {
    const products = getProducts();
    const updatedProducts = products.map(product => {
        if (product.id === id) {
            return { ...product, ...updatedProduct };
        }
        return product;
    });
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    
    // Найдите элемент списка продукта и обновите его содержимое
    const listItem = document.querySelector(`li[data-id="${id}"]`);
    if (listItem) {
        listItem.textContent = updatedProduct.calories;
        
        // Добавьте кнопки "Редактировать" и "Удалить" заново
        const editButton = document.createElement('button');
        editButton.textContent = 'Редактировать';
        editButton.addEventListener('click', function() {
            // const updatedName = prompt('Введите новое название продукта:');
            const updatedCalories = parseInt(prompt('Введите новое количество калорий:'));
    
            if (!isNaN(updatedCalories)) {
                editProduct(id, {  calories: updatedCalories });
            }
        });
    
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Удалить';
        deleteButton.addEventListener('click', function() {
            deleteProduct(id);
            productList.removeChild(listItem);
            updateTotalCalories();
        });
    
        listItem.appendChild(editButton);
        listItem.appendChild(deleteButton);
    }
    
    updateTotalCalories();
}



