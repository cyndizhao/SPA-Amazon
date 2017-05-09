const DOMAIN = 'http://localhost:3000';
const API_TOKEN = 'LiOPguirJNHU7a92p10nVxQnjwhflAA85FjG8zQwzkI';

function getProducts (){
  return fetch(`${DOMAIN}/api/v1/products?api_token=${API_TOKEN}`)
  .then(function(result){return result.json()});
}

function renderProducts (products) {
  return products.map(function (product) {
    return `
      <div class="product-summary">
        <a
          data-id=${product.id}
          href
          class="product-link">
            ${product.title}
        </a>
      </div>
    `
  }).join('');
}

function getProduct (id){
  return fetch(`${DOMAIN}/api/v1/products/${id}?api_token=${API_TOKEN}`)
  .then(function(result){return result.json()})
}

function renderProduct (product){
  return `<div id='single-product' data-id=${product.id}>
      <button class="back">Back</button>
    <h1>${product.title}</h1>
    <p>${product.description}</p>
    <p>Price: ${product.price}</p>
    <p>Sale Price: ${product.sale_price}</p>
    <h3>Create Review</h3>

    <form id="review-form">
      <div>
        <label for="body">Body</label>
        <br>
        <textarea style="border:thin solid grey;" id="body" name="body"></textarea>
      </div>
      <div>
        <label for="rating">Rating</label>
        <br>
        <textarea style="border:thin solid grey;" id="rating" name="rating"></textarea>
      </div>

      <input type="submit" value="Submit" />
    </form>
    <h3>Reviews</h3>
    <ul class="reviews-list">
      ${renderReviews(product.reviews)}
    </ul>
    </div>`
}

function renderReviews (reviews) {
  return reviews.map(function (review) {
    return `<li class="review">${review.review_body} ${review.review_rating}</li>`;
  }).join('');
}

function postReview (productId, reviewParams) {
  fetch(
    `${DOMAIN}/api/v1/products/${productId}/reviews?api_token=${API_TOKEN}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({review: reviewParams})
    }
  )
  .then(response => response.json())
  .then(response => {
    renderNewReview(response)
    document.getElementById('review-form').reset()
  })
}
function renderNewReview(response){
  const review = response.review
  const reviewsList = document.querySelector(".reviews-list")
  let newReview = document.createElement('li')
  newReview.innerHTML = `<li class="review">${review.body} ${review.rating}</li>`;
  reviewsList.prepend(newReview);
}
document.addEventListener('DOMContentLoaded', function () {
  const productList = document.querySelector('#products-list');
  const productDetails = document.querySelector('#product');
  getProducts().then(renderProducts).then(function(html){productList.innerHTML = html});
  productList.addEventListener('click', function (event) {
    if (event.target.matches('.product-link')) {
      event.preventDefault();
      const productId = event.target.getAttribute('data-id');

      getProduct(productId).then(function(product){
        productDetails.innerHTML = renderProduct(product)
        productDetails.classList.remove('hidden');
        productList.classList.add('hidden');
        handleReviewForm();
      })
    }
  })

  function handleReviewForm(event) {
    const reviewForm = document.getElementById('review-form');

    reviewForm.addEventListener('submit', function(event){
      event.preventDefault();
      const productId = document.getElementById('single-product').dataset.id;
      const reviewBody = document.querySelector('textarea#body').value;
      const reviewRating = document.querySelector('textarea#rating').value;
      postReview(productId, {body: reviewBody, rating: reviewRating});
    })
  }

  productDetails.addEventListener('click', function(event){
    if (event.target.matches('.back')){
      productList.classList.remove('hidden');
      productDetails.classList.add('hidden');

    }
  })

// >>>>>>>>>>>>>>>>>>>>>>create new review
  // const reviewForm = document.querySelector('#review-form');
  // reviewForm.addEventListener('submit', function(event){
  //   event.preventDefault();
  //   const rating = event.currentTarget.querySelector('#rating');
  //   const body = event.currentTarget.querySelector('#body');
  //
  //   const fData = new FormData(event.currentTarget);
  //   const productID = document.querySelector('#single-product').getAttribute('data-id');
  //   postQuestion(productID, {body: fData.get('body'), rating: fData.get('rating')})
  //   .then(function () {
  //     // loadQuestions();
  //     rating.value = '';
  //     body.value = '';
  //   })
  // })

})
