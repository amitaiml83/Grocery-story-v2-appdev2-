import home from "./components/home.js"
import login from "./components/login.js"
import signup from "./components/signup.js"
import users from "./components/users.js"
import category_createform from "./components/category_createform.js"
import update_category from "./components/update_category.js"
import productcreateform from "./components/productcreateform.js"
import update_product from "./components/update_product.js"
import request_formcategory from "./components/request_formcategory.js"
import requested_categofy from "./components/requested_categofy.js"
import cart from "./components/cart.js"
import updateprofile from "./components/updateprofile.js"
import download_product_d from "./components/download_product_d.js"

const routes = [
    {path:'/',component: home,name:'home'},
    {path:'/login',component:login,name:'login'},
    {path:'/signup', component:signup,name:'signup'},
    {path:'/users',component:users},
    {path:'/create_category',component:category_createform},
    {path:'/update_category/:id', component: update_category },
    {path:'/create-product',component:productcreateform},
    {path:'/product-update',component:update_product},
    {path:'/request-category',component:request_formcategory},
    {path:'/requested-category',component:requested_categofy},
    {path:'/cart/product',component:cart},
    {path:'/user/update/profile',component:updateprofile},
    {path:'/download-product-details',component:download_product_d},
]
export default new  VueRouter({
    routes,
})