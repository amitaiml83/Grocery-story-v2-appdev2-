export default {
    template: `
    <div class="d-flex justify-content-center align-items-center" style="height: 100vh; background-color: #f8f9fa;">
    <div class="mb-3 p-5 bg-light rounded shadow" style="width: 400px;">
        <div class="text-danger mb-3">{{ error }}</div>
        <h1 class="text-center mb-4" style="color: #007bff;">My Store</h1>
        <form>
            <div class="mb-3">
                <label for="user-email" class="form-label">Email address</label>
                <input type="email" class="form-control" id="user-email" placeholder="name@example.com" v-model="cred.email">
            </div>
            <div class="mb-3">
                <label for="user-password" class="form-label">Password</label>
                <input type="password" class="form-control" id="user-password" v-model="cred.password">
            </div>
            <button class="btn btn-primary btn-block" @click="user_login">Login</button>
            <p class="text-center mt-3">Don't have an account? <button class="btn btn-link btn-sm p-0" @click="signup_user">Sign-up</button></p>
        </form>
    </div>
    </div>`,
    
    data() {
        return {
            cred: {
                email: null,
                password: null,
            },
            error:null
        }
    },
    methods: {
        async user_login() {
            const res = await fetch('/user-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.cred),
            })
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('auth-token',data.token)
                localStorage.setItem('role', data.role)
                this.$router.push('/')
            }
            else{
                this.error=data.message
            }
        },
        async signup_user(){
            this.$router.push('/signup')
        },
    },
}
