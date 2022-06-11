let products

let page = 'user'

fetch('./products.json').then(res => res.json()).then(json => {
  products = json
}).then(() => {
  if (page === 'user') {
    renderPage()
  } else {
    renderAdminPage()
  }
})

let basket = []

function renderPage() {
  document.getElementById('app').innerHTML = `
    <header class="header">
    <nav class="navbar navbar-expand-lg bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <img class="logo" src="images/logo.png" alt="">
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="#">Главная</a>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Категории
              </a>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                <li class="dropdown-item" data-bs-toggle="modal" data-bs-target="#categories" onclick="category('smartphone', 'Смартфоны')">Смартфоны</li>
                <li class="dropdown-item" data-bs-toggle="modal" data-bs-target="#categories" onclick="category('tablet', 'Планшеты')">Планшеты</li>
                <li class="dropdown-item" data-bs-toggle="modal" data-bs-target="#categories" onclick="category('notebook', 'Ноутбуки')">Ноутбуки</li>
              </ul>
            </li>
            <li class="nav-item">
              <div class="nav-link" data-bs-toggle="modal" data-bs-target="#basket">Корзина</div>
            </li>
          </ul>
          <div class="nav-link active" aria-current="page" onclick="renderAdminPage()">Админка</div>
          <form id="found" class="d-flex" role="search">
            <input id="search" class="form-control me-2" type="search" placeholder="Поиск" aria-label="Search">
            <div id="found-products"></div>
          </form>
        </div>
      </div>
    </nav>
  </header>

  <div class="modal fade" id="categories" tabindex="-1" aria-labelledby="categoriesLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="categoriesLabel">Смартфоны</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div id="categoriesItems" class="modal-body"></div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Закрыть</button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="basket" tabindex="-1" aria-labelledby="basketLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="basketLabel">Корзина</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div id="basketInner" class="modal-body">Корзина пуста</div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Продолжить покупки</button>
          <button type="button" class="btn btn-success" data-bs-dismiss="modal" onclick="buy()">Подтвердить</button>
        </div>
      </div>
    </div>
  </div>

  <div id="carouselExampleControls" class="carousel slide slider" data-bs-ride="carousel">
    <div class="carousel-inner">
      <div class="carousel-item active">
        <img src="images/slider-1.jpg" class="d-block w-100" alt="slide">
      </div>
      <div class="carousel-item">
        <img src="images/slider-2.webp" class="d-block w-100" alt="slide">
      </div>
      <div class="carousel-item">
        <img src="images/slider-3.jpg" class="d-block w-100" alt="slide">
      </div>
    </div>
    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  </div>

  <div id="products" class="container mt-5 mb-5"></div>

  <footer class="footer">
    <nav class="navbar bg-light">
      <div class="container">
        Tech Shop
      </div>
    </nav>
  </footer>
  `
  const search = document.getElementById('search')
  search.oninput = event => {
    let found = []
    let $found = ['<ul class="list-group">']
    const foundProducts = document.getElementById('found-products')
    products.forEach((item) => {
      if (item.name.toLowerCase().includes(event.target.value.toLowerCase())) {
        found.push(item)
      }
    })
    if (!event.target.value) {
      found = []
    }
    if (found.length !== 0) {
      found.forEach(item => {
        $found.push(`
        <li class="list-group-item">
          <div>
            <div class="mb-1">${item.name}</div>
            <div class="mb-1">${item.price} грн.</div>
          </div>
          <div class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#basket" onclick="addToBasket(${item.id})">Купить</div>
        </li>
      `)
      })
      $found.push('</ul>')
      foundProducts.innerHTML = $found.join('')
    } else {
      foundProducts.innerHTML = ''
    }
  }
  renderProducts()
}

function renderAdminPage() {
  document.getElementById('app').innerHTML = `
    <header class="header header-admin">
      <div class="container">
        <div class="header-admin__inner">
          <div class="logo" onclick="renderPage()">
            <img class="logo" src="images/logo.png" alt="">
          </div>
          <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#addProduct" onclick="resetAddData()">Добавить товар</button>
        </div>
      </div>
    </header>
    <div class="admin">
      <div class="container">
      <input id="admin-search" class="form-control me-2" type="search" placeholder="Поиск" aria-label="Search" oninput="adminSearch()">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">id</th>
              <th scope="col">Название</th>
              <th scope="col">Цена</th>
              <th scope="col">Удалить</th>
            </tr>
          </thead>
          <tbody id="table__body"></tbody>
        </table>
        <div id="admin-products__not-found"></div>
      </div>
      <div class="modal" id="addProduct" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Добавить продукт</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="input-group mb-3">
              <input id="input-file" type="file" accept="image/*" class="form-control">
            </div>
            <div class="input-group mb-3">
              <input id="input-name" type="text" class="form-control" placeholder="Название">
            </div>
            <div class="input-group mb-3">
              <input id="input-price" type="number" class="form-control" placeholder="Цена">
              <span class="input-group-text">грн</span>
            </div>
            <div class="input-group mb-3">
              <select class="form-select" id="input-category">
                <option value="smartphone">Смартфоны</option>
                <option value="tablet">Планшеты</option>
                <option value="notebook">Ноутбуки</option>
              </select>
              <label class="input-group-text" for="inputGroupSelect02">Категория</label>
            </div>
          </div>
          <div class="modal-footer">
            <button id="close-add-modal" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отменить</button>
            <button type="button" class="btn btn-primary" onclick="addProduct()">Сохранить</button>
          </div>
        </div>
      </div>
    </div>
    </div>
  `
  renderAdminTable()
}

function renderProducts() {
  const productsHTML = ['<div class="row">']
  products.forEach((item, index) => {
    productsHTML.push(`
    <div class="card col m-1" style="width: 18rem;">
      <img src="${item.img}" class="card-img-top" alt="${item.name}">
      <div class="card-body">
        <h5 class="card-title">${item.name}</h5>
        <p class="card-text">${item.price} грн.</p>
        <div class="card-bottom">
          <div class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#basket" onclick="addToBasket(${item.id})">Купить</div>
          <div class="card-rating">
            ${renderStars(item, true)}
          </div>
        </div>
      </div>
    </div>
  `)
    if (index % 3 === 0 && index !== 0) {
      productsHTML.push(`</div><div class="row">`)
    }
  })
  document.getElementById('products').innerHTML = productsHTML.join('')
}

function category(category, title) {
  document.getElementById('categoriesLabel').innerHTML = title
  const itemsHTML = []
  products.forEach(item => {
    if (item.category === category) {
      itemsHTML.push(`
        <div class="card col m-1" style="width: 18rem;">
          <img src="${item.img}" class="card-img-top" alt="${item.name}">
          <div class="card-body">
            <h5 class="card-title">${item.name}</h5>
            <p class="card-text">${item.price} грн.</p>
            <div class="card-bottom">
          <div class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#basket" onclick="addToBasket(${item.id})">Купить</div>
          <div class="card-rating">
            ${renderStars(item, false)}
          </div>
        </div>
          </div>
        </div>
      `)
    }
  })
  document.getElementById('categoriesItems').innerHTML = itemsHTML.join('')
}



function addToBasket(id) {
  products.forEach(item => {
    if (item.id === id) {
      basket.push(item)
    }
  })
  renderBasket()
}

function clearBasket() {
  basket = []
  renderBasket()
}

function renderBasket() {
  const basketHTML = document.getElementById('basketInner')
  if (basket.length !== 0) {
    let $basket = ['<ul class="list-group">']
    let totalPrice = 0
    $basket.push('</ul>')
    basket.forEach(item => {
      totalPrice += item.price
      $basket.push(`
        <li class="list-group-item row">
          <div class="col">${item.name}</div>
          <div class="col">${item.price} грн.</div>
        </li>
      `)
    })
    $basket.push(`
    <button type="button" class="btn btn-danger mt-3 d-grid gap-2 col-6 mx-auto" onclick="clearBasket()">Очистить корзину</button>
    <hr />
    <div class="basket__price container row mt-3">
      <div class="basket__price-text col">Цена:</div>
      <div class="basket__price-num col">${totalPrice} грн.</div>
    </div>
    `)
    basketHTML.innerHTML = $basket.join('')
  } else {
    basketHTML.innerHTML = 'Корзина пуста'
  }
}

function buy() {
  setTimeout(() => {
    alert('Поздравляем с покупкой!')
  }, 200)
  clearBasket()
}

function renderStars(product, editable) {
  let starsHTML = []
  for (let i = 1; i <= 5; i++) {
    if (i <= product.rating) {
      starsHTML.push(`<i class="star star_active fa fa-solid fa-star ${editable ? '' : 'star__category'}" ${editable ? `onclick="ratingItem(${product.id}, ${i})"` : ''}></i>`)
    } else {
      starsHTML.push(`<i class="star fa fa-solid fa-star ${editable ? '' : 'star__category'}" ${editable ? `onclick="ratingItem(${product.id}, ${i})"` : ''}></i>`)
    }
  }
  return starsHTML.join('')
}

function ratingItem(id, stars) {
  products.map(product => {
    if(product.id === id) {
      product.rating = stars
    }
    return product
  })
  renderProducts()
}

// ADMIN
function renderAdminTable(adminProducts = false) {
  let tableHTML = []
  let notFound = document.getElementById('admin-products__not-found')
  if(adminProducts) {
    for (let i = 0; i < adminProducts.length; i++) {
      tableHTML.push(`
      <tr>
        <th scope="row">${i}</th>
        <td>${adminProducts[i].name}</td>
        <td>${adminProducts[i].price} грн.</td>
        <td><i class="admin__delete fa fa-close" onclick="deleteProduct(${i})"></i></td>
      </tr>
    `)
    }
    if(adminProducts.length === 0) {
      notFound.innerHTML = '<p class="not-found">Товаров по вашему запросу не найдено.</p>'
    } else {
      notFound.innerHTML = ''
    }
  } else {
    for (let i = 0; i < products.length; i++) {
      tableHTML.push(`
      <tr>
        <th scope="row">${i}</th>
        <td>${products[i].name}</td>
        <td>${products[i].price} грн.</td>
        <td><i class="admin__delete fa fa-close" onclick="deleteProduct(${i})"></i></td>
      </tr>
    `)
    }
  }
  document.getElementById('table__body').innerHTML = tableHTML.join('')
}

function adminSearch() {
  let search = document.getElementById('admin-search').value
  const adminProducts = products.filter(product => {
    return product.name.toLowerCase().includes(search.toLowerCase())
  })
  renderAdminTable(adminProducts)
}

function resetAddData() {
  document.getElementById('addProduct').style.display = 'block'
  document.getElementById('input-file').value = null
  document.getElementById('input-name').value = null
  document.getElementById('input-price').value = null
  document.getElementById('input-category').value = 'smartphone'
}

function addProduct() {
  const fileInput = document.getElementById('input-file')
  const nameInput = document.getElementById('input-name')
  const priceInput = document.getElementById('input-price')
  const categoryInput = document.getElementById('input-category')

  if (fileInput.files.length < 1) {
    return alert('Изображение обязательно!')
  }
  const img = 'images/' + fileInput.files[0].name
  const name = nameInput.value
  const price = +priceInput.value
  if(price === 0) {
    return alert('Вы неправильно указали цену!')
  }
  if(!name || !price) {
    return alert('Все поля обязательные!')
  } 
  const category = categoryInput.value

  products.push({
    id: +new Date(),
    name,
    price,
    img,
    category,
    sale: false,
    rating: 1,
  })
  renderAdminTable()
  document.getElementById('close-add-modal').click()
}

function deleteProduct(id) {
  const agree = confirm("Удалить товар?")
  if(agree) {
    products.splice(id, 1)
  }
  renderAdminTable()
}
