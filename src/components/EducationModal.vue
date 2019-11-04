<template>
  <div>
    <div>
      <b-modal ref="modal" hide-footer v-model="show" data-keyboard="false" size="lg"
               data-backdrop="static" :title="'Education'">
<!--        <template v-slot:modal-title>-->
<!--          <div style="font-size: 40px;" class="nice-font px-3">-->
<!--            Education-->
<!--          </div>-->
<!--          <p style="font-size: 17px; color: #575e65; margin-top: -7px; padding-left: 2px;" class="mb-0 nice-font px-3">Give some details to describe your education!</p>-->
<!--        </template>-->
        <div class="d-block text-center px-3 nice-font pb-2">
          <b-alert variant="danger" v-if="showAlert" :show="10">{{alertText}}</b-alert>
          <b-form class="text-left">
            <label class="mb-0 smaller-font">Name of School*</label>
            <b-form-group>
              <b-form-input id="title" v-model.trim="newEducation.school" class="input-field"></b-form-input>
            </b-form-group>
            <label class="mb-0 smaller-font">Degree*</label>
            <b-form-group>
              <b-form-input id="position" v-model.trim="newEducation.degree" class="input-field"></b-form-input>
            </b-form-group>
            <label class="mb-0 smaller-font">Field Of Study*</label>
            <b-form-group>
              <b-form-input id="position" v-model.trim="newEducation.fieldofstudy" class="input-field"></b-form-input>
            </b-form-group>
            <div class="row">
              <div class="col-6">
                <label class="mb-0 smaller-font">From*</label>
                <b-form-group>
                  <b-form-input id="from" v-model="newEducation.from" type="date" required class="input-field"></b-form-input>
                </b-form-group>
              </div>
              <div class="col-6">
                <label class="mb-0 smaller-font">To</label>
                <span style="background-color: #b4b4b4; color: white; border-radius: 50%; margin-left: 5px;" class="px-2 info-hover" data-toggle="tooltip" data-placement="top" title="If you are currently enrolled, leave this blank">i</span>
                <b-form-group>
                  <b-form-input id="to" v-model="newEducation.to" type="date" class="input-field"></b-form-input>
                </b-form-group>
              </div>
            </div>
          </b-form>
          <button class="mt-2 btn btn-outline-warning w-100" v-if="buttonText === 'Edit Education'" @click="editEducation ">{{buttonText}}</button>
          <button class="mt-2 btn-outline-warning w-100 py-1" type="submit" v-else @click="addEducation ">{{buttonText}}</button>
        </div>
      </b-modal>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import url from '../config/server_config'

export default {
  name: 'EducationModal',
  components: {
  },
  props: {
    showModal: {
      type: Boolean,
      default: false,
      required: true
    },
    education: {
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
      newEducation: {},
      showAlert: false,
      alertText: ''
    }
  },
  watch: {
    showModal (newVal) {
      this.show = newVal
    },
    education (newVal) {
      this.newEducation = newVal
      this.newEducation.from = this.$moment(this.newEducation.from).format('YYYY-MM-DD')
      this.newEducation.to = this.$moment(this.newEducation.to).format('YYYY-MM-DD')
    }
  },
  methods: {
    addEducation () {
      var headers = {
        Authorization: 'Bearer ' + localStorage.getItem('jwtToken').substring(4, localStorage.getItem('jwtToken').length)
      }

      if (this.newEducation.school.length === 0) {
        this.showAlert = true
        this.alertText = 'Name of School is required'
      } else if (this.newEducation.degree.length === 0) {
        this.showAlert = true
        this.alertText = 'Degree is required'
      } else if (this.newEducation.to == 'Invalid date') {
        this.newEducation.to = null
      }else if (this.newEducation.from == 'Invalid date') {
        this.showAlert = true
        this.alertText = 'From date is required'
      } else if (this.newEducation.fieldofstudy === 0) {
        this.showAlert = true
        this.alertText = 'Field of Study is required'
      } else if (this.$moment(this.newEducation.from).diff(this.$moment(this.newEducation.to)) < 0) {
        this.showAlert = true
        this.alertText = 'To Date can\'t be after From date'
      } else {
        axios.post(`${url}/api/profile/education`, {data: [this.newEducation], user: {id: this.user._id}}, {headers: headers})
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
              title: '<span style="  font-family: \'Raleway\', sans-serif; font-size: 16px; font-weight: 200; color: white; padding-top: 10px;">Successfully added education!</span>'
            })
            this.show = false
            this.newEducation = {}
            this.$emit('hideModal')
          })
          .catch(e => {
            if (e.response.status === 400) {
              this.showAlert = true
              this.alertText = 'Error while added education'
            }
          })
      }
    },
    editEducation () {
      var headers = {
        Authorization: 'Bearer ' + localStorage.getItem('jwtToken').substring(4, localStorage.getItem('jwtToken').length)
      }

      var id = this.education._id

      axios.patch(`${url}/api/profile/education/${id}`, this.newEducation, {headers: headers})
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
              title: '<span style="  font-family: \'Raleway\', sans-serif; font-size: 16px; font-weight: 200; color: white; padding-top: 10px;">Successfully edited education!</span>'
            })
            this.show = false
            this.newEducation = {}
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
button {
  border-radius: 10px;
}

label {
  font-size: 15px;
  color: #6d6d6d;
}
  .info-hover {
    cursor: pointer;
  }
  .info-hover:hover {
    background-color: #6c757d;
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
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}
/deep/ .modal-title {
  font-family: 'Raleway', sans-serif;
  font-weight: 200;
  padding-left: 1rem;
  font-size: 35px;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
.modal-fade-enter,
.modal-fade-leave-active {
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity .5s ease
}
</style>
