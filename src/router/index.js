import Vue from 'vue'
import Router from 'vue-router'
import landing from '@/components/pages/landing'
import wallet from '@/components/pages/wallet'
import asset from '@/components/pages/wallet/asset'
import transaction from '@/components/pages/wallet/transaction'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: landing
    },
    {
      path: '/account/:page',
      component: wallet,
      children: [
        { path: ':id', component: asset }
      ]
    },
    {
      path: '/account/wallet/transaction/:currency/:id',
      component: transaction
    }
  ]
})
