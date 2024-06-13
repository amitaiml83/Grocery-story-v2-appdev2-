export default {
    template: `<div>
    <div class="form-outline mb-3 p-5 bg-light" data-mdb-input-init>
        <label class="form-label" for="typeText">Create Category</label>
        <input type="text" id="typeText" class="form-control" v-model="category.Name"/>
        <button class="btn btn-primary mt-2" @click="createCategory"> Create Category</button>
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
      async createCategory() {
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
          this.category.Name = null;
          this.$router.push(0)
        }
      },
    },
  }