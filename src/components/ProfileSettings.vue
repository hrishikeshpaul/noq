<template>
  <div>

    <nav class="navbar navbar-light bg-light shadow-nav">
      <a class="navbar-brand pl-3" href="#" style="color: #17252A; font-weight: 300; font-size: 25px;">Settings</a>
      <div class="text-center w-50">
        <div class="row px-3 py-1">
          <div class="col-11">
          </div>
          <div class="col-1">
          </div>
        </div>
      </div>
    </nav>

    <div class="mx-5 mt-5">
      <div class="row">
        <div class="col-6">
          <div class="card px-4 py-2 shadow-sm">
            <div class=" text-center card-body w-100">
              <b-alert variant="danger" v-if="showAlert" :show="10">{{alertText}}</b-alert>
              <b-alert variant="success" v-if="showAlert2" :show="10">{{alertText2}}</b-alert>
              <b-form class="text-left">
                <div class="card-title" style="font-size: 20px; margin-top: -10px;">Reset Password</div>
                <hr />
                <label class="smaller-font">Old Password</label>
                <b-form-group>
                  <b-form-input id="title" v-model.trim="oldPassword" type="password" class="input-field"></b-form-input>
                </b-form-group>
                <label class="smaller-font">New Password</label>
                <b-form-group>
                  <b-form-input id="position" v-model.trim="newPassword" type="password" class="input-field"></b-form-input>
                </b-form-group>
                <label class="smaller-font">Re-Enter Password</label>
                <b-form-group>
                  <b-form-input id="position" v-model.trim="newPassword1" type="password" class="input-field"></b-form-input>
                </b-form-group>
              </b-form>
              <button class="mt-2 btn btn-primary w-25" @click="changePassword">Change</button>
            </div>
          </div>
        </div>
        <div class="col-6">
          <div class="card px-4 py-2 shadow-sm">
            <div class="text-center card-body w-100">
              <b-form class="text-left">
                <div class="card-title" style="font-size: 20px; margin-top: -10px;">Feedback</div>
                <hr/>
                <b-form-group>
                  <label class="smaller-font">Subject</label>
                  <b-form-input id="title" v-model.trim="feedback.subject" type="text" class="input-field"></b-form-input>
                </b-form-group>
                <b-form-group>
                  <label class="smaller-font">Message</label>
                  <b-form-textarea id="title" v-model.trim="feedback.message" type="text" class="input-field form-control-textarea" rows="4"></b-form-textarea>
                </b-form-group>
              </b-form>
              <button class="mt-2 btn btn-primary w-25" @click="sendFeedback">Send Feedback</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import axios from 'axios'
import url from '../config/server_config'

export default {
  name: 'ProfileSettings',
  props: {
    user: {
      type: Object
    }
  },
  data () {
    return {
      show: false,
      oldPassword: '',
      newPassword: '',
      newPassword1: '',
      alertText: '',
      showAlert: false,
      alertText2: '',
      showAlert2: false,
      role: '',
      email: '',
      feedback: {
        subject: '',
        message: '',
        email: ''
      }
    }
  },
  watch: {
    showModal (newVal) {
      this.show = newVal
    }
  },
  created () {
    this.role = localStorage.role
    this.email = localStorage.email
  },
  methods: {
    sendFeedback () {
      var headers = {
        // Authorization: 'Bearer ' + localStorage.getItem('jwtToken').substring(4, localStorage.getItem('jwtToken').length)
      }
      this.feedback.email = this.email

      axios.post(`${url}/api/settings/feedback`, this.feedback, {headers: headers})
        .then(response => {
          this.feedback.subject = ''
          this.feedback.message = ''
          this.$swal({
            position: 'bottom-right',
            backdrop: false,
            showConfirmButton: false,
            timer: 2500,
            width: '300px',
            imageHeight: 20,
            imageWidth: 20,
            background: 'rgba(92,184,92,0.93)',
            title: '<span style="  font-family: \'Roboto\', sans-serif; font-size: 16px; font-weight: 200; color: white; padding-top: 10px;">Successfully sent feedback!</span>'
          })
        })
        .catch(e => {
          console.log(e)
        })
    },
    changePassword () {
      var headers = {
        // Authorization: 'Bearer ' + localStorage.getItem('jwtToken').substring(4, localStorage.getItem('jwtToken').length)
      }

      var id = localStorage.getItem('user_id')

      if (this.newPassword.length > 0 && this.newPassword === this.newPassword1) {
        axios.patch(`${url}/api/user/changepassword/${id}`, {
          oldPassword: this.oldPassword,
          newPassword: this.newPassword,
          newPassword1: this.newPassword1
        }, {headers: headers})
          .then(response => {
            if (response.status === 200) {
              this.show = false
              this.$emit('hideModal')
              this.oldPassword = ''
              this.newPassword = ''
              this.newPassword1 = ''
              this.showAlert2 = true
              this.alertText2 = 'Password Reset Successful'
            }
          })
          .catch(e => {
            if (e.response.status === 400) {
              this.showAlert = true
              this.alertText = 'Error'
            }
          })
      } else {
        this.showAlert = true
        this.alertText = 'Passwords dont\'t match'
      }
    }
  }
}
</script>

<style scoped>
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
  /deep/ .btn-outline-primary {
    border: 1px solid #c68967 !important;
    color: grey !important;
    cursor: pointer !important;
  }

  /deep/ .btn-outline-primary:hover {
    border-color: #de9a73 !important;
    background-color: #de9a73 !important;
    color: white !important;
  }

  /deep/ .btn-primary {
    background-color: #de9a73 !important;
    color: white !important;
    cursor: pointer !important;
    border-color: #de9a73 !important;
  }

  /deep/ .btn-primary:active {
    outline: none !important;
    background-color: #b07a5b !important;
    color: white !important;
    border-color: #de9a73 !important;
  }

  /deep/ .btn-primary:hover {
    background-color: #cf906b !important;
    color: white !important;
    border-color: #cf906b !important;
  }

  /deep/ .bg-light {
    background-color: rgba(202, 202, 202, 0.98) !important;
  }

   .form-control-textarea {
    height: 120px !important;
  }

</style>
