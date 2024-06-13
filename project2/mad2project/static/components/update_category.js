export default {
    template: `<div>
      <div class="form-outline mb-3 p-5 bg-light" data-mdb-input-init>
          <label for="category" class="form-label">Choose category</label>
          <select id="category" name="product_category" v-model="category">
              <option v-for="category in allcategory" :key="category.id" :value="category">{{ category.Name }}</option>
          </select>
          <label class="form-label" for="typeText">Update Category</label>
          <input type="text" id="typeText" class="form-control" v-model="up_category.Name"/>
          <button class="btn btn-primary mt-2" @click="update">Update</button>
      </div>
    </div>`,
    data() {
      return {
        up_category: {
          Name: null
        },
        category: null, // Selected category
        token: localStorage.getItem('auth-token'),
        allcategory: null
      };
    },
    methods: {
      async update() {
        if (!this.category || !this.category.id) {
          alert('Please select a valid category.');
          return;
        }
  
        const res = await fetch(`api/update_category/${this.category.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': this.token
          },
          body: JSON.stringify({ Name: this.up_category.Name })
        });
  
        const data = await res.json();
        if (res.ok) {
          alert(data.message);
        }
      },
      async fetchCategories() {
        const res = await fetch('/allcategory', {
          headers: {
            'Authentication-Token': this.token
          }
        });
        const data = await res.json();
        if (res.ok) {
          console.log(data);
          this.allcategory = data;
        } else {
          this.error = res.status;
        }
      }
    },
    async mounted() {
      this.fetchCategories();
    }
  };
  