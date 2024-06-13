export default{
    template:`<div>
    <div class="container text-center mt-4">
      <h2 class="mb-4">Admin Portal</h2>
    </div>
    <div class="container">
      <div class="row">
        <div class="col-md-4" v-for="(category, index) in activeCategories" :key="category.id">
          <div class="card mb-4 shadow-sm">
            <div class="card-body">
              <h5 class="card-title">{{ category.Name }}</h5>
              <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group">
                  <button class="btn btn-sm btn-outline-primary" @click="update_c(category.id)">Update</button>
                  <button class="btn btn-sm btn-outline-secondary" @click="delete_c(category.id)">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`,

    data(){
        return {
            allcategory:null,
            token:localStorage.getItem('auth-token'),
            error:null
        }
    },
    
    computed: {
        activeCategories() {
          // Filter the categories to only show active ones
          return this.allcategory ? this.allcategory.filter(category => category.active) : [];
        },
      },

    methods: {
        async delete_c(categoryId){
            const res =await fetch(`/delete/category/${categoryId}`,{
                method:'DELETE',
               headers:{
                "Authentication-Token":this.token,
               } 
            })
            const data =res.json()
            if (res.ok){
                alert(data.message)
            }
        },
        async update_c(categoryId) {
            this.$router.push(`/update_category/${categoryId}`);
        }
    },

    async mounted(){
        const res = await fetch('/allcategory',{
            headers:{
                "Authentication-Token":this.token
            }
        })
        const data=await res.json()
        if(res.ok){
            // console.log(data)
            this.allcategory=data
        }else{
            this.error=res.status
        }
    }
}