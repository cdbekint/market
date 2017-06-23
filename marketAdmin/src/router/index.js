import Vue from 'vue'
import Router from 'vue-router'
import iView from 'iview'
import 'iview/dist/styles/iview.css'

import Login from '@/Login.vue'
import Header from '@/components/Main/Header'
import Home from '@/components/Main/Home'
import Company from '@/components/Info/Company'

import Employee from '@/components/Employee/Employee'
import EmployeeAdd from '@/components/Employee/EmployeeAdd'

import Goods from '@/components/Goods/Goods'
import GoodsAdd from '@/components/Goods/GoodsAdd'
import GoodsEdit from '@/components/Goods/GoodsEdit'

import Orders from '@/components/Info/Orders'
import Gift from '@/components/Gift/Gift'
import GiftAdd from '@/components/Gift/GiftAdd'
import GiftEdit from '@/components/Gift/GiftEdit'

import Music from '@/components/Music/Music'
import MusicAdd from '@/components/Music/MusicAdd'
import MusicEdit from '@/components/Music/MusicEdit'

import Activity from '@/components/Activity/Activity'
import ActivityAdd from '@/components/Activity/ActivityAdd'
import ActivityEdit from '@/components/Activity/ActivityEdit'
import ActivityTeam from '@/components/Activity/ActivityTeam'
import ActivityTeamUser from '@/components/Activity/ActivityTeamUser'

import Trading from '@/components/Info/Trading'
import Withdraw from '@/components/Info/Withdraw'
import Customer from '@/components/Info/Customer'
import Point from '@/components/Info/Point'

Vue.use(Router)
Vue.use(iView)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/company',
      name: 'Home',
      component: Home,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/company/edit',
      name: 'Company',
      component: Company,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/header',
      name: 'Header',
      component: Header
    },
    {
      path: '/employee',
      name: 'Employee',
      component: Employee,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/employee/add',
      name: 'EmployeeAdd',
      component: EmployeeAdd,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/goods',
      name: 'Goods',
      component: Goods,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/goods/add',
      name: 'GoodsAdd',
      component: GoodsAdd,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/goods/edit',
      name: 'GoodsEdit',
      component: GoodsEdit,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/orders',
      name: 'Orders',
      component: Orders,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/gift',
      name: 'Gift',
      component: Gift,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/gift/edit',
      name: 'GiftEdit',
      component: GiftEdit,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/gift/add',
      name: 'GiftAdd',
      component: GiftAdd,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/music',
      name: 'Music',
      component: Music,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/music/edit',
      name: 'MusicEdit',
      component: MusicEdit,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/music/add',
      name: 'MusicAdd',
      component: MusicAdd,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/activity',
      name: 'Activity',
      component: Activity,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/activity/edit',
      name: 'ActivityEdit',
      component: ActivityEdit,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/activity/add',
      name: 'ActivityAdd',
      component: ActivityAdd,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/activity/team',
      name: 'ActivityTeam',
      component: ActivityTeam,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/activity/teamuser',
      name: 'ActivityTeamUser',
      component: ActivityTeamUser,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/trading',
      name: 'Trading',
      component: Trading,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/withdraw',
      name: 'Withdraw',
      component: Withdraw,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/customer',
      name: 'Customer',
      component: Customer,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/point',
      name: 'Point',
      component: Point,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        requireAuth: true
      }
    }
  ]
})

