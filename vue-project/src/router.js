import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './views/Home.vue'
import ViewData from './views/ViewData.vue'
import Regiter from './views/Default/UserRegister.vue'
import Login from './views/Default/UserLogin.vue'
import SearchItem from './views/Default/SearchItem.vue'
import Profile from './views/User/UserProfile.vue'
import BorrowItem from './views/User/BorrowItem.vue'
import ReturnItem from './views/User/ReturnItem.vue'
import CheckItem from './views/Staff/CheckItem.vue'
import RepairItem from './views/Staff/RepairItem.vue'
import SellItem from './views/Staff/SellItem.vue'
import AddItem from './views/Staff/AddItem.vue'
import Movement from './views/Staff/Movement.vue'
import Verify from './views/Admin/UserVerify.vue'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  name: 'Home',
  component: Home
},
{
  path: '/viewdata/:code',
  name: 'ViewData',
  component: ViewData
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
  path: '/borrowItem',
  name: 'BorrowItem',
  component: BorrowItem
},
{
  path: '/returnItem',
  name: 'ReturnItem',
  component: ReturnItem
},
{
  path: '/checkItem',
  name: 'CheckItem',
  component: CheckItem
},
{
  path: '/repairItem',
  name: 'RepairItem',
  component: RepairItem
},
{
  path: '/sellItem',
  name: 'SellItem',
  component: SellItem
},
{
  path: '/addItem/:code',
  name: 'AddItem',
  component: AddItem
},
{
  path: '/movement/:code',
  name: 'Movement',
  component: Movement
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