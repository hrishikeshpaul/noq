<template>
  <div id="app">
    <div id="mySidenav" class="sidenav p-0" v-if="$route.path !== '/login' && $route.path !== '/build_profile' ">
      <div style="display: flex; justify-content: space-between" class="px-4 text-center">
<!--          <div class="big-title text-center" style="display: inline; margin-left: -13px;" v-if="!navBarCollapsed">-->
<!--            <span class="px-2 logo-noq">noQ</span>-->
<!--            <p class="mt-1" style="font-size: 10px; color: white">Making Career Fairs Easier</p>-->
<!--          </div>-->

        <div v-if="!navBarCollapsed" class="mt-3">
          <router-link to="/"><img src="./assets/noQ_0275d8.svg" width="100"></router-link>
          <p class="mt-1" style="font-size: 10px; color: white">Making Career Fairs Easier</p>
        </div>

        <div style="display: inline;" >
<!--          <a href="javascript:void(0)" class="closebtn" @click="openNav" v-if="navBarCollapsed">&rang;</a>-->
          <a href="javascript:void(0)" class="closebtn" @click="openNav" v-if="navBarCollapsed"><img src="./assets/onlyQ.svg" width="35" style="margin-left: -2px;"></img></a>
          <a href="javascript:void(0)" class="closebtn" @click="closeNav" v-else style="margin-top: 10px; margin-left: 12px;">&lang;</a>
        </div>
      </div>

      <hr style="background-color: #7e868a; margin-bottom: 0px; padding-bottom: 0px;"/>
      <div>
        <a href="#">
            <router-link to="/profile" :class="{'sidenav-item-active': $route.name === 'Profile'}">
              <div :class="{'text-center': navBarCollapsed, 'text-left': !navBarCollapsed, 'py-2': true, 'ml-2': !navBarCollapsed ? true : false, 'pb-0':  !navBarCollapsed ? false : true}">
                <div v-if="!navBarCollapsed" class="px-4">
                  <div class="row pt-2">
                    <div class="col-3 pl-1 pr-0">
                      <img :src="profilepciture ? profilepciture : require('./assets/blank_profile.png')" style="height: 50px; width: 50px; border-radius: 10%;"/>

                    </div>
                    <div class="col-9 pl-0">
                      <span style="font-size: 16px; font-weight: 400; margin-top: 20px;">{{email}}</span>
                      <p style="font-size: 15px; margin-top: -3px;">{{role.charAt(0).toUpperCase() + role.substring(1)}}</p>
                    </div>
                  </div>
                </div>
                <span v-else><i class="ti-user"></i></span>
              </div>
            </router-link>
          </a>
<!--        <hr style="background-color: #757d80;" class="py-0 my-0"/>-->
          <a href="#" style="text-decoration: none;">
            <router-link to="/" :class="{'sidenav-item-active': $route.name === 'HomePage'}">
              <div :class="{'text-center': navBarCollapsed, 'text-left': !navBarCollapsed, 'py-2': true}">
                <span v-if="!navBarCollapsed" class="px-4">Home</span>
                <span v-else><i class="ti-home"></i></span>
              </div>
            </router-link>
          </a>
        <a href="#">
          <router-link to="/chat" :class="{'sidenav-item-active': $route.name === 'Chat'}">
            <div :class="{'text-center': navBarCollapsed, 'text-left': !navBarCollapsed, 'py-2': true}">
              <span v-if="!navBarCollapsed" class="px-4">Messages</span>
              <span v-else><i class="ti-comment-alt"></i></span>
            </div>
          </router-link>
        </a>
        <a href="#" style="text-decoration: none;">
          <router-link to="/settings" :class="{'sidenav-item-active': $route.name === 'ProfileSettings'}">
            <div :class="{'text-center': navBarCollapsed, 'text-left': !navBarCollapsed, 'py-2': true}">
              <span v-if="!navBarCollapsed" class="px-4">Settings</span>
              <span v-else><i class="ti-settings"></i></span>
            </div>
          </router-link>
        </a>

        <hr style="background-color: #7e868a; margin-bottom: 0px; padding-bottom: 0px;"/>
        <a href="#" style="text-decoration: none;">
          <router-link to="/termsandconditions" :class="{'sidenav-item-active': $route.name === 'TermsAndConditions'}">
            <div :class="{'text-center': navBarCollapsed, 'text-left': !navBarCollapsed, 'py-2': true}">
              <span v-if="!navBarCollapsed" class="px-4">Terms and Conditions</span>
              <span v-else><i class="ti-file"></i></span>
            </div>
          </router-link>
        </a>
        <a href="#" style="text-decoration: none;">
          <router-link to="/policy" :class="{'sidenav-item-active': $route.name === 'Policy'}">
            <div :class="{'text-center': navBarCollapsed, 'text-left': !navBarCollapsed, 'py-2': true}">
              <span v-if="!navBarCollapsed" class="px-4">Policy</span>
              <span v-else><i class="ti-shield"></i></span>
            </div>
          </router-link>
        </a>

        <hr style="background-color: #7e868a; margin-bottom: 0px; padding-bottom: 0px;"/>
        <a href="#" style="text-decoration: none;">
          <router-link to="/">
            <div :class="{'text-center': navBarCollapsed, 'text-left': !navBarCollapsed, 'py-2': true}" @click="logout">
              <span v-if="!navBarCollapsed" class="px-4">Logout</span>
              <span v-else><i class="ti-back-left"></i></span>
            </div>
          </router-link>
        </a>
      </div>
    </div>

    <div id="main" :class="{'marginLeft': $route.path !== '/login', 'noMargin': $route.path === '/login' || $route.path === 'build_profile'}">
      <vue-page-transition name="fade">
        <router-view></router-view>
      </vue-page-transition>
    </div>
  </div>
</template>

<script>
import Gravatar from 'vue-gravatar'
import gravatar from 'gravatar'
import io from 'socket.io-client'
export default {
  name: 'App',
  components: {
    Gravatar
  },
  data () {
    return {
      navBarCollapsed: false,
      email: '',
      role: '',
      socket: io('https://noq-server1.herokuapp.com'),
      prevRouteName: this.$route.name,
      user_id: localStorage.user_id,
      profilepciture: localStorage.profilepicture
    }
  },
  updated () {
    this.email = localStorage.getItem('email')
    this.role = localStorage.getItem('role')
    if (this.$route.name === 'Chat') {
      this.prevRouteName = 'Chat'
    }
    if (this.prevRouteName === 'Chat' && this.$route.name !== 'Chat') {
      console.log('here')
      this.socket.emit('USER_OUT', this.user_id)
    }

  },
  mounted () {
    this.email = localStorage.getItem('email')
    this.role = localStorage.getItem('role')
    localStorage.setItem('navBarCollapsed', false)
    if (this.$route.path === '/build_profile') {
      document.getElementById("main").style.marginLeft = "0";
      var element = document.getElementById("main");
      element.classList.remove("marginLeft");
    }
  },
  methods: {
    getImage (email) {
      return gravatar.url(email)
    },
    openNav () {
      localStorage.setItem('navBarCollapsed', false)
      this.navBarCollapsed = false
      document.getElementById("mySidenav").style.width = "330px";
      document.getElementById("main").style.marginLeft = "330px";
    },
    closeNav () {
      localStorage.setItem('navBarCollapsed', true)
      this.navBarCollapsed = true
      document.getElementById("mySidenav").style.width = "80px";
      document.getElementById("main").style.marginLeft = "80px";
    },
    logout () {
      localStorage.removeItem('jwtToken')
      this.$router.push({
        name: 'Login'
      })
    },
  }
}
</script>

<style>
#app {
  /*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
  /*font-family: 'Roboto', sans-serif;*/
  font-family: 'Roboto', sans-serif;
  font-weight: 300;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100% !important;
}
.sidenav {
  height: 100%;
  width: 330px;
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  /*box-shadow: 1px 1px 5px #6c757d;*/
  background-color: #303030;
  /*background-color: rgba(28, 16, 15, 0.85);*/
  /*background-color: #fec10f;*/
  overflow-x: hidden;
  transition: 0.5s;
  padding-top: 20px;
}

.sidenav a {
  /*padding: 8px 8px 8px 32px;*/
  text-decoration: none !important;
  font-size: 16px;
  color: #ebebeb;
  display: block;
  transition: 0.3s;
}

.sidenav-item-active {
  margin: 15px;
  font-size: 20px;
  border-radius: 7px;
  background-color: #e5a27a;
  color: #081b3d !important;
  /*background-color: rgba(146, 146, 146, 0.48);*/
}

.sidenav a:hover {
  color: #b8b8ba;
}

.sidenav .closebtn {
  /*position: relative;*/
  /*top: 0;*/
  /*right: 25px;*/
  font-size: 36px;
  font-weight: 400;
  /*margin-left: 50px;*/
}

#main {
  transition: margin-left .5s;
}

.marginLeft {
  margin-left: 330px;
}

.noMargin {
  margin: 0;
}

@media screen and (max-height: 450px) {
  .sidenav {padding-top: 15px;}
  .sidenav a {font-size: 18px;}
}

button {
  outline: none !important;
}

.logo-noq {
  /*background-color: #600d00;*/
  /*border-radius: 10px;*/
  font-family: 'Merienda One', cursive;
  font-size: 40px;
  /*box-shadow: 2px 2px 2px #b4b4b4;*/
}

.big-title{
  font-size: 35px;
  color: white;
}
</style>
