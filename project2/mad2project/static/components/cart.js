export default {
  template: `<div>
  <div class="text-center mt-4">
    <h3>Welcome user</h3>
  </div>
  <div class="container">
    <div>{{error}}</div>
    <div class="row">
      <div v-if="allcart && allcart.length === 0">
        No products in the cart.
      </div>
      <div class="card my-3 mx-3 col-4" v-for="product in allcart" :key="product.id">
        <div class="card-body">
          <h5 class="card-title">{{ product.product_name }}</h5>
          <h6 class="card-subtitle mb-2 text-body-secondary">Price per item: {{ product.price_per_item }}</h6>
          <h6 class="card-subtitle mb-2 text-body-secondary">Quantity: {{ product.quantity }}</h6>
          <button class="btn btn-primary" @click="remove(product.id)">Remove</button>
        </div>
      </div>
    </div>
    <button type="button" class="btn btn-warning" v-if="allcart && allcart.length > 0">
      TOTAL Amount: {{ totalAmount }} ₹
    </button>
    <button class="btn btn-primary" @click="buyalll">Buy all</button>
  </div>
</div>`,
  data() {
    return {
      allcart: null,
      token: localStorage.getItem('auth-token'),
      error:null
    }
  },
  computed: {
    totalAmount() {
      if (!this.allcart) return 0

      return this.allcart.reduce((total, product) => {
        return total + product.price_per_item * product.quantity;
      }, 0);
    },
  },
  methods: {
    async remove(id) {
      const res = await fetch(`api/cart/${id}`, {
        method: 'DELETE',
        headers: {
          "Authentication-Token":this.token
        },
      })
      const data = await res.json();
      if (res.ok) {
        alert(data.message)
      }else{
        this.error=data.message
      }
    },
    async buyalll(){
      const res =await fetch('/buy-all',{
        method:'POST',
        headers:{
          "Authentication-Token":this.token
        }
      })
      const data = await res.json();
      if (res.ok){
        alert(data.message)
      }else{
        this.error=data.message
      }
    }
  },
  async mounted() {
    const res = await fetch('/allcarts', {
      headers: {
        "Authentication-Token":this.token
      },
    })
    const data = await res.json();
    if (res.ok) {
      this.allcart = data;
    }else{
      this.error=data.message
    }
  },
};
