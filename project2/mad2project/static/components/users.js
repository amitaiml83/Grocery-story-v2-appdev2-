export default {
    template: `
      <div>
        <div>{{error}}</div>
        <ul class="list-group" v-for="(user, index) in allusers">
          <li class="list-group-item">{{ user.email }} 
            <button class="btn btn-primary" v-if="!user.active" @click="approve(user.id)">Approve </button>
            <button class="btn btn-secondary" v-if="user.active" @click="Deactivate(user.id)">Deactivate </button>
          </li>
        </ul>
      </div>`,
    data() {
      return {
        allusers: null,
        token: localStorage.getItem('auth-token'),
        // role: localStorage.getItem('role'),
        error: null
      };
    },
    methods: {
      async approve(managerId) {
        const res = await fetch(`/activate/manager/${managerId}`, {
          headers: {
            "Authentication-Token": this.token,
          }
        });
        const data = await res.json();
        if (res.ok) {
          alert(data.message);
        }
      },
      async Deactivate(userId) {
        const res = await fetch(`/deactivate/user/${userId}`, {
          headers: {
            "Authentication-Token": this.token,
          }
        });
        const data = await res.json();
        if (res.ok) {
          alert(data.message);
        }
      }
    },
    async mounted() {
      const res = await fetch('/users', {
        headers: {
          "Authentication-Token": this.token,
        },
      });
      const data = await res.json();
      if (res.ok) {
        this.allusers = data;
      } else {
        this.error = res.status;
      }
    },
};
  