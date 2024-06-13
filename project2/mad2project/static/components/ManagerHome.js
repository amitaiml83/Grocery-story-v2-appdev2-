export default{
    template:`<div>
    <div class="mb-3">Welcome Store Manager</div>
    <div class="text-danger">{{ error }}</div>
    <div class="container">
      <div class="row">
        <div class="col-4" v-for="product in products" :key="product.id">
          <div class="card my-3">
            <div class="card-body">
              <h5 class="card-title">{{ product.name }}</h5>
              <p class="card-text">{{ product.description }}</p>
              <p class="card-text"><strong>Price:</strong> {{ product.rate_per_unit }} {{ product.unit }}</p>
              <p class="card-text"><strong>Remaining Quantity:</strong> {{ product.quantity }}</p>
              <div class="d-flex justify-content-between">
                <button class="btn btn-primary" @click="update_product">Update Product</button>
                <button class="btn btn-secondary" @click="delete_product(product.id)">Delete Product</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`,
    data(){
        return {
            products:null,
            token:localStorage.getItem('auth-token'),
            error:null,
        }
    },
    methods:{
        async update_product(){
            this.$router.push('/product-update')
        },
        async delete_product(p_id){
            const res = await fetch(`/delete/product/${p_id}`,{
                method: 'DELETE',
                headers:{
                    "Authentication-Token":this.token
                }
            })
            const data = res.json()
            if (res.ok){
                alert(data.message)
            }else{
                this.error=res.status
            }
        },
    },
    async mounted(){
        const res = await fetch('/allproducts',{
            headers:{
                "Authentication-Token":this.token
            }
        })
        const data= await res.json()
        if (res.ok){
            this.products=data
        }else{
            this.error=res.status
        }
    }
}