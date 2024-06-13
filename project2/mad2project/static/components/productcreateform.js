export default{
    template:`
    <div class="d-flex justify-content-center mt-5">
    <div class="mb-3 p-5 bg-light" style="width: 400px;">
      <div class="text-danger">{{ error }}</div>

      <label for="category" class="form-label">Choose Category</label>
      <select id="category" class="form-select" v-model="products.product_category">
        <option v-for="category in activeCategories" :key="category.id" :value="category.id">{{ category.Name }}</option>
      </select>

      <div class="mt-3">
        <label for="product-name" class="form-label">Enter Product Name</label>
        <input type="text" class="form-control" id="product-name" v-model="products.name">
      </div>

      <div class="mt-3">
        <label for="product-description" class="form-label">Enter Product Description</label>
        <textarea class="form-control" id="product-description" rows="3" v-model="products.description"></textarea>
      </div>

      <div class="mt-3">
        <label for="product-manufacturing-date" class="form-label">Enter Product Manufacturing Date</label>
        <input type="datetime-local" class="form-control" id="product-manufacturing-date" v-model="products.manufacturing_date">
      </div>

      <div class="row mt-3">
        <div class="col">
          <label for="product-rate_per_unit" class="form-label">Enter Product Rate Per Unit</label>
          <input type="number" class="form-control" id="product-rate_per_unit" v-model="products.rate_per_unit">
        </div>

        <div class="col">
          <label for="product-quantity" class="form-label">Enter Product Quantity</label>
          <input type="number" class="form-control" id="product-quantity" v-model="products.quantity">
        </div>
      </div>

      <div class="mt-3">
        <label for="product-unit" class="form-label">Enter Product Unit</label>
        <input type="text" class="form-control" id="product-unit" v-model="products.unit">
      </div>

      <button class="btn btn-primary mt-3" @click="create_product">Create Product</button>
    </div>
  </div>`,
    data(){
        return{
            products:{
                name:null,
                description:null,
                manufacturing_date:null,
                rate_per_unit:null,
                quantity:null,
                unit:null,
                product_category:null

            },
            token: localStorage.getItem('auth-token'),
            allcategory:null,
            error:null
        }
    },
    computed: {
        activeCategories() {
          // Filter the categories to only show active ones
          return this.allcategory ? this.allcategory.filter(category => category.active) : [];
        },
    },

    methods:{
        async create_product() {
            const res = await fetch('/api/create-product', {
              method: 'POST',
              headers: {
                'Authentication-Token': this.token,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(this.products),
            })
      
            const data = await res.json()
            if (res.ok) {
              alert(data.message)
            //   this.$route.push(0)
            }
          },
    },
    async mounted(){
        const res = await fetch('/allcategory',{
            headers:{
                "Authentication-Token":this.token
            }
        })
        const data=await res.json()
        if(res.ok){
            this.allcategory=data
        }else{
            this.error=res.status
        }
    }

}