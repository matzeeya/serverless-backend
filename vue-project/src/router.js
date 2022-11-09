import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './views/Home.vue'
import ViewData from './views/ViewData.vue'
import AddBorrowList from './views/AddBorrowList.vue'
import AddReturnList from './views/AddReturnList.vue'
import AddRepairList from './views/AddRepairList.vue'
import AddAdmitList from './views/AddAdmitList.vue'
import AddSellList from './views/AddSellList.vue'

import Regiter from './views/Default/UserRegister.vue'
import Login from './views/Default/UserLogin.vue'
import SearchItem from './views/Default/SearchItem.vue'

import Profile from './views/User/UserProfile.vue'
import BorrowItem from './views/User/BorrowItem.vue'
import ReturnItem from './views/User/ReturnItem.vue'

import CheckItem from './views/Staff/CheckItem.vue'
import Movement from './views/Staff/Movement.vue'
import RepairItem from './views/Staff/RepairItem.vue'
import AdmitItem from './views/Staff/AdmitItem.vue'
import SellItem from './views/Staff/SellItem.vue'
import RequestBorrow from './views/Staff/RequestBorrow.vue'
import RequestReturn from './views/Staff/RequestReturn.vue'
import BorrowList from './views/Staff/BorrowList.vue'
import ReturnList from './views/Staff/ReturnList.vue'
import RepairList from './views/Staff/RepairList.vue'
import AdmitList from './views/Staff/AdmitList.vue'
import SellList from './views/Staff/SellList.vue'

import Verify from './views/Admin/UserVerify.vue'
import AddItem from './views/Admin/AddItem.vue'
import AddItemCode from './views/Admin/AddItemCode.vue'

import ViewBorrowList from './views/Report/ViewBorrowList.vue'

import ExportBorrow from './views/Export/ExportBorrow.vue'
import ExportReturn from './views/Export/ExportReturn.vue'
import ExportRepair from './views/Export/ExportRepair.vue'
import ExportAdmit from './views/Export/ExportAdmit.vue'
import ExportSell from './views/Export/ExportSell.vue'

Vue.use(VueRouter)

const routes = [
  {
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
    path: '/addBorrowList/:code',
    name: 'AddBorrowList',
    component: AddBorrowList
  },
  {
    path: '/requestBorrow/:ureq',
    name: 'RequestBorrow',
    component: RequestBorrow
  },
  {
    path: '/borrowList',
    name: 'BorrowList',
    component: BorrowList
  },
  {
    path: '/addReturnList/:code',
    name: 'AddReturnList',
    component: AddReturnList
  },
  {
    path: '/requestReturn/:ureq',
    name: 'RequestReturn',
    component: RequestReturn
  },
  {
    path: '/returnList',
    name: 'ReturnList',
    component: ReturnList
  },
  {
    path: '/addRepairList/:code',
    name: 'AddRepairList',
    component: AddRepairList
  },
  {
    path: '/repairList',
    name: 'RepairList',
    component: RepairList
  },
  {
    path: '/addAdmitList/:code',
    name: 'AddAdmitList',
    component: AddAdmitList
  },
  {
    path: '/admitList',
    name: 'AdmitList',
    component: AdmitList
  },
  {
    path: '/addSellList/:code',
    name: 'AddSellList',
    component: AddSellList
  },
  {
    path: '/sellList',
    name: 'SellList',
    component: SellList
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
    path: '/admitItem',
    name: 'AdmitItem',
    component: AdmitItem
  },
  {
    path: '/sellItem',
    name: 'SellItem',
    component: SellItem
  },
  {
    path: '/addItem',
    name: 'AddItem',
    component: AddItem
  },
  {
    path: '/addItem/:code',
    name: 'AddItemCode',
    component: AddItemCode
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
  },
  {
    path: '/viewBorrowList',
    name: 'ViewBorrowList',
    component: ViewBorrowList
  },
  {
    path: '/exportBorrow',
    name: 'ExportBorrow',
    component: ExportBorrow
  },
  {
    path: '/exportReturn',
    name: 'ExportReturn',
    component: ExportReturn
  },
  {
    path: '/exportRepair',
    name: 'ExportRepair',
    component: ExportRepair
  },
  {
    path: '/exportAdmit',
    name: 'ExportAdmit',
    component: ExportAdmit
  },
  {
    path: '/exportSell',
    name: 'ExportSell',
    component: ExportSell
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router