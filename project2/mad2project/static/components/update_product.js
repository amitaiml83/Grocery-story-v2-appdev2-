export default{
    template:`
    <div class='d-flex justify-content-center' style="margin-top:25vh">
            <div class="mb-3 p-5 bg-light">
            <div class='text-danger'> {{error}}</div>
            <label for="product" class="form-label">Choose Product</label>
            <select id="category" name="product" v-model="product">
              <option v-for="product in allproducts" :key="product.id" :value="product">{{ product.name }}</option>
            </select><br>
            <label for="category" class="form-label">Choose category</label>
            <select id="category" name="product_category" v-model="products.product_category">
                <option v-for="category in allcategory" :key="category.id" :value="category.id">{{ category.Name }}</option>
            </select><br>
            <label for="product-name" class="form-label">Enter Product Name</label>
            <input type="text" class="form-control" id="product-name" v-model="products.name">
            <label for="product-description" class="form-label">Enter Product description</label>
            <input type="text" class="form-control" id="product-description" v-model="products.description">
            <label for="product-manufecturing-date" class="form-label">Enter Product manufecturing Date</label>
            <input type="date" class="form-control" id="product-manufecturing-date" v-model="products.manufacturing_date">
            <label for="product-rate_per_unit" class="form-label">Enter Product Rate Per unit</label>
            <input type="number" class="form-control" id="product-rate_per_unit" v-model="products.rate_per_unit">
            <label for="product-quantity" class="form-label">Enter Product Quantity</label>
            <input type="number" class="form-control" id="product-quantity" v-model="products.quantity">
            <label for="product-unit" class="form-label">Enter Product unit</label>
            <input type="Text" class="form-control" id="product-unit" v-model="products.unit">
            <button class="btn btn-primary mt-2"  @click="update_product">Update product </button>
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
            error:null,
            product:null,
            allproducts:null
        }
    },
    methods:{
        async update_product() {
            const res = await fetch(`api/update-prodcut/${this.product.id}`,{
              method: 'PUT',
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

        const k = await fetch('/allproducts',{
            headers:{
                "Authentication-Token":this.token
            }
        })
        const p= await k.json()
        if (res.ok){
            this.allproducts=p
        }else{
            this.error=k.status
        }
    } 
}

