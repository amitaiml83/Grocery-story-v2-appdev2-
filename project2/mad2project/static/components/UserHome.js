export default{
    template:`<div>
    <div class="test-right">
        <div style="align-items: center; display: flex; flex-direction: row;justify-content: end;align-items: center;">
            <div>
                <label class="form-label">Search Type:</label>
                <select v-model="searchfor.type">
                    <option value="minPrice">Minimum Price</option>
                    <option value="maxPrice">Maximum Price</option>
                    <option value="productName">Product Name</option>
                    <option value="categoryName">Category Name</option>
                </select>
            </div>
            <div style="display:flex;justify-content: end;">
                <input style="margin-right:20px" v-model="searchfor.value" placeholder="Enter search value" />
                <button class="btn btn-success" @click="submitSearch" data-mdb-ripple-init>Search</button>
            </div>
        </div>
    </div>
    <div>
    <div class="text-center mt-4">
        <h3>Welcome user</h3>
    </div>
    <div class="text-danger">{{ error }}</div>
    <div class="container-fluid">
        <div v-if="products && products.length > 0" class="container">
            <div class="row">
                <div class="col-lg-4 col-md-6 col-sm-12" v-for="product in products" :key="product.id">
                    <div class="card my-3 mx-2">
                        <div class="card-body">
                            <h5 class="card-title">{{ product.name }}</h5>
                            <p class="card-text">{{ product.description }}</p>
                            <p class="card-text"><strong>Price:</strong> {{ product.rate_per_unit }}₹ {{ product.unit }}</p>
                            <div v-if="product.quantity > 0">
                                <div class="input-group mb-3">
                                    <input type="number" v-model="selectedQuantity[product.id]" min="1" class="form-control">
                                    <button class="btn btn-primary" @click="AddToCart(product)">Add to cart</button>
                                </div>
                            </div>
                            <div v-else>
                                <h4 class="text-danger">Out of Stock</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else-if="products !== null && products !== undefined" class="container-fluid">
            <div class="alert alert-info my-3">No matching products found.</div>
        </div>
    </div>
</div>
</div>`,
  data() {
    return {
      cart_p: {
        product_id: 0,
        product_name: null,
        price_per_item: 0,
        quantity: 0,
      },
      searchfor: {
        type: '', 
        value: '',
      },
      selectedQuantity:{}, 
      products: null,
      token: localStorage.getItem('auth-token'),
      error: null,
      initialProductsLoaded: false,
    };
  },
  methods: {
    async AddToCart(product) {
      this.cart_p.product_id =product.id
      this.cart_p.product_name = product.name
      this.cart_p.price_per_item = product.rate_per_unit
      this.cart_p.quantity = this.selectedQuantity[product.id]
      
      const res = await fetch('/api/cart', {
        method: "POST",
        headers: {
          'Authentication-Token': this.token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.cart_p),
      });

      const data = await res.json();

      if (res.ok) {
        // alert(data.message);
        this.$router.push('/cart/product')
      }
    },
    async submitSearch() {
      const res = await fetch('/api/search-product', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          'Authentication-Token': this.token,
        },
        body: JSON.stringify(this.searchfor),
      });

      if (res.ok) {
        const data = await res.json();
        this.products = data;
      }
    },
  },
  async mounted() {
    const res = await fetch('/allproducts', {
      headers: {
        'Authentication-Token': this.token,
      },
    });

    const data = await res.json();

    if (res.ok) {
      this.products = data
      this.initialProductsLoaded = true
      await this.submitSearch();
    } else {
      this.error = data.message;
    }
  },
};