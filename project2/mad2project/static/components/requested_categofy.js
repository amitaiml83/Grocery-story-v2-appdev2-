export default {
    template: `
      <div>
        <div>{{error}}</div>
        <ul class="list-group" v-for="(category, index) in allcategory">
          <li class="list-group-item">{{category.Name}} 
            <button class="btn btn-primary" v-if=" !category.active" @click="activate(category.id)">Approve </button>
            <button class="btn btn-secondary" v-if=" !category.active" @click="deactivate(category.id)">Reject</button>
          </li>
        </ul>
      </div>`,
    data() {
      return {
        allcategory: null,
        token: localStorage.getItem('auth-token'),
        // role: localStorage.getItem('role'),
        error: null
      };
    },
    methods: {
      async activate(categoryId){
        const res = await fetch(`/activate/category/${categoryId}`,{
            headers:{
                "Authentication-Token":this.token,
            }
        })
        const data = res.json();
        if(res.ok){
            alert(date.message)
        }
      },
      async deactivate(categoryId){
        const res = await fetch(`/reject/category/${categoryId}`,{
            headers:{
                "Authentication-Token":this.token,
            }
        })
        const data = res.json();
        if(res.ok){
            alert(date.message)
        }
      }
    },
    async mounted() {
      const res = await fetch('/allcategory', {
        headers: {
          "Authentication-Token": this.token,
        },
      });
      const data = await res.json();
      if (res.ok) {
        this.allcategory = data;
      } else {
        this.error = data.message;
      }
    },
};
  