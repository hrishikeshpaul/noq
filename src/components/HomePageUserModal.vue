<template>
  <div>
    <div>
      <b-modal ref="modal" hide-footer v-model="show" data-keyboard="false" size="lg"
               data-backdrop="static" :title="newUser.name">
<!--        <template v-slot:modal-title>-->
<!--          <div style="font-size: 40px;" class="nice-font px-3">-->
<!--            {{newUser.name}}-->
<!--          </div>-->
<!--          <p style="font-size: 17px; color: #7f8993; margin-top: -7px; padding-left: 5px;" class="mb-0 px-3 nice-font">{{newUser.email}}</p>-->
<!--        </template>-->
        <div style="max-height: 600px !important; overflow-y: auto; background-color: #f6f6f6;" class="p-3">
        <button href="#" style="float: right;" class="mt-3 pt-2 mr-2 btn btn-outline-secondary" @click="showWindow(newUser.social.github)"><i class="ti-github"></i></button>

        <button href="#" style="float: right;" class="mt-3 pt-2 mr-2 btn btn-outline-secondary" @click="showWindow(newUser.social.linkedin)"><i class="ti-linkedin"></i></button>

        <div class="text-center nice-font">
          <img :src="newUser.profilepicture ? user.profilepicture.toString() : require('../assets/blank_profile.png')" style="height: 150px; width: 150px; border-radius: 50%; margin-left: 100px; object-fit: cover; border: 4px solid rgba(204,198,198,0.69);"/>
          <p style="font-size: 20px; font-weight: 300;" class="pt-2 mb-0 pb-0">{{newUser.name}}</p>
          <p style="color: gray; font-size: 16px;" class="mb-0">{{newUser.company}}</p>
          <p style="color: gray">{{newUser.location}}</p>
          <hr />
        </div>
          <div class="px-3 nice-font">
            <div class="row">
              <div class="col-lg-1 col-md-1 col-sm-1" style="color: gray; font-size: 16px">
                <span><i class="ti-star"></i></span>
              </div>
              <div class="col-lg-11 col-md-11 col-sm-11 pl-0" style="font-size: 16px">
                <div style="font-size: 16px">
                  {{displaySkills(newUser.skills)}}
                </div>
              </div>
            </div>
          </div>
          <hr />
        <div class="px-3 nice-font">
          <div class="row">
            <div class="col-lg-1 col-md-1 col-sm-1" style="color: gray; font-size: 16px; font-weight: 300;">
              <span><i class="ti-briefcase"></i></span>
            </div>
            <div class="col-lg-11 col-md-11 col-sm-11 pl-0" style="font-size: 16px; font-weight: 300;">
              <div v-for="exp in newUser.experience">
                <div style="float: right; font-size: 14px; color: gray; margin-top: 5px;">{{getDate(exp.from)}} - {{getDate(exp.to)}}</div>
                <div style="font-size: 16px; font-weight: 200">{{exp.company}}</div>
                <div style="color: gray; font-size: 14px; margin-top: -3px; margin-bottom: 7px">{{exp.location}}</div>
                <div style="color: rgb(116,116,116); font-size: 16px; text-align: justify" class="pb-3">{{exp.description}}</div>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div class="px-3 nice-font">
          <div class="row">
            <div class="col-lg-1 col-md-1 col-sm-1 mt-1" style="color: gray; font-size: 16px">
              <span style="margin-top: 5px !important;"><i class="ti-book"></i></span>
            </div>
            <div class="col-lg-11 col-md-11 col-sm-11 pl-0" style="font-size: 16px">
              <div v-for="edu in newUser.education">
                <div style="float: right; font-size: 14px; color: gray; margin-top: 5px;">{{getDate(edu.from)}} - {{getDate(edu.to)}}</div>
                <div style="font-size: 16px; font-weight: 300">{{edu.school}}</div>
                <div style="color: gray; font-size: 14px; margin-top: -3px; margin-bottom: 0px">{{edu.location}}</div>
                <div style="color: rgb(120,120,120); font-size: 14px;">{{edu.degree}} - {{edu.fieldofstudy}}</div>
                <p></p>
              </div>
            </div>
          </div>
        </div>
        <hr />
          <div class="row text-center" v-if="showButtons">
            <div class="col-3"></div>
            <div class="col-3">
              <button class=" mr-5 btn-lg btn-danger ml-5" @click="$emit('reject', {id: newUser._id, job: newUser.job})" style="border: none;"><i class="ti-close"></i></button>
            </div>
            <div class="col-3">
              <button @click="$emit('accept', {id: newUser._id, job: newUser.job})" class=" mr-4 btn-lg btn-success" style="border: none;"><i class="ti-check"></i></button>
            </div>
            <div class="col-3"></div>
          </div>
      </div>
      </b-modal>
    </div>
  </div>
</template>

<script>
  import gravatar from 'gravatar'
  import axios from 'axios'
  import url from '../config/server_config'

  export default {
  name: 'UserInfoModal',
  components: {
  },
  props: {
    showModal: {
      type: Boolean,
      default: false,
      required: true
    },
    user: {
      type: Object
    },
    showButtons: {
      type: Boolean
    }
  },
  data () {
    return {
      show: false,
      newUser: {
        profilepicture: '',
        location: '',
        social: {
          linkedin: '',
          github: ''
        },
        skills: []
      },
      showAlert: false,
      alertText: ''
    }
  },
  watch: {
    showModal (newVal) {
      this.show = newVal
    },
    user (newVal) {
      this.newUser = newVal
      this.getData(newVal._id)
    }
  },
  methods: {
    showWindow (ref) {
      if (ref) {
        window.open(ref)
      }
    },
    displaySkills (skills) {
      if (skills.length > 0) {
        if (skills.length > 10) {
          return skills[0].name + ", " + skills[1].name + " & more"
        } else {
          return skills.map(s => s.name).join(', ')
        }
      } else {
        return ''
      }
    },
    gravatarImage (email) {
      return gravatar.url(email)
    },
    getDate (date) {
      if (date) {
        return this.$moment(date).format('Do MMM YY')
      } else {
        return 'Present'
      }
    },
    getData (user_id) {
      var headers = {
        // Authorization: 'Bearer ' + localStorage.getItem('jwtToken').substring(4, localStorage.getItem('jwtToken').length)
      }

      axios.get(`${url}/api/user/${user_id}`, {headers: headers})
        .then(response => {
          this.newUser = response.data
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
</script>

<style scoped>
  .nice-font {
     font-family: 'Roboto', sans-serif;
     font-weight: 300;
     /*font-family: 'Avenir', Helvetica, Arial, sans-serif !important;*/
   }

  ::-webkit-scrollbar {
    width: 5px;
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
  button {
    cursor: pointer;
  }
  .ti-briefcase {
    color: saddlebrown;
  }
  .ti-star {
    color: #e5b645;
  }
  .ti-book {
    color: darkgreen;
  }
  /deep/ .modal {
    backdrop-filter: saturate(180%) blur(5px) !important;
  }

  /deep/ .modal-body {
    padding: 0 !important;
  }

</style>
