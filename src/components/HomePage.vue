<template>
  <div>
<!--    <NavBar @logout="logout"/>-->
    <div style="font-size: 60px;" class="mx-5 mb-0 mt-3">Home</div>
    <p class="" style="color: grey; margin-top: -10px; margin-left: 53px;">{{role === 'student' ? 'Apply to companies that are are a perfect fit for you!' : 'Accept candidates that are a perfect fit for your organisation'}}</p>
    <div class="container">
      <FilterBar @group="callReGroup" :options="filterOptions"/>
    </div>

    <div class="mx-5">
      <div v-for="(job, key) in computedJobs" class="mb-3" v-if="userRole === 'student'" >
        <div style="position: relative;">
          <h3><div class="mb-3">{{ key }}</div></h3>
          <div
            v-for="(j, index) in job" v-if="job.length > 0"
            style="display: inline-block;"
            class="mr-5">
            <JobCard
              :job="j"
              ref="card"
              :id="j._id"
              @showJobModal="homePageJobModal(j, key)"
              @accept="accept"
              @reject="reject"
              class="mb-3"
              :style="{'min-width': '200px', 'z-index': index+1, 'width': '270px', 'height': '300px'}"/>
          </div>
          <div v-else>You are out of companies!</div>
        </div>
      </div>

      <div v-for="(user, key) in computedUsers" class="mb-3" v-if="userRole === 'employer'">
        <div style="position: relative;">
          <h3><div class="mb-3">{{ key }}</div></h3>
          <div
            v-for="u in user" v-if="user.length > 0"
            style="display: inline-block;"
            class="mr-5">
            <UserCard
              :user="u"
              ref="card"
              :id="u._id"
              @showUserModal="homePageUserModal(u, key)"
              @accept="acceptUser"
              @reject="rejectUser"
              class="mb-3"
              :style="{'min-width': '200px', 'width': '270px', 'height': '300px'}"/>
          </div>
          <div v-else>You are out of users!</div>
        </div>
      </div>
    </div>
    <HomePageJobModal :showModal="showHomePageJobModal" @hideModal="hideHomePageJobModal" :job="homePageJobToSend"/>
    <HomePageUserModal :showModal="showHomePageUserModal" @hideModal="hideHomePageUserModal" :user="homePageUserToSend" />
  </div>
</template>

<script>

import axios from 'axios'
import url from '../config/server_config'

import NavBar from './NavBar'
import FilterBar from './FilterBar'
import JobCard from './JobCard'
import UserCard from './UserCard'
import HomePageJobModal from './HomePageJobModal'
import HomePageUserModal from './HomePageUserModal'

export default {
  name: 'HomePage',
  components: {
    NavBar,
    FilterBar,
    JobCard,
    UserCard,
    HomePageJobModal,
    HomePageUserModal
  },
  data () {
    return {
      user_id: localStorage.getItem('user_id'),
      jobs: [],
      role: '',
      users: [],
      showClass: false,
      homePageJobToSend: {},
      homePageUserToSend: {},
      computedJobs: {},
      computedUsers: {},
      studentKeyToGroup: 'position',
      employerKeyToGroup: 'company',
      userRole: localStorage.getItem('role'),
      filterOptions: [],
      studentFilterOptions: [
        { name: 'Position', code: 'position' },
        { name: 'Location', code: 'location' },
        { name: 'Company', code: 'company' }
      ],
      employerFilterOptions: [
        { name: 'Company', code: 'company' },
        { name: 'Gender', code: 'gender' },
      ],
      showHomePageJobModal: false,
      showHomePageUserModal: false
    }
  },
  watch: {
    jobs (newVal) {
      if (newVal) {
        if (this.userRole === 'student') {
          this.computedJobs = this.reGroup(this.jobs, this.studentKeyToGroup)
        }
      }
    },
    users (newVal) {
      if (newVal) {
        if (this.userRole === 'employer') {
          this.computedUsers = this.reGroup(this.users, this.employerKeyToGroup)
        }
      }
    }
  },
  mounted () {
    if (localStorage.getItem('navBarCollapsed') == 'false') {
      console.log('here')
      document.getElementById("main").style.marginLeft = "330px";
    }
    else if (localStorage.navBarCollapsed == 'true')
      document.getElementById("main").style.marginLeft = "80px"

  },
  created () {
    this.getData()
    this.filterOptions = localStorage.getItem('role') === 'student' ? this.studentFilterOptions : this.employerFilterOptions
  },
  methods: {
    homePageUserModal (user, key) {
      this.homePageUserToSend = user
      console.log(this.homePageUserToSend)
      this.homePageUserToSend[this.employerKeyToGroup] = key
      this.showHomePageUserModal = !this.showHomePageUserModal
    },
    hideHomePageUserModal () {
      this.showHomePageUserModal = false
    },
    homePageJobModal (job, key) {
      this.homePageJobToSend = job
      this.homePageJobToSend[this.studentKeyToGroup] = key
      this.showHomePageJobModal = !this.showHomePageJobModal
    },
    hideHomePageJobModal () {
      this.showHomePageJobModal = false
    },
    getData () {
      var headers = {
        Authorization: 'Bearer ' + localStorage.getItem('jwtToken').substring(4, localStorage.getItem('jwtToken').length)
      }
      var params = {
        user: this.user_id,
        role: localStorage.role
      }

      axios.get(`${url}/api/jobs`, {params, headers})
        .then(response => {
          if (this.userRole === 'student') {
            this.jobs = response.data
          } else {
            this.users = response.data
          }
        })
        .catch(e => {
          if (e.response.status === 401) {
            this.$router.push({
              name: 'Login'
            })
          }
        })
    },
    reject (i) {
      var headers = {
        Authorization: 'Bearer ' + localStorage.getItem('jwtToken').substring(4, localStorage.getItem('jwtToken').length),
        'Content-Type': 'application/json'
      }

      axios.patch(`${url}/api/jobs/reject`, {
        role: this.userRole,
        user: localStorage.getItem('user_id'),
        job: i
      }, {headers})
        .then(response => {
          this.$swal({
            position: 'top-right',
            backdrop: false,
            showConfirmButton: false,
            timer: 2500,
            width: '300px',
            imageHeight: 20,
            imageWidth: 20,
            background: 'rgba(92,184,92,0.93)',
            title: '<span style="  font-family: \'Raleway\', sans-serif; font-size: 16px; font-weight: 200; color: white; padding-top: 10px;">Successfully rejected job!</span>'
          })
          console.log(this.$refs['card'])
          this.$refs['card'].forEach(card => {
            if (card.$el.id === i) {

              // card.$el.classList.add('object')
              // card.$el.classList.add('move-left')
            }
          })
          this.jobs.splice(this.jobs.findIndex(function (it) {
            return it._id === i
          }), 1)

        })
        .catch(e => {
          console.log(e.data)
        })
    },
    accept (i) {
      var headers = {
        Authorization: 'Bearer ' + localStorage.getItem('jwtToken').substring(4, localStorage.getItem('jwtToken').length),
        'Content-Type': 'application/json'
      }

      axios.patch(`${url}/api/jobs/accept`, {
        user: localStorage.getItem('user_id'),
        job: i,
        role: this.userRole
      }, {headers})
        .then(response => {
          this.$swal({
            position: 'top-right',
            backdrop: false,
            showConfirmButton: false,
            timer: 2500,
            width: '300px',
            imageHeight: 20,
            imageWidth: 20,
            background: 'rgba(92,184,92,0.93)',
            title: '<span style="  font-family: \'Raleway\', sans-serif; font-size: 16px; font-weight: 200; color: white; padding-top: 10px;">Successfully accepted job!</span>'
          })
          this.$refs['card'].forEach(card => {
            if (card.$el.id === i) {
              // card.$el.classList.add('object')
              // card.$el.classList.add('move-right')
            }
          })
          this.jobs.splice(this.jobs.findIndex(function (it) {
            return it._id === i
          }), 1)
        })
        .catch(e => {
          console.log(e.data)
        })
    },
    acceptUser (i) {
      var headers = {
        Authorization: 'Bearer ' + localStorage.getItem('jwtToken').substring(4, localStorage.getItem('jwtToken').length),
        'Content-Type': 'application/json'
      }

      axios.patch(`${url}/api/jobs/accept`, {
        user: localStorage.getItem('user_id'),
        userToAccept: i.id,
        job: i.job,
        role: this.userRole
      }, {headers})
        .then(response => {
          this.$swal({
            position: 'top-right',
            backdrop: false,
            showConfirmButton: false,
            timer: 2500,
            width: '300px',
            imageHeight: 20,
            imageWidth: 20,
            background: 'rgba(92,184,92,0.93)',
            title: '<span style="  font-family: \'Raleway\', sans-serif; font-size: 16px; font-weight: 200; color: white; padding-top: 10px;">Successfully accepted user!</span>'
          })
          this.$refs['card'].forEach(card => {
            if (card.$el.id === i) {
              // card.$el.classList.add('object')
              // card.$el.classList.add('move-right')
            }
          })
          this.users.splice(this.users.findIndex(function (it) {
            return it._id === i.id
          }), 1)
        })
        .catch(e => {
          console.log(e.data)
        })
    },
    rejectUser (i) {
      var headers = {
        Authorization: 'Bearer ' + localStorage.getItem('jwtToken').substring(4, localStorage.getItem('jwtToken').length),
        'Content-Type': 'application/json'
      }

      axios.patch(`${url}/api/jobs/reject`, {
        user: localStorage.getItem('user_id'),
        userToReject: i.id,
        job: i.job,
        role: this.userRole
      }, {headers})
        .then(response => {
          this.$swal({
            position: 'top-right',
            backdrop: false,
            showConfirmButton: false,
            timer: 2500,
            width: '300px',
            imageHeight: 20,
            imageWidth: 20,
            background: 'rgba(92,184,92,0.93)',
            title: '<span style="  font-family: \'Raleway\', sans-serif; font-size: 16px; font-weight: 200; color: white; padding-top: 10px;">Successfully rejected user!</span>'
          })
          this.$refs['card'].forEach(card => {
            if (card.$el.id === i) {
              // annimations go here
              // card.$el.classList.add('object')
              // card.$el.classList.add('move-left')
            }
          })
          this.users.splice(this.users.findIndex(function (it) {
            return it._id === i
          }), 1)

        })
        .catch(e => {
          console.log(e.data)
        })
    },
    logout () {
      localStorage.removeItem('jwtToken')
      this.$router.push({
        name: 'Login'
      })
    },
    callReGroup (key) {
      if (this.userRole === 'student') {
        this.keyToGroup = key
        this.studentFilterOptions = key
        this.computedJobs = this.reGroup(this.jobs, this.studentFilterOptions)
      } else {
        this.keyToGroup = key
        this.employerKeyToGroup = key
        this.computedUsers = this.reGroup(this.users, key)
      }
    },
    reGroup (list, key) {
      const newGroup = {}
      list.forEach(item => {
        const newItem = Object.assign({}, item)
        delete newItem[key]
        newGroup[item[key]] = newGroup[item[key]] || []
        newGroup[item[key]].push(newItem)
      })

      const ordered = {}
      Object.keys(newGroup).sort().forEach(function (key) {
        ordered[key] = newGroup[key]
      })

      for (var k in ordered) {
        ordered[k].forEach(job => {
          job[this.keyToGroup] = k
        })
      }
      return ordered
    }
  }
}

</script>

<style scoped>

  .move-right {
    transform: translate(150px,0);
    -webkit-transform: translate(150px,0); /** Chrome & Safari **/
    -o-transform: translate(150px,0); /** Opera **/
    -moz-transform: translate(150px,0); /** Firefox **/
  }
  .move-left {
    transform: translate(-150px,0);
    -webkit-transform: translate(1-50px,0); /** Chrome & Safari **/
    -o-transform: translate(-150px,0); /** Opera **/
    -moz-transform: translate(-150px,0); /** Firefox **/
  }
  .object {
    transition: all 0.5s ease-in-out;
    -webkit-transition: all 0.5s ease-in-out; /** Chrome & Safari **/
    -moz-transition: all 0.5s ease-in-out; /** Firefox **/
    -o-transition: all 0.5s ease-in-out; /** Opera **/
  }
  .logo-noq {
    background-color: #f7c141;
    border-radius: 10px;
    box-shadow: 2px 2px 2px #b4b4b4;
  }

  .big-title{
    font-size: 50px;
    color: white;
  }

</style>
