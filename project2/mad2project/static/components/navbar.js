export default{
    template:`<div>
    <nav class="navbar navbar-expand-lg bg-primary">
        <div class="container-fluid">
            <a class="navbar-brand text-light" href="#">My Store</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon text-light"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav" style="justify-content: flex-end;">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <router-link class="nav-link active text-light" aria-current="page" to="/">Home</router-link>
                    </li>
                    <li class="nav-item" v-if="role=='admin'">
                        <router-link class="nav-link text-light" to="/create_category">Create Category</router-link>
                    </li>
                    <li class="nav-item" v-if="role=='admin'">
                        <router-link class="nav-link text-light" to="/requested-category">Requested Category</router-link>
                    </li>
                    <li class="nav-item" v-if="role=='manager'">
                        <router-link class="nav-link text-light" to="/request-category">Request category</router-link>
                    </li>
                    <li class="nav-item" v-if="role=='manager'">
                        <router-link class="nav-link text-light" to="/create-product">Create Product</router-link>
                    </li>
                    <li class="nav-item" v-if="role=='manager'">
                        <router-link class="nav-link text-light" to="/download-product-details">Product Detail</router-link>
                    </li>
                    <li class="nav-item" v-if="role=='user'">
                        <router-link class="nav-link text-light" to="/user/update/profile">Update Profile</router-link>
                    </li>
                    <li class="nav-item" v-if="role=='user'">
                        <router-link class="nav-link text-light" to="/cart/product">Cart</router-link>
                    </li>
                    <li class="nav-item" v-if="role=='admin'">
                        <router-link class="nav-link text-light" to="/users">User </router-link>
                    </li>
                    <li class="nav-item text-end" v-if='is_login'>
                        <span class="nav-link text-light" @click='logout'>Logout</span>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</div>
`,

  data(){
    return{
      role:localStorage.getItem('role'),
      is_login:localStorage.getItem('auth-token')
    }
  },
  methods:{
    logout(){
      localStorage.removeItem('auth-token')
      localStorage.removeItem('role')
      this.$router.push({path: '/login'})
    }
  },
  
}