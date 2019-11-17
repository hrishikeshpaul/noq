
<template>

  <div>
    <div v-if="error">
        <b-alert show variant="danger">{{error}}</b-alert>
    </div>
    <div class="text-center mt-4">
      <a class="btn btn-md linkedin-btn light" @click="$emit('linkedin')" style="color: white;">Linked <i class="ti-linkedin"></i></a>
    </div>
    <div class="center-separator my-3 mt-4">
      or
    </div>
    <b-form @submit="onSubmit" class="p3">
      <label class="smaller-font">Email</label>
      <b-form-group id="fieldsetHorizontal">
        <b-form-input id="username" v-model.trim="register.username" class="no-border"></b-form-input>
      </b-form-group>
      <label class="smaller-font">Password</label><span></span>
      <b-form-group id="fieldsetHorizontal" class="mb-0"
                    >
        <b-form-input type="password" id="password" :state="state" v-model.trim="register.password" class="no-border"></b-form-input>
      </b-form-group>
      <div style="font-size: 11px; padding-top: 0; margin-bottom: 10px !important; margin-top: 2px;">Must be at least 8 characters, have an uppercase letter and a special character</div>
      <label class="smaller-font">Re-Enter Password</label>
      <b-form-group id="fieldsetHorizontal"
                    >
        <b-form-input type="password" id="password2" :state="state" v-model.trim="register.password2" class="no-border"></b-form-input>
      </b-form-group>

      <label class="smaller-font">Select Role</label>
      <b-form-group
        id="fieldsetHorizontal">
        <b-form-select v-model="register.role" :options="options" size="md" id="role" class="w-100"></b-form-select>
      </b-form-group>

      <label class="smaller-font" v-if="register.role == 'student'">Gender</label>
      <b-form-group
        v-if="register.role === 'student'"
        id="fieldsetHorizontal">
        <b-form-select v-model="register.gender" :options="genderOptions" size="md" id="role" class="w-100"></b-form-select>
      </b-form-group>
      <button type="submit" class="mt-2 btn-outline-primary" style="width: 100%; height: 35px; border-radius: 10px">Register</button>
      <br />
    </b-form>
  </div>
</template>

<script>
import axios from 'axios'
import url from '../config/server_config'
function validate (pass) {
  var counter = 0
  if (pass.length >= 8) {
    counter++
  }
  if (/[A-Z]/.test(pass)) {
    counter++
  }
  if (/[!@#$&*]/.test(pass)) {
    counter++
  }
  return counter == 3
}
export default {
  name: 'Register',
  data () {
    return {
      register: {
        role: 'student',
        gender: 'I do not wish to specify'
      },
      error: '',
      state: null,
      genderOptions: [
        {value: 'I do not wish to specify', text: 'I do not wish to specify'},
        {value: 'Male', text: 'Male'},
        {value: 'Female', text: 'Female'},
      ],
      options: [
        { value: 'student', text: 'Student' },
        { value: 'employer', text: 'Employer' }
      ]
    }
  },
  watch: {
    error (val) {
      if (val) {
        setTimeout(() => this.error = '', 5000)
      }
    }
  },
  methods: {
    onSubmit (evt) {
      this.error = ''
      evt.preventDefault()
      if (this.register.password === this.register.password2 & validate(this.register.password) === true) {
        this.state = true
        axios.post(`${url}/api/auth/register/`, this.register)
          .then(response => {
            this.$swal({
              type: 'success',
              showConfirmButton: true,
              timer: 4500,
              width: '400px',
              imageHeight: 20,
              imageWidth: 20,
              html: '<span style="font-family: \'Roboto\', sans-serif; font-size: 16px; font-weight: 200;padding-top: 10px;">' + response.data.msg + '</span>',
              title: '<h3 style="font-family: \'Roboto\', sans-serif; font-size: 16px; font-weight: 300">Successfully Registered!</h3>'
            })
            this.$emit('registered', true)
          })
          .catch(e => {
            this.error = e.response.data.msg
            this.state = false
          })
      } else if (this.register.password != this.register.password2) {
        this.error = 'Passwords do not match'
        this.state = false
      } else if (validate(this.register.password) === false) {
        this.error = 'Password requirements not met'
        this.state = false
      }
    }

  }
}

</script>

<style scoped>
  .center-separator {
    display: flex;
    line-height: 1px;
    color: #858585;
  }

  .center-separator::before, .center-separator::after {
    content: '';
    display: inline-block;
    flex-grow: 1;
    margin-top: 0.05em;
    background: #c7c7c7;
    height: 1px;
    margin-right: 10px;
    margin-left: 10px;
  }
  .linkedin-btn {
    background-color: #597ca0;
    color: white;
    cursor: pointer;
  }

  .linkedin-btn:hover{
    background-color: #6c9ccb !important;
  }

  .smaller-font {
    font-size: 13px;
  }

</style>
