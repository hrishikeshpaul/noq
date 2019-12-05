<template>
  <div>
    <nav class="navbar navbar-light bg-light shadow-nav">
      <a class="navbar-brand pl-3 py-0" href="#" style="color: #17252A; font-weight: 300; font-size: 25px;">Home</a>
      <div class="text-center w-75 mt-1">
        <div class="row px-3 py-1">
          <div class="col-5">

          </div>
          <div class="col-4 pr-0">
            <FilterBar @group="callReGroup" :options="filterOptions"/>
          </div>
          <div class="col-1 pr-0">
            <button v-if="userRole == 'student'" :class="{'btn': true, 'btn-outline-secondary': !showRecommendation, 'btn-outline-primary': showRecommendation}" @click="showRecoOrWhat('reco')"><i class="ti-bolt-alt"></i></button>
          </div>
          <div class="col-1 pr-0 pl-0">
            <button v-if="userRole == 'student'" :class="{'btn': true, 'btn-outline-secondary': !showWhatIf, 'btn-outline-primary': showWhatIf}" @click="showRecoOrWhat('what')"><i class="ti-light-bulb"></i></button>
          </div>
          <div class="col-1 pl-0">
            <button class="btn btn-outline-secondary" @click="getData"><i class="ti-reload"></i></button>
          </div>
        </div>
      </div>
    </nav>
    <LoadingBar v-show="isLoading"/>

    <div class="jumbotron mx-5 mt-4 py-3" v-if="userRole == 'student' && showWhatIf">
      <div>
        <div class="pb-2">
          Modify your skills to see/hide jobs,
          <button style="float: right; border-radius: 50%; padding-left: 12px; padding-right: 12px; margin-top: -5px;" class="btn btn-sm " @click="whatIfInfoModal()">i</button>
        </div>
        <SkillSelect :recievedValues="user.skills" @addSkills="addSkill" class="mb-2"/>
      </div>
    </div>

    <Recommendation class="mx-5 mt-4" v-if="userRole == 'student' && showRecommendation" :jobs="jobs" @accept="accept" @reject="reject"/>

    <div class="mx-5 mt-4">
      <div v-for="(job, key) in computedJobs" class="mb-3" v-if="userRole === 'student'" >
        <div style="position: relative;">
          <h5 style="font-weight: 300"><div class="mb-3">{{ key }}</div></h5>
          <div
            v-for="(j, index) in job" v-if="job.length > 0"
            style="display: inline-block;"
            class="mr-5">
            <JobCard
              :job="j"
              ref="card"
              :id="j._id"
              :whatIf="showWhatIf"
              @showJobModal="homePageJobModal(j, key)"
              @accept="accept"
              @reject="reject"
              class="mb-3"
              :style="{'min-width': '180px', 'z-index': '-1', 'width': '180px', 'height': '200px'}"/>
          </div>
          <div v-else>You are out of companies!</div>
        </div>
      </div>

      <div v-for="(user, key) in computedUsers" class="mb-3" v-if="userRole === 'employer'">
        <div style="position: relative;">
          <h5 style="font-weight: 300;"><div class="mb-3">{{ key }}</div></h5>
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
              :style="{'min-width': '180px', 'width': '180px', 'height': '200px'}"/>
          </div>
          <div v-else>You are out of users!</div>
        </div>
      </div>
    </div>
    <HomePageJobModal :showModal="showHomePageJobModal" @hideModal="hideHomePageJobModal" :job="homePageJobToSend" @accept="accept" @reject="reject"/>
    <HomePageUserModal :showModal="showHomePageUserModal" @hideModal="hideHomePageUserModal" :user="homePageUserToSend" @accept="acceptUser" @reject="rejectUser" :showButtons="true"/>
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
import Recommendation from './Recommendation'
import LoadingBar from './LoadingBar'
import SkillSelect from './SkillSelect'

export default {
  name: 'HomePage',
  components: {
    NavBar,
    FilterBar,
    JobCard,
    UserCard,
    HomePageJobModal,
    HomePageUserModal,
    Recommendation,
    LoadingBar,
    SkillSelect
  },
  data () {
    return {
      originalJobList: [],
      originalSkillList: [],
      isLoading: true,
      showWhatIf: false,
      showRecommendation: false,
      user_id: localStorage.getItem('user_id'),
      jobs: [],
      profilepicture: localStorage.profilepicture,
      role: '',
      users: [],
      user: {},
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
        { name: 'University', code: 'company' }
      ],
      showHomePageJobModal: false,
      showHomePageUserModal: false
    }
  },
  watch: {
    jobs (newVal) {
      if (newVal) {
        if (this.userRole === 'student') {
          var newObject = JSON.parse(JSON.stringify(this.jobs))
          this.computedJobs = this.reGroup(newObject, this.studentKeyToGroup)
        }
      }
    },
    users (newVal) {
      if (newVal) {
        if (this.userRole === 'employer') {
          this.computedUsers = this.reGroup(this.users, this.employerKeyToGroup)
        }
      }
    },
    showWhatIf (newValue) {
      if (!newValue) {
        this.callReGroup(this.studentKeyToGroup)
      }
    }
  },
  mounted () {
    if (localStorage.getItem('navBarCollapsed') === 'false') {
      document.getElementById('main').style.marginLeft = '330px';
    } else if (localStorage.navBarCollapsed === 'true')
      document.getElementById('main').style.marginLeft = '80px'

  },
  created () {
    this.getData()
    this.filterOptions = localStorage.getItem('role') === 'student' ? this.studentFilterOptions : this.employerFilterOptions
  },
  methods: {
    whatIfInfoModal () {
      this.$swal({
        backdrop: true,
        position: 'top',
        showConfirmButton: true,
        imageHeight: 20,
        imageWidth: 20,
        timer: 100000,
        confirmButtonColor: '#f4ae84',
        showCanceButton: true,
        type: 'info',
        title: '<span style="  font-family: \'Roboto\', sans-serif; font-size: 16px; font-weight: 200; color: black; padding-top: 10px;">Here, you can select or deselect different skills to see the jobs that could have appeared to you as some of the jobs have not been displayed due to the Smart Filtering System.</span>'
      })
    },
    addSkill (skills) {
      this.user.skills = skills
      this.callReGroup(this.studentKeyToGroup)
    },
    showRecoOrWhat (param) {
      if (param === 'reco') {
        this.showRecommendation = !this.showRecommendation
        this.showWhatIf = false
      } else {
        this.showRecommendation = false
        if (this.showWhatIf) {
          this.user.skills = this.originalSkillList
          this.reGroup(this.jobs, this.studentKeyToGroup)
        }
        this.showWhatIf = !this.showWhatIf
      }
    },
    homePageUserModal (user, key) {
      this.homePageUserToSend = user
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
      this.isLoading = true
      this.showWhatIf = false
      this.showRecommendation = false

      axios.get(`${url}/api/user/${this.user_id}`, {headers: headers})
        .then(response => {
          this.user = response.data
        }).catch(e => {
          if (e.response.status === 401) {
            this.$router.push({
              name: 'Login'
            })
          }
        })

      axios.get(`${url}/api/jobs`, {params, headers})
        .then(response => {
          if (this.userRole === 'student') {
            this.jobs = response.data
            this.jobs.forEach(job => {
              job.whatif = false
            })
            this.getOriginalJobList(this.jobs, this.studentKeyToGroup)
          } else {
            this.users = response.data
          }

          this.isLoading = false
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
            title: '<span style="  font-family: \'Roboto\', sans-serif; font-size: 16px; font-weight: 200; color: white; padding-top: 10px;">Successfully rejected job!</span>'
          })
          this.showHomePageJobModal = false
          this.$refs['card'].forEach(card => {
            if (card.$el.id === i) {

              // card.$el.classList.add('object')
              // card.$el.classList.add('move-left')
            }
          })
          this.jobs.splice(this.jobs.findIndex(function (it) {
            return it._id === i
          }), 1)
          this.getData()

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
            title: '<span style="  font-family: \'Roboto\', sans-serif; font-size: 16px; font-weight: 200; color: white; padding-top: 10px;">Successfully accepted job!</span>'
          })
          this.showHomePageJobModal = false
          this.$refs['card'].forEach(card => {
            if (card.$el.id === i) {
              // card.$el.classList.add('object')
              // card.$el.classList.add('move-right')
            }
          })
          this.jobs.splice(this.jobs.findIndex(function (it) {
            return it._id === i._id
          }), 1)
          this.getData()
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
            title: '<span style="  font-family: \'Roboto\', sans-serif; font-size: 16px; font-weight: 200; color: white; padding-top: 10px;">Successfully accepted user!</span>'
          })
          this.showHomePageUserModal = false
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
            title: '<span style="  font-family: \'Roboto\', sans-serif; font-size: 16px; font-weight: 200; color: white; padding-top: 10px;">Successfully rejected user!</span>'
          })
          this.showHomePageUserModal = false
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
    getOriginalJobList (list, key) {
      let rlist = Array.from(list)
      var io = []
      list = []
      this.user.skills.forEach(skill => {
        io.push(skill.name)
      })
      if (io.length === 0) {
        return {}
      }
      for (let i = 0; i < rlist.length; i++) {
        var count = 0
        const skills = rlist[i].skills
        for (var x of skills) {
          if (io.includes(x.name)) {
            count = count + 1
          }
        }
        if (count >= 1) {
          list.push(rlist[i])
        }
      }
      this.originalJobList = Array.from(list)
      this.originalSkillList = Array.from(this.user.skills)
    },
    callReGroup (key) {
      if (this.userRole === 'student') {
        this.keyToGroup = key
        this.studentKeyToGroup = key
        this.computedJobs = this.reGroup(this.jobs, this.studentKeyToGroup)
      } else {
        this.keyToGroup = key
        this.employerKeyToGroup = key
        this.computedUsers = this.reGroup(this.users, key)
      }
    },
    reGroup (list, key) {
      if (this.user.role === 'student') {
        let rlist = Array.from(list)
        var io = []
        list = []
        this.user.skills.forEach(skill => {
          io.push(skill.name)
        })
        if (io.length === 0) {
          return {}
        }
        for (let i = 0; i < rlist.length; i++) {
          var count = 0
          const skills = rlist[i].skills
          for (var x of skills) {
            if (io.includes(x.name)) {
              count = count + 1
            }
          }
          if (count >= 1) {
            list.push(rlist[i])
          }
        }

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
      } else {
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
  /deep/ .bg-light {
    background-color: #e1e1e1 !important;
  }

  /*.shadow-nav {*/
  /*  box-shadow: 1px 1px 1px #b4b4b4;*/
  /*}*/

  /deep/ .btn {
    cursor: pointer !important;
  }

  /deep/ .btn:focus {
    outline: none !important;
  }

  /deep/ .btn-outline-primary {
    border: 1px solid #c68967 !important;
    background-color: #f4ae84 !important;
    color: black !important;

  }
  /deep/ .btn-outline-primary:hover {
    border-color: #f6af85 !important;
    background-color: #e6a37c !important;
    color: black !important;

  }
  /deep/ .jumbotron {
    background-color: rgba(255, 182, 139, 0.55);
  }

</style>
