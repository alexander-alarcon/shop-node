const toggler = document.getElementById('toggler');
const navItems = document.getElementById('nav-items');
const alertButton = document.getElementById('alert-button');
const alert = document.getElementById('alert');

let isOpen = false;

toggler.addEventListener('click', () => {
  isOpen = !isOpen;
  if (isOpen) {
    navItems.classList.remove('hidden');
    navItems.classList.add('block');
  } else {
    navItems.classList.remove('block');
    navItems.classList.add('hidden');
  }
});

const getDetails = (productId) => {
  window.location.href = `/shop/${productId}`;
};

const editProduct = (id) => {
  window.location.href = `/admin/edit-product/${id}?edit=true`;
};

alertButton.addEventListener('click', () => {
  alert.style.opacity = '0';
  setTimeout(() => {
    alert.remove();
  }, 400);
});
