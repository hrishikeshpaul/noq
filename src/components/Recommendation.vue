<template>
  <div>
    <div class="jumbotron py-3">
      <div class="mb-3"><span style="font-size: 18px; font-weight: 300;">{{message}}</span></div>
      <carousel :autoplay="true" :perPage="6" :navigationEnabled="true" class="pl-3">
        <slide v-for="j in recJobs">
          <JobCard
            :job="j"
            ref="card"
            :id="j._id"
            class="mb-3"
            @accept="accept"
            @reject="reject"
            @showJobModal="homePageJobModal(j)"
            :style="{'min-width': '180px', 'width': '180px', 'height': '200px'}"></JobCard>
        </slide>
      </carousel>
    </div>
    <HomePageJobModal :showModal="showHomePageJobModal" @hideModal="hideHomePageJobModal" :job="homePageJobToSend" @accept="accept" @reject="reject"/>
  </div>
</template>

<script>
import { Carousel, Slide } from 'vue-carousel'

import axios from 'axios'
import url from '../config/server_config'

import JobCard from './JobCard'
import HomePageJobModal from './HomePageJobModal'

export default {
  name: 'Recommendation',
  components: {
    Carousel,
    Slide,
    JobCard,
    HomePageJobModal
  },
  props: {
    jobs: {
      type: Array
    }
  },
  data () {
    return {
      user_id: localStorage.user_id,
      requiredSkill: '',
      recJobs: [],
      showHomePageJobModal: false,
      homePageJobToSend: {},
      message: 'Loading Recommendations...'
    }
  },
  watch: {
    jobs (newVal) {
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    accept (job) {
      this.jobs.splice(this.jobs.findIndex(function (it) {
        return it._id === job._id
      }), 1)
      this.$emit('accept', job)
    },
    reject (job) {
      this.$emit('reject', job)
    },
    homePageJobModal (job) {
      this.homePageJobToSend = job
      this.showHomePageJobModal = !this.showHomePageJobModal
    },
    hideHomePageJobModal () {
      this.showHomePageJobModal = false
    },
    getData () {
      var headers = {
        // Authorization: 'Bearer ' + localStorage.getItem('jwtToken').substring(4, localStorage.getItem('jwtToken').length)
      }

      axios.get(`${url}/api/jobs/recommendation/${this.user_id}`, {headers})
        .then(response => {
          this.requiredSkill = response.data.name
          this.message = `Since you have ${this.requiredSkill} in your skill set or have applied to jobs with ${this.requiredSkill} as a required skill,`
          this.jobs.forEach(job => {
            job.skills.forEach(skill => {
              if (skill.name == this.requiredSkill)
                this.recJobs.push(job)
            })
          })
        })
        .catch(e => {
          console.log(e.data)
        })
      }
    }
}
</script>

<style scoped>
/deep/ .jumbotron {
  background-color: rgba(255, 182, 139, 0.55);
}
  /deep/ .VueCarousel-dot-container {
    margin-top: 0 !important;
  }
</style>
