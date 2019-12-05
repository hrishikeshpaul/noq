
<template>

  <div>
    <div v-if="error">
        <b-alert show variant="danger">{{error}}</b-alert>
    </div>
<!--    <div class="text-center mt-4">-->
<!--      <a class="btn btn-md linkedin-btn light" @click="$emit('linkedin')" style="color: white;">Linked <i class="ti-linkedin"></i></a>-->
<!--    </div>-->
<!--    <div class="center-separator my-3 mt-4">-->
<!--      or-->
<!--    </div>-->
    <b-form @submit="onSubmit" class="p3">
      <label class="smaller-font" style="padding-top: 0;margin-top: 0">Email</label>
        <b-form-input id="username" v-model.trim="register.username" class="no-border input-field"></b-form-input>

      <label class="smaller-font" >Password</label><span></span>
        <b-form-input @click="showPassRequirement" type="password" id="password" :state="state" v-model.trim="register.password" class="no-border input-field"></b-form-input>
      <div v-if="on_typing" style="font-size: 11px; padding-top: 0; margin-bottom: 0px !important; margin-top: 2px;">Must be at least 8 characters, have an uppercase letter and a special character</div>

      <label class="smaller-font">Re-Enter Password</label>
        <b-form-input type="password" id="password2" :state="state" v-model.trim="register.password2" class="no-border input-field"></b-form-input>

      <label class="smaller-font">Select Role</label>
        <b-form-select v-model="register.role" :options="options" size="md" id="role" class="w-100 input-field" style="font-weight: 300; background-color: #e6e6e6; border: none;"></b-form-select>

<!--      <label class="smaller-font" v-if="register.role == 'student'">Gender</label>-->
<!--      <b-form-group-->
<!--        v-if="register.role === 'student'"-->
<!--        id="fieldsetHorizontal">-->
<!--        <b-form-select v-model="register.gender" :options="genderOptions" size="md" id="role" class="w-100"></b-form-select>-->
<!--      </b-form-group>-->

      <label class="smaller-font">Security Question</label>
      <b-form-select v-model="register.security" :options="securityOptions" size="md" id="security" class="w-100 input-field" style="font-weight: 300; background-color: #e6e6e6; border: none;"></b-form-select>
      <label class="smaller-font">Security Question Answer</label>
      <b-form-input id="security_answer" placeholder="Please input your answer here"
                    v-model.trim="register.security_answer" class="no-border input-field" style="margin-bottom: 10px"></b-form-input>

      <button type="submit" class="mt-2 btn-outline-primary" style="width: 100%; height: 35px; border-radius: 5px">Register</button>
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
        gender: 'I do not wish to specify',
        security:'What city were you born in?',
        security_answer:null
      },
      error: '',
      state: null,
       securityOptions:[
        {value: 'What city were you born in?', text: 'What city were you born in?'},
        {value: 'What is your mother’s maiden name??', text: 'What is your mother’s maiden name?'},
        {value: 'What is your favorite food?', text: 'What is your favorite food?'},
        {value: 'Where is your favorite place to vacation?', text: 'Where is your favorite place to vacation?'},
        {value: 'Where did you go to high school?', text: 'Where did you go to high school?'},
      ],
      genderOptions: [
        {value: 'I do not wish to specify', text: 'I do not wish to specify'},
        {value: 'Male', text: 'Male'},
        {value: 'Female', text: 'Female'},
      ],
      options: [
        { value: 'student', text: 'Student' },
        { value: 'employer', text: 'Employer' }
      ],
      on_typing:false,
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
    showPassRequirement(){
      this.on_typing=true
    },
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
    padding-top: 10px;
    margin-bottom: 0px;
    font-size: 13px;
  }
  .input-field {
    border: 0;
    border-radius: 5px;
    outline: none;
    font-weight: 300;
    box-shadow: none;
    margin-top: 1px;
    color: black;
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

  button {
    cursor: pointer;
  }

</style>
