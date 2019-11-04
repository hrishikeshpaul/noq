<template>
  <div>
    <div>
      <b-modal ref="modal" hide-footer v-model="show" data-keyboard="false" size="lg"
               data-backdrop="static" :title="'Post a Job'">
<!--        <template v-slot:modal-title>-->
<!--          <div style="font-size: 40px;" class="nice-font px-3">-->
<!--            Edit Profile-->
<!--          </div>-->
<!--          <p style="font-size: 17px; color: #7f8993; margin-top: -7px; padding-left: 5px;" class="mb-0 px-3 nice-font">Make changes to some basic details of your profile!</p>-->
<!--        </template>-->
        <div class="d-block text-center px-3 nice-font mb-2" style="max-height: 600px; overflow-y: auto;">
          <b-alert dismissible variant="danger" v-model="showAlert" :show="10"> {{alertText}}</b-alert>
          <b-form class="text-left">
            <label class="mb-0 smaller-font">Title*</label>
            <b-form-group>
              <b-form-input id="title" v-model.trim="job.title" class="input-field"></b-form-input>
            </b-form-group>
            <label class="mb-0 smaller-font">Position*</label>
            <b-form-group>
              <b-form-input id="position" v-model.trim="job.position" class="input-field"></b-form-input>
            </b-form-group>
            <label class="mb-0 smaller-font">Location*</label>
            <b-form-group>
              <b-form-input id="company" v-model.trim="job.location" class="input-field"></b-form-input>
            </b-form-group>
            <label class="mb-0 smaller-font">Job Description</label>
            <b-form-group>
              <b-form-textarea id="company" v-model.trim="job.description" rows="3" class="input-field"></b-form-textarea>
            </b-form-group>
            <label class="mb-0 smaller-font">Preferred</label>
            <b-form-group>
              <SkillSelect @addSkills="addSkills"/>
            </b-form-group>
          </b-form>
        <button class="mt-2 btn btn-outline-warning w-100" @click="postJob">Post</button>
        </div>
      </b-modal>
    </div>
  </div>
</template>

<script>
import SkillSelect from './SkillSelect'
import axios from 'axios'
import url from '../config/server_config'

export default {
  name: 'JobInputModal',
  components: {
    SkillSelect
  },
  props: {
    showModal: {
      type: Boolean,
      default: false,
      required: true
    },
    user: {
      type: Object
    }
  },
  data () {
    return {
      job: {
        title: '',
        position: '',
        location: ''
      },
      show: false,
      showAlert: false,
      alertText: ''
    }
  },
  watch: {
    showModal (newVal) {
      this.show = newVal
    }
  },
  methods: {
    addSkills (skills) {
      this.job.skills = skills
    },
    postJob () {
      var headers = {
        Authorization: 'Bearer ' + localStorage.getItem('jwtToken').substring(4, localStorage.getItem('jwtToken').length)
      }

      if (this.job.title.length === 0 || this.job.position === 0 || this.job.location === 0) {
        this.showAlert = true
        this.alertText = 'Please fill in the required fields'
      } else {
        this.job['employer'] = localStorage.getItem('user_id')
        this.job['company'] = this.user.company

        axios.post(`${url}/api/jobs`, this.job, {headers: headers})
          .then(response => {
            if (response.status == 204) {
              this.$swal({
                position: 'top-right',
                backdrop: false,
                showConfirmButton: false,
                timer: 2500,
                width: '300px',
                imageHeight: 20,
                imageWidth: 20,
                background: 'rgba(92,184,92,0.93)',
                title: '<span style="  font-family: \'Raleway\', sans-serif; font-size: 16px; font-weight: 200; color: white; padding-top: 10px;">Successfully posted job!</span>'
              })
              this.job.title = ''
              this.job.position = ''
              this.job.location = ''
              this.job.description = ''
              this.show = false
              this.$emit('hideModal')
              this.$emit('getData')
            }
          })
          .catch(e => {
            if (e.response.status === 401) {
              this.$router.push({
                name: 'Login'
              })
            }
          })
      }
    }
  }
}
</script>

<style scoped>
  .nice-font {
    font-family: 'Raleway', sans-serif;
    font-weight: 200;
    /*font-family: 'Avenir', Helvetica, Arial, sans-serif !important;*/
  }
  .input-field {
    border: 0;
    border-radius: 2px;
    outline: none;
    box-shadow: none;
    margin-top: 1px;
    background-color: #f6f6f6;
  }
  .input-field:hover {
    background-color: #f1f1f1;
  }
  .input-field:focus {
    background-color: #eaeaea;
  }
  .smaller-font {
    font-size: 13px;
  }
  /deep/ .modal-title {
    font-family: 'Raleway', sans-serif;
    font-weight: 200;
    padding-left: 1rem;
    font-size: 35px;
  }
</style>
