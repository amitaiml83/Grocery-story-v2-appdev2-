export default {
    template: `<div>
    <div class="form-outline mb-3 p-5 bg-light" data-mdb-input-init>
        <label class="form-label" for="typeText">Enter the Category Name</label>
        <input type="text" id="typeText" class="form-control" v-model="category.Name"/>
        <button class="btn btn-primary mt-2" @click="requestCategory"> Request Category</button>
    </div>
    </div>`,
  
    data() {
      return {
        category: {
            Name:null
        },
        token: localStorage.getItem('auth-token'),
      }
    },
  
    methods: {
      async requestCategory() {
        const res = await fetch('/api/category_create', {
          method: 'POST',
          headers: {
            'Authentication-Token': this.token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.category),
        })
  
        const data = await res.json()
        if (res.ok) {
          alert(data.message)
          this.$router.push(0)
        }
      },
    },
  }