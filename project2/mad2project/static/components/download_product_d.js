export default{
    template:`<div><button @click="downloadproductlist">DownloadProductlist</button>
    <span v-if='iswaiting'>waiting...</span>
    </div>`,
    data(){
        return {
            iswaiting:false
        }
    },
    methods:{
        async downloadproductlist(){
            this.iswaiting = true
            const res = await fetch('/download-csv')
            const data = await res.json()
            if (res.ok){
                const taskId = data['task_id']
                const intv = setInterval(async() => {
                    const csv_res = await fetch(`/get-csv/${taskId}`)
                    if (csv_res.ok){
                        this.iswaiting =false
                        clearInterval(intv)
                        window.location.href= `/get-csv/${taskId}`
                    }
                } ,1000)
            }
        },
    }

}