<template>
  <div id="app">
    <div id="mySidenav" class="sidenav" v-if="$route.path !== '/login' && $route.path !== '/build_profile' ">
      <div style="display: flex; justify-content: space-between" class="px-4 text-center">
          <div class="big-title text-center" style="display: inline; margin-left: -13px;" v-if="!navBarCollapsed">
            <span class="px-2 logo-noq">noQ</span>
            <p class="mt-1" style="font-size: 10px; color: white">Making Career Fairs Easier</p>
          </div>

        <div style="display: inline; margin-left: 12px;" >
          <a href="javascript:void(0)" class="closebtn" @click="openNav" v-if="navBarCollapsed">&rang;</a>
          <a href="javascript:void(0)" class="closebtn" @click="closeNav" v-else style="margin-top: 10px;">&lang;</a>
        </div>
      </div>

      <hr style="background-color: #7e868a; margin-bottom: 0px; padding-bottom: 0px;"/>
      <div>
        <a href="#">
            <router-link to="/profile" :class="{'sidenav-item-active': $route.name === 'Profile'}">
              <div :class="{'text-center': navBarCollapsed, 'text-left': !navBarCollapsed, 'py-3': true}">
                <div v-if="!navBarCollapsed" class="px-4">
                  <div class="row">
                    <div class="col-3">
                      <img :src="getImage(email)" style="height: 60px; width: 60px; border-radius: 50%;"/>

                    </div>
                    <div class="col-9">
                      <span style="font-size: 17px;">{{email}}</span>
                      <p style="font-size: 15px; margin-top: -10px;">{{role}}</p>
                    </div>
                  </div>
                </div>
                <span v-else><i class="ti-user"></i></span>
              </div>
            </router-link>
          </a>
        <hr style="background-color: #757d80; height: 1px" class="py-0 my-0"/>
          <a href="#">
            <router-link to="/" :class="{'sidenav-item-active': $route.name === 'HomePage'}">
              <div :class="{'text-center': navBarCollapsed, 'text-left': !navBarCollapsed, 'py-3': true}">
                <span v-if="!navBarCollapsed" class="px-4">Home</span>
                <span v-else><i class="ti-home"></i></span>
              </div>
            </router-link>
          </a>
        <a href="#">
          <router-link to="/">
            <div :class="{'text-center': navBarCollapsed, 'text-left': !navBarCollapsed, 'py-3': true}">
              <span v-if="!navBarCollapsed" class="px-4">Messages</span>
              <span v-else><i class="ti-comment-alt"></i></span>
            </div>
          </router-link>
        </a>
        <a href="#">
          <router-link to="/settings" :class="{'sidenav-item-active': $route.name === 'ProfileSettings'}">
            <div :class="{'text-center': navBarCollapsed, 'text-left': !navBarCollapsed, 'py-3': true}">
              <span v-if="!navBarCollapsed" class="px-4">Settings</span>
              <span v-else><i class="ti-settings"></i></span>
            </div>
          </router-link>
        </a>

        <hr style="background-color: #7e868a; margin-bottom: 0px; padding-bottom: 0px;"/>
        <a href="#">
          <router-link to="/">
            <div :class="{'text-center': navBarCollapsed, 'text-left': !navBarCollapsed, 'py-3': true}" @click="logout">
              <span v-if="!navBarCollapsed" class="px-4">Logout</span>
              <span v-else><i class="ti-control-backward"></i></span>
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

export default {
  name: 'App',
  components: {
    Gravatar
  },
  data () {
    return {
      navBarCollapsed: false,
      email: '',
      role: ''
    }
  },
  mounted () {
    this.email = localStorage.getItem('email')
    this.role = localStorage.getItem('role')
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
      this.navBarCollapsed = false
      document.getElementById("mySidenav").style.width = "330px";
      document.getElementById("main").style.marginLeft = "330px";
    },
    closeNav () {
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
  font-family: 'Raleway', sans-serif;
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
  box-shadow: 1px 1px 5px #6c757d;
  background-color: rgba(28, 16, 15, 0.85);
  /*background-color: #fec10f;*/
  overflow-x: hidden;
  transition: 0.5s;
  padding-top: 20px;
}

.sidenav a {
  /*padding: 8px 8px 8px 32px;*/
  text-decoration: none;
  font-size: 25px;
  color: #ebebeb;
  display: block;
  transition: 0.3s;
}

.sidenav-item-active {
  background-color: rgba(138, 82, 77, 0.48);
}

.sidenav a:hover {
  color: #78757c;
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
