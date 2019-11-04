<template>
  <div>
    <span style="font-size: 80px;" class="mx-5 px-5 mb-0 mt-2">Profile Settings</span>
    <p class="px-5" style="color: grey; margin-top: -18px; margin-left: 55px; margin-bottom: 50px !important;">{{'Change various profile settings'}}</p>
    <div class="px-5 mx-5">
      <div class="card px-4 py-3 shadow-sm">
        <div class="d-block text-center card-body">
          <b-alert variant="danger" v-if="showAlert" :show="10">{{alertText}}</b-alert>
          <b-alert variant="success" v-if="showAlert2" :show="10">{{alertText2}}</b-alert>
          <b-form class="text-left">
            <div class="card-title" style="font-size: 35px; margin-top: -10px;">Reset Password</div>
            <hr />
            <label>Old Password</label>
            <b-form-group>
              <b-form-input id="title" v-model.trim="oldPassword" type="password"></b-form-input>
            </b-form-group>
            <label>New Password</label>
            <b-form-group>
              <b-form-input id="position" v-model.trim="newPassword" type="password"></b-form-input>
            </b-form-group>
            <label>Re-Enter Password</label>
            <b-form-group>
              <b-form-input id="position" v-model.trim="newPassword1" type="password"></b-form-input>
            </b-form-group>
          </b-form>
          <button class="mt-2 btn btn-outline-warning w-100" @click="changePassword">Change Password</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ProfileSettings',
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
      show: false,
      oldPassword: '',
      newPassword: '',
      newPassword1: '',
      alertText: '',
      showAlert: false,
      alertText2: '',
      showAlert2: false
    }
  },
  watch: {
    showModal (newVal) {
      this.show = newVal
    }
  },
  methods: {
    changePassword () {
      var headers = {
        Authorization: 'Bearer ' + localStorage.getItem('jwtToken').substring(4, localStorage.getItem('jwtToken').length)
      }

      var id = localStorage.getItem('user_id')

      if (this.newPassword.length > 0 && this.newPassword === this.newPassword1) {
        axios.patch(`https://ancient-caverns-78426.herokuapp.com/api/user/changepassword/${id}`, {
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

</style>
