export default{
    template:`
    <div class="d-flex justify-content-center align-items-center" style="height: 100vh; background-color: #f8f9fa;">
    <div class="mb-3 p-5 bg-light rounded shadow" style="width: 400px;">
        <div class="text-danger mb-3">{{ error }}</div>
        <h4 class="text-center mb-4" style="color: #28a745;">Update Profile</h4>
        <form>
            <div class="mb-3">
                <label for="user-email" class="form-label">Email address</label>
                <input type="email" class="form-control" id="user-email" placeholder="name@example.com" v-model="userupdate.email">
            </div>
            <div class="mb-3">
                <label for="user-password" class="form-label">Password</label>
                <input type="password" class="form-control" id="user-password" v-model="userupdate.password">
            </div>
            <button class="btn btn-success btn-block mt-3" @click="update">Update</button>
        </form>
    </div>
    </div>`,
    data(){
        return {
            userupdate:{
                email:null,
                password:null
            },
            token:localStorage.getItem('auth-token'),
            error:null
        }
    },
    methods:{
        async update(){
            const res =await fetch('/profile-update',{
                method:'PUT',
                headers:{
                    "authentication-Token":this.token,
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify(this.userupdate)
            })
            const data = res.json();
            if (res.ok){
                alert(data.messsage)
            }else{
                this.error=data.messsage
            }
        }
    }
}