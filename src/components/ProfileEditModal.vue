<template>
  <div>
    <div>
      <b-modal ref="modal" hide-footer v-model="show" data-keyboard="false"
               data-backdrop="static" :title="'Edit Profile'" size="lg">
<!--        <template v-slot:modal-title>-->
<!--          <div style="font-size: 40px;" class="nice-font px-3">-->
<!--            Edit Profile-->
<!--          </div>-->
<!--          <p style="font-size: 17px; color: #7f8993; margin-top: -7px; padding-left: 5px;" class="mb-0 px-3 nice-font">Make changes to some basic details of your profile!</p>-->
<!--        </template>-->
        <div class="d-block text-center px-3 nice-font mb-2" style="max-height: 600px; overflow-y: auto;">
          <b-alert variant="danger" v-model="showAlert"> {{alertText}}</b-alert>
          <b-form class="text-left">
            <label class="mb-0 smaller-font">Name*</label>
            <b-form-group>
              <b-form-input id="title" v-model.trim="newUser.name" class="input-field"></b-form-input>
            </b-form-group>
            <label class="mb-0 smaller-font">Company*</label>
            <b-form-group>
              <UniversitySelect v-model.trim="newUser.company" @addCompany="addCompany" v-if="newUser.role === 'student'" :rVal="newUser.company"/>
              <b-form-input id="position" v-model.trim="newUser.company" class="input-field" v-if="newUser.role === 'employer'"></b-form-input>
            </b-form-group>
            <label class="mb-0 smaller-font">Website</label>
            <b-form-group>
              <b-form-input id="company" v-model.trim="newUser.website" class="input-field"></b-form-input>
            </b-form-group>
            <label class="mb-0 smaller-font">LinkedIn*</label>
            <b-form-group>
              <b-form-input id="company" v-model.trim="newUser.social.linkedin" class="input-field"></b-form-input>
            </b-form-group>

            <label class="mb-0 smaller-font" v-if="newUser.role == 'student'">GitHub</label>
            <b-form-group v-if="newUser.role == 'student'">
              <b-form-input id="company" v-model.trim="newUser.social.github" class="input-field"></b-form-input>
            </b-form-group>

            <label class="mb-0 smaller-font">Location</label>
            <b-form-group>
              <b-form-input id="location" v-model.trim="newUser.location" class="input-field"></b-form-input>
            </b-form-group>
            <label class="mb-0 smaller-font">Bio</label>
            <b-form-group>
              <b-form-textarea id="Bio" v-model.trim="newUser.bio" rows="4" class="input-field"></b-form-textarea>
            </b-form-group>
          </b-form>
          <button class="mt-3 btn btn-outline-primary w-100" @click="editUser">Edit</button>
        </div>
      </b-modal>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import url from '../config/server_config'
import UniversitySelect from './UniversitySelect'


export default {
  name: 'ProfileInputModal',
  components: {
    UniversitySelect
  },
  props: {
    showModal: {
      type: Boolean,
      default: false,
      required: true
    },
    user: {
      type: Object,
      default () {
        return {
          social: {
            linkedin: '',
            github: ''
          }
        }
      }
    }
  },
  data () {
    return {
      show: false,
      alertText: '',
      showAlert: false,
      newUser: {
        social: {
          linkedin: '',
          github: ''
        }
      }
    }
  },
  watch: {
    showModal (newVal) {
      this.show = newVal
    },
    user (newVal) {
      this.newUser = newVal
    }
  },
  methods: {
    addCompany (com) {
      this.newUser.company = com.name
    },
    editUser () {
      var headers = {
        Authorization: 'Bearer ' + localStorage.getItem('jwtToken').substring(4, localStorage.getItem('jwtToken').length)
      }

      if (this.newUser.name.length === 0) {
        this.alertText = 'You cannot leave the name empty'
        this.showAlert = true
      } else if (this.newUser.company.length === 0) {
        this.alertText = this.newUser.role === 'student' ? 'You cannot leave the university name empty' : 'You cannot leave the company name empty'
        this.showAlert = true
      } else if (this.newUser.website.length === 0) {
        this.alertText = 'You cannot leave the website empty'
        this.showAlert = true
      } else {
        var id = localStorage.getItem('user_id')


        axios.patch(`${url}/api/user/${id}`, this.newUser, {headers: headers})
          .then(response => {
            if (response.status === 204) {
              this.show = false
              this.showAlert = false
              this.$emit('hideModal')
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
