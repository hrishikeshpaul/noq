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
        <div class="d-block text-center px-3 nice-font mb-2" style="max-height: 1000px; overflow-y: auto;">
          <b-alert variant="danger" v-model="showAlert"> {{alertText}}</b-alert>
          <div class="text-center nice-font mb-2">
            <div class="wrapper">
              <img alt="" :src="newUser.profilepicture ? newUser.profilepicture : require('../assets/blank_profile.png')" style="height: 180px; width: 180px; border-radius: 50%; object-fit: cover; border: 4px solid rgba(233, 228, 228, 0.58);"/>
              <div class="overlay">
                <div class="text">
                  <label class="btn-upload">
                    <input type="file" name="fileupload" @change="onFileChanged">
                    <button class="btn"><i class="ti-pencil"></i></button>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <b-form class="text-left">
            <label class="mb-0 smaller-font">Name*</label>
            <b-form-group>
              <b-form-input id="title" v-model.trim="newUser.name" class="input-field"></b-form-input>
            </b-form-group>
            <label class="mb-0 smaller-font">{{newUser.role === 'student' ? 'University*' : 'Company*'}}</label>
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
              <LocationSelect v-model.trim="newUser.location" @addLocation="addLocation" :rVal="newUser.location"/>
<!--              <b-form-input id="location" v-model.trim="newUser.location" class="input-field"></b-form-input>-->
            </b-form-group>
            <label class="mb-0 smaller-font">Bio</label>
            <b-form-group>
              <b-form-textarea id="Bio" v-model.trim="newUser.bio" rows="4" class="input-field"></b-form-textarea>
            </b-form-group>
          </b-form>
         <div class="text-right">
           <button class="mt-3 btn btn-outline-secondary w-10" @click="$emit('hideModal')">Close</button>
           <button class="mt-3 btn btn-outline-primary w-25" @click="editUser">Save</button>
         </div>
        </div>
      </b-modal>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import url from '../config/server_config'
  import UniversitySelect from './UniversitySelect'
  import LocationSelect from './LocationSelect'

  export default {
  name: 'ProfileInputModal',
  components: {
    UniversitySelect,
    LocationSelect
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
      selectedImage: null,
      show: false,
      alertText: '',
      showAlert: false,
      newUser: {
        profilepicture: null,
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

    onFileChanged (event) {
      var headers = {
        // Authorization: 'Bearer ' + localStorage.getItem('jwtToken').substring(4, localStorage.getItem('jwtToken').length),
      }

      var file = event.target.files[0]
      let reader = new FileReader()
      reader.readAsDataURL(file)

      reader.onload = e => {
        this.newUser.profilepicture = e.target.result
        axios.post(`${url}/api/profile/picture`, {image: e.target.result.replace(/^data:image\/[a-z]+;base64,/, ''), user_id: this.newUser._id}, {headers: headers})
          .then(response => {
            if (response.status === 204) {
              this.$swal({
                position: 'bottom-right',
                backdrop: false,
                showConfirmButton: false,
                timer: 2500,
                width: '300px',
                imageHeight: 20,
                imageWidth: 20,
                background: 'rgba(92,184,92,0.93)',
                title: '<span style="  font-family: \'Roboto\', sans-serif; font-size: 16px; font-weight: 200; color: white; padding-top: 10px;">Successfully updated profile picture!</span>'
              })
            }
          })
          .catch(e => {
            if (e.response.status === 401) {
              this.$router.push({
                name: 'Login'
              })
            }
          })
      };
    },
    addCompany (com) {
      this.newUser.company = com.name
    },
    addLocation (loc) {
      this.newUser.location = loc
    },
    editUser () {
      var headers = {
        // Authorization: 'Bearer ' + localStorage.getItem('jwtToken').substring(4, localStorage.getItem('jwtToken').length)
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
              this.$swal({
                position: 'bottom-right',
                backdrop: false,
                showConfirmButton: false,
                timer: 2500,
                width: '300px',
                imageHeight: 20,
                imageWidth: 20,
                background: 'rgba(92,184,92,0.93)',
                title: '<span style="  font-family: \'Roboto\', sans-serif; font-size: 16px; font-weight: 200; color: white; padding-top: 10px;">Successful!</span>'
              })
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
    font-family: 'Roboto', sans-serif;
    font-weight: 300;
    /*font-family: 'Avenir', Helvetica, Arial, sans-serif !important;*/
  }
  .input-field {
    border: 0;
    border-radius: 5px;
    outline: none;
    box-shadow: none;
    font-weight: 300;
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
  /deep/ .modal-header {
    color: white;
    background-color: #DA9F74;
  }
  /deep/ .close {
    color: white;
  }

  /deep/ .btn-outline-primary {
    border: 1px solid #c68967 !important;
    color: grey !important;
  }

  /deep/ .btn-outline-primary:hover {
    border-color: 1px solid #c68967 !important;
    background-color: #de9a73 !important;
    color: white !important;
  }

  button {
    cursor: pointer;
  }

  .wrapper {
    position: relative;
    border-radius: 10px;}

  .overlay {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    height: 80%;
    width: 80%;
    opacity: 1;
    border-radius: 10px;
    transition: .5s ease;
    /*background-color: #262827;*/
  }

  .wrapper:hover .overlay {
    opacity: 0.98;
  }

  .text {
    color: white;
    font-size: 20px;
    position: relative;
    top: 100%;
    left: 75%;
    -webkit-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    text-align: center;
  }

  .btn-upload {
    cursor: pointer !important;
    position: relative;
    overflow: hidden;
    display: inline-block;
  }
  .btn-upload input[type=file] {
    cursor: pointer !important;
    position: absolute;
    opacity: 0;
    z-index: 0;
    max-width: 100%;
    height: 100%;
    display: block;
  }
  .btn-upload .btn{
    cursor: pointer !important;
    padding: 8px 12px;
    background: white;
    border: 1px solid #c68967;
    color: black;
    /*border: /z0;*/
  }
  .btn-upload:hover .btn{
    cursor: pointer !important;
    padding: 8px 12px;
    background: #f5f8f5;
    color: black;
  }

  /deep/ .modal-body {
    background-color: rgba(246, 171, 127, 0.05);
  }

  /deep/ .modal {
    backdrop-filter: saturate(180%) blur(5px) !important;
  }

</style>
