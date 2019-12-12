import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/HomePage'
import Login from '@/components/Login'
import Register from '@/components/Register'
import NotFound from '@/components/NotFound'
import ProfileBuilder from '@/components/ProfileBuilder'
import Profile from '@/components/Profile'
import ProfileSettings from '@/components/ProfileSettings'
import Chat from '@/components/Chat'
import Policy from '@/components/Policy'
import TermsAndConditions from '@/components/TermsAndConditions'

import axios from 'axios'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/oauth/:id/:token',
      name: 'OAuth',
      beforeEnter (to, from, next) {
        console.log('heree')
        axios.post(`https://noq-server1.herokuapp.com/api/auth/login/`, {username: to.params.id, token: to.params.token})
          .then(response => {
            localStorage.setItem('jwtToken', response.data.token)
            localStorage.setItem('user_first_time', response.data.user.first_time)
            localStorage.setItem('user_id', response.data.user._id)
            localStorage.setItem('role', response.data.user.role)
            localStorage.setItem('email', response.data.user.email)
            localStorage.setItem('profilepicture', response.data.user.profilepicture)

            if (response.data.user.first_time) {
              next({
                name: 'ProfileBuilder'
              })
            } else {
              next({
                name: 'HomePage'
              })
            }
          })
      }

    },
    {
      path: '/',
      name: 'HomePage',
      component: Home,
      beforeEnter (to, from, next) {
        if (localStorage.getItem('jwtToken')) {
          if (localStorage.getItem('user_first_time') === 'true') {
            next({name: 'ProfileBuilder'})
          } else {
            next()
          }
        } else {
          next({
            name: 'Login'
          })
        }
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      beforeEnter (to, from, next) {
        if (localStorage.getItem('jwtToken')) {
          next({path: from.path})
        } else {
          next()
        }
      }
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '*',
      name: '404',
      component: NotFound
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      beforeEnter (to, from, next) {
        if (localStorage.getItem('jwtToken')) {
          if (localStorage.getItem('user_first_time') === 'true') {
            next({name: 'ProfileBuilder'})
          } else {
            next()
          }
        } else {
          next({
            name: 'Login'
          })
        }
      }
    },
    {
      path: '/settings',
      name: 'ProfileSettings',
      component: ProfileSettings,
      beforeEnter (to, from, next) {
        if (localStorage.getItem('jwtToken')) {
          if (localStorage.getItem('user_first_time') === 'true') {
            next({name: 'ProfileBuilder'})
          } else {
            next()
          }
        } else {
          next({
            name: 'Login'
          })
        }
      }
    },
    {
      path: '/chat',
      name: 'Chat',
      component: Chat
    },
    {
      path: '/policy',
      name: 'Policy',
      component: Policy
    },
    {
      path: '/termsandconditions',
      name: 'TermsAndConditions',
      component: TermsAndConditions
    },
    {
      path: '/build_profile',
      name: 'ProfileBuilder',
      component: ProfileBuilder,
      beforeEnter (to, from, next) {
        if (localStorage.getItem('user_first_time') === 'true') {
          if (localStorage.getItem('jwtToken')) {
            next()
          }
        } else {
          if (localStorage.getItem('jwtToken')) {
            next({name: 'HomePage'})
          } else {
            next({name: 'Login'})
          }
        }
      }

    }
  ]
})
