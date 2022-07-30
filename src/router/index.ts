import { createRouter, createWebHashHistory } from 'vue-router'
import IndexView from '@/views/IndexView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: IndexView
    },
    {
      path: '/difficulty',
      name: 'difficulty',
      component: () => import('@/views/DifficultyView.vue')
    },
    {
      path: '/introduce',
      name: 'introduce',
      component: () => import('@/views/IntroduceView.vue')
    },
    {
      path: '/map',
      name: 'map',
      component: () => import('@/views/MapView.vue')
    },
    {
      path: '/game',
      name: 'game',
      component: () => import('@/views/GameView.vue')
    },
    {
      path: '/ranking',
      name: 'ranking',
      component: () => import('@/views/RankingView.vue')
    },
    {
      path: '/win',
      name: 'win',
      component: () => import('@/views/WinView.vue')
    },
    {
      path: '/lose',
      name: 'lose',
      component: () => import('@/views/LoseView.vue')
    }
  ]
})

export default router
