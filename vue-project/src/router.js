import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './views/Home.vue'
import Regiter from './views/Default/UserRegister.vue'
import Login from './views/Default/UserLogin.vue'
import SearchItem from './views/Default/SearchItem.vue'
import Profile from './views/User/UserProfile.vue'
import Verify from './views/Admin/UserVerify.vue'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  name: 'Home',
  component: Home
},
{
  path: '/register',
  name: 'Regiter',
  component: Regiter
},
{
  path: '/login',
  name: 'Login',
  component: Login
},
{
  path: '/profile',
  name: 'Profile',
  component: Profile
},
{
  path: '/verify',
  name: 'Verify',
  component: Verify
},
{
  path: '/searchItem',
  name: 'SearchItem',
  component: SearchItem
}
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router