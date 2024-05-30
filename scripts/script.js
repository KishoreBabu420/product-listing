'use strict';

//elements
const productListContainer = document.getElementById('product-listing');
const btnLoadMore = document.getElementById('load-more');
const searchInputEl = document.getElementById('search-bar');
const categoryFilterEl = document.getElementById('category-filter');
const priceFilterEl = document.getElementById('price-filter');

//global variables
const API_URL = 'https://fakestoreapi.com/products';
let products = [];
let displayedProducts = 10;

//functions
//Filter Products
const filterProducts = () => {
  let filteredProducts = products;

  const searchQuery = searchInputEl.value.toLowerCase();
  if (searchQuery) {
    filteredProducts = filteredProducts.filter((product) =>
      product.title.toLowerCase().includes(searchQuery),
    );
  }

  const selectedCategory = categoryFilterEl.value;
  if (selectedCategory) {
    filteredProducts = filteredProducts.filter(
      (product) => product.category === selectedCategory,
    );
  }

  const maxPrice = parseFloat(priceFilterEl.value);
  filteredProducts = filteredProducts.filter(
    (product) => product.price <= maxPrice,
  );

  return filteredProducts;
};
//Render Products
const renderProducts = () => {
  productListContainer.innerHTML = ``;
  const filteredProducts = filterProducts();
  const productsToDisplay = filteredProducts.slice(0, displayedProducts);

  productsToDisplay.forEach((product) => {
    const productItem = document.createElement('div');
    productItem.classList.add('product-item');
    productItem.innerHTML = `
                <img src="${product.image}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p>$${product.price}</p>
                <p>${product.description}</p>
            `;
    productListContainer.appendChild(productItem);
  });

  if (displayedProducts >= filteredProducts.length) {
    btnLoadMore.style.display = 'none';
  } else {
    btnLoadMore.style.display = 'block';
  }
};
// Get category filters
const getCategories = () => {
  const categories = [...new Set(products.map((product) => product.category))];
  categories.forEach((category) => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilterEl.appendChild(option);
  });
};

//Fetch Products
const fetchProducts = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch products: ${response.status} ${response.statusText}`,
      );
    }
    const productsData = await response.json();
    products = productsData;
    renderProducts();
    getCategories();
    btnLoadMore.style.display = 'block';
  } catch (error) {
    console.error('Failed to fetch products:', error);
    productListContainer.innerHTML = `
      <p>Failed to load products. Please try again later.</p>
      <p>Error: ${error.message}</p>
    `;
  }
};

//event listeners

// Load more products
btnLoadMore.addEventListener('click', () => {
  displayedProducts += 10;
  renderProducts();
});

searchInputEl.addEventListener('input', renderProducts);
categoryFilterEl.addEventListener('change', renderProducts);
priceFilterEl.addEventListener('input', renderProducts);

//initial settings
document.addEventListener('DOMContentLoaded', fetchProducts);
