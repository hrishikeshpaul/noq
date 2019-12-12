<template>
  <div>
    <div>
      <b-modal ref="modal" hide-footer v-model="show" data-keyboard="false" size="lg"
               data-backdrop="static" :title="'Experience'" header-bg-variant="warnning">
<!--        <template v-slot:modal-title>-->
<!--          <div style="font-size: 40px;" class="nice-font px-3">-->
<!--            Experience-->
<!--          </div>-->
<!--          <p style="font-size: 17px; color: #575e65; margin-top: -7px; padding-left: 2px;" class="mb-0 nice-font px-3">In a few words, describe your work experience!</p>-->
<!--        </template>-->
        <div class="d-block text-center nice-font px-3 pb-2" style="max-height: 600px; overflow-y: auto;">
          <b-alert variant="danger" v-if="showAlert" :show="10">{{alertText}}</b-alert>
          <b-form class="text-left">
            <label>Organization/Company*</label>
            <b-form-group>
              <b-form-input id="title" v-model.trim="newExperience.company" class="input-field"></b-form-input>
            </b-form-group>
            <label class="mb-0 smaller-font">Title*</label>
            <b-form-group>
              <b-form-input id="position" v-model.trim="newExperience.title" class="input-field"></b-form-input>
            </b-form-group>
            <label class="mb-0 smaller-font">Position*</label>
            <b-form-group>
              <b-form-input id="position" v-model.trim="newExperience.location" class="input-field"></b-form-input>
            </b-form-group>
            <div class="row">
              <div class="col-6">
                <label class="mb-0 smaller-font">From*</label>
                <b-form-group>
                  <b-form-input id="from" v-model="newExperience.from" type="date" required class="input-field"></b-form-input>
                </b-form-group>
              </div>
              <div class="col-6">
                <label class="mb-0 smaller-font">To</label><span style="background-color: #b4b4b4; color: white; border-radius: 50%; margin-left: 5px;" class="px-2 info-hover" data-toggle="tooltip" data-placement="top" title="If you are currently enrolled, leave this blank">i</span>
                <b-form-group>
                  <b-form-input id="to" v-model="newExperience.to" type="date" class="input-field"></b-form-input>
                </b-form-group>
              </div>
            </div>
            <label class="mb-0 smaller-font">Description</label>
            <b-form-group>
              <b-form-textarea id="position" v-model.trim="newExperience.description" rows="4" class="input-field"></b-form-textarea>
            </b-form-group>
          </b-form>
          <div class="text-right">
            <button class="mt-3 w-10 btn btn-outline-secondary"
                      @click="$emit('hideModal') ">Close
            </button>
            <button class="mt-3 w-25 btn btn-outline-primary" type="submit" v-if="buttonText === 'Edit Experience'"
                      @click="editExperience ">{{buttonText}}
            </button>
            <button class="mt-3 w-25 btn btn-outline-primary" type="submit" v-else @click="addExperience ">
              {{buttonText}}
            </button>
          </div>
        </div>

      </b-modal>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import url from '../config/server_config'

export default {
  name: 'ExperienceModal',
  components: {},
  props: {
    showModal: {
      type: Boolean,
      default: false,
      required: true
    },
    experience: {
      type: Object
    },
    user: {
      type: Object
    },
    buttonText: {
      type: String
    }
  },
  data () {
    return {
      show: false,
      newExperience: {},
      showAlert: false,
      alertText: ''
    }
  },
  watch: {
    showModal (newVal) {
      this.show = newVal
    },
    experience (newVal) {
      this.newExperience = newVal
      this.newExperience.from = this.$moment(this.newExperience.from).format('YYYY-MM-DD')
      this.newExperience.to = this.$moment(this.newExperience.to).format('YYYY-MM-DD')
    }
  },
  methods: {
    addExperience () {
      var headers = {
        // Authorization: 'Bearer ' + localStorage.getItem('jwtToken').substring(4, localStorage.getItem('jwtToken').length)
      }

      if (this.newExperience.company.length === 0) {
        this.showAlert = true
        this.alertText = 'Company is required'
      } else if (this.newExperience.title.length === 0) {
        this.showAlert = true
        this.alertText = 'Title is required'
      } else if (this.newExperience.to == 'Invalid date') {
        this.newExperience.to = null
      } else if (this.newExperience.from == 'Invalid date') {
        this.showAlert = true
        this.alertText = 'From date is required'
      } else if (this.newExperience.location === 0) {
        this.showAlert = true
        this.alertText = 'Location is required'
      } else {
        axios.post(`${url}/api/profile/experience`, {
          data: [this.newExperience],
          user: {id: this.user._id}
        }, {headers: headers})
          .then(response => {
            this.$swal({
              position: 'bottom-right',
              backdrop: false,
              showConfirmButton: false,
              timer: 2500,
              width: '300px',
              imageHeight: 20,
              imageWidth: 20,
              background: 'rgba(92,184,92,0.93)',
              title: '<span style="  font-family: \'Roboto\', sans-serif; font-size: 16px; font-weight: 200; color: white; padding-top: 10px;">Successfully added experience!</span>'
            })
            this.show = false
            this.newExperience = {}
            this.$emit('hideModal')
          })
          .catch(e => {
            if (e.response.status === 400) {
              this.showAlert = true
              this.alertText = 'Error while adding experience'
            }
          })
      }
    },
    editExperience () {
      var headers = {
        // Authorization: 'Bearer ' + localStorage.getItem('jwtToken').substring(4, localStorage.getItem('jwtToken').length)
      }

      var id = this.experience._id

      axios.patch(`${url}/api/profile/experience/${id}`, this.newExperience, {headers: headers})
        .then(response => {
          if (response.status === 200) {
            this.$swal({
              position: 'bottom-right',
              backdrop: false,
              showConfirmButton: false,
              timer: 2500,
              width: '300px',
              imageHeight: 20,
              imageWidth: 20,
              background: 'rgba(92,184,92,0.93)',
              title: '<span style="  font-family: \'Roboto\', sans-serif; font-size: 16px; font-weight: 200; color: white; padding-top: 10px;">Successfully edited experience!</span>'
            })
            this.show = false
            this.newExperience = {}
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
</script>

<style scoped>
  label {
    font-size: 15px;
    color: #6d6d6d;
  }
  .nice-font {
    font-family: 'Roboto', sans-serif;
    font-weight: 200;
  }
  .input-field {
    border: 0;
    border-radius: 5px;
    outline: none;
    font-weight: 300;
    box-shadow: none;
    margin-top: 1px;
    background-color: #e6e6e6;
  }
  .input-field:hover {
    background-color: #E3E3E3;
  }
  .input-field:focus {
    background-color: #E3E3E3;
  }
  .smaller-font {
    font-size: 13px;
  }
  /deep/ .modal-title {
    font-family: 'Roboto', sans-serif;
    font-weight: 200;
    padding-left: 1rem;
    font-size: 35px;
  }

  /deep/ .close {
    color: white;
  }

  /deep/ .modal-header {
    color: white;
    background-color: #c68967;
  }
  /deep/ .close {
    color: white;
  }

  /deep/ .btn-outline-primary {
    border: 1px solid #c68967 !important;
    color: grey;
  }

  /deep/ .btn-outline-primary:hover {
    border-color: #c68967 !important;
    background-color: #de9a73;
    color: white;
  }
  button {
    cursor: pointer;
  }
  /deep/ .modal {
    backdrop-filter: saturate(180%) blur(5px) !important;
  }

</style>
