<template>
  <div>
    <div>
      <b-modal ref="modal" hide-footer v-model="show" data-keyboard="false" size="lg"
               data-backdrop="static" :title="'Job Posting Settings'">
<!--        <template v-slot:modal-title>-->
<!--          <div style="font-size: 40px;" class="nice-font px-3">-->
<!--            Job Posting Settings-->
<!--          </div>-->
<!--          <p style="font-size: 17px; color: #575e65; margin-top: -3px; padding-left: 2px;" class="mb-0 nice-font px-3">Describe your job opening!</p>-->
<!--        </template>-->
        <div class="d-block text-center nice-font px-3" style="max-height: 600px; overflow-y: auto;">
          <b-alert variant="danger" v-if="showAlert" :show="10" dismissible>{{alertText}}</b-alert>
          <b-form class="text-left">
            <label class="mb-0 smaller-font">Title*</label>
            <b-form-group>
              <b-form-input id="title" v-model.trim="newJob.title" class="input-field"></b-form-input>
            </b-form-group>
            <label class="mb-0 smaller-font">Position*</label>
            <b-form-group>
              <b-form-input id="position" v-model.trim="newJob.position" class="input-field"></b-form-input>
            </b-form-group>
            <label class="mb-0 smaller-font">Location*</label>
            <b-form-group>
              <LocationSelect v-model.trim="newJob.location" @addLocation="addLocation"  :rVal="newJob.location"/>
<!--              <b-form-input id="position" v-model.trim="newJob.location" class="input-field"></b-form-input>-->
            </b-form-group>
            <label class="mb-0 smaller-font">Description</label>
            <b-form-group>
              <b-form-textarea id="position" v-model.trim="newJob.description" rows="5" class="input-field"></b-form-textarea>
            </b-form-group>
            <label class="mb-0 smaller-font">Preferred Skills</label>
            <b-form-group>
              <SkillSelect @addSkills="addSkills" :recieved-values="newJob.skills"/>
            </b-form-group>
          </b-form>
          <button class="mt-1 btn btn-outline-primary w-100" @click="editJob">Edit Job</button>
        </div>
      </b-modal>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import SkillSelect from './SkillSelect'
import LocationSelect from './LocationSelect'
import url from '../config/server_config'

export default {
  name: 'JobInfoModal',
  components: {
    SkillSelect,
    LocationSelect
  },
  props: {
    showModal: {
      type: Boolean,
      default: false,
      required: true
    },
    job: {
      type: Object
    }
  },
  data () {
    return {
      show: false,
      newJob: {
        title: '',
        position: '',
        location: ''
      },
      showAlert: false,
      alertText: ''
    }
  },
  watch: {
    showModal (newVal) {
      this.show = newVal
    },
    job (newVal) {
      this.newJob = newVal
    }
  },
  methods: {
    addSkills (skills) {
      this.newJob.skills = skills
    },
    addLocation (loc) {
      this.job.location = loc.name
    },
    editJob () {
      var headers = {
        Authorization: 'Bearer ' + localStorage.getItem('jwtToken').substring(4, localStorage.getItem('jwtToken').length)
      }

      if (this.newJob.title.length === 0 || this.newJob.position === 0 || this.newJob.location === 0) {
        this.showAlert = true
        this.alertText = 'Please fill in the required fields'
      } else {
        var id = this.job._id

        axios.patch(`${url}/api/jobs/edit/${id}`, this.newJob, {headers: headers})
          .then(response => {
            if (response.status === 200) {
              this.$swal({
                position: 'top-right',
                backdrop: false,
                showConfirmButton: false,
                timer: 2500,
                width: '300px',
                imageHeight: 20,
                imageWidth: 20,
                background: 'rgba(92,184,92,0.93)',
                title: '<span style="  font-family: \'Raleway\', sans-serif; font-size: 16px; font-weight: 200; color: white; padding-top: 10px;">Successfully edited job!</span>'
              })
              this.show = false
              this.$emit('hideModal')
            }
          })
          .catch(e => {
            if (e.response.status === 400) {
              this.showAlert = true
              this.alertText = 'Error'
            }
          })
      }

    }
  }
}
</script>

<style scoped>
  label {
    font-size: 15px;
    color: #6d6d6d;
  }

  .nice-font {
    font-family: 'Raleway', sans-serif;
    font-weight: 200;
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
  /deep/ .modal-header {
    color: white;
    background-color: #3498db;
  }
  /deep/ .close {
    color: white;
  }
  /deep/ .multiselect__tag {
    font-size: 1rem;
  }

</style>
