export default{
    template:`
    <div class="d-flex justify-content-center align-items-center" style="height: 100vh; background-color: #f8f9fa;">
    <div class="mb-3 p-5 bg-light rounded shadow" style="width: 400px;">
        <h4 class="text-center mb-4" style="color: #007bff;">New User Registration</h4>
        <form>
            <div class="mb-3">
                <label for="user-email" class="form-label">Enter Your Email</label>
                <input type="email" class="form-control" id="user-email" placeholder="name@example.com" v-model="new_user.email">
            </div>
            <div class="mb-3">
                <label for="user-password" class="form-label">Set a Password</label>
                <input type="password" class="form-control" id="user-password" v-model="new_user.password">
            </div>
            <div class="mb-3">
                <label for="role" class="form-label">Choose your role:</label>
                <select id="user-role" name="user-role" class="form-select" v-model="new_user.role">
                    <option value="manager">Manager</option>
                    <option value="user">User</option>
                </select>
            </div>
            <button class="btn btn-primary btn-block mt-3" @click="sign_in">Sign up</button>
            <p class="text-center mt-3">Already have an account? <button class="btn btn-link btn-sm p-0" @click="show_login_form">Login</button></p>
        </form>
    </div>
    </div>`,

    data(){
        return{
            new_user: {
                email: null ,
                password: null ,
                role: null,
            },
        }
    },
    methods:{
        async sign_in() {
            const res = await fetch('/user_sign_up', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.new_user),
            });

            if (res.ok) {
                const data = await res.json();
                alert(data.message);
            } 
        },
        async show_login_form(){
            this.$router.push('/login')
        }     
    }
}