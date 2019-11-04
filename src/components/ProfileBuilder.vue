<template>
  <div>
    <NavBar @logout="logout"/>
    <div class="mt-5 container">
      <div class="container main-container">
        <b-card style="max-height: 85vh; overflow-y: auto; min-height: 40vh">
          <form-wizard
            v-if="role"
            @on-complete="onComplete"
            step-size="sm" color="orange"
            @on-change="handleTabChanged"
            @on-loading="setLoading"
            @on-validate="handleValidation"
            @on-error="handleErrorMessage"
          >
            <h2 slot="title">Hi, let us get you started with your profile!</h2>
            <div class="alert alert-danger mb-2 text-center" role="alert"  v-if="errorMsg">
              {{errorMsg}}
            </div>

            <tab-content title="Personal details"
                         icon="ti-user"
                         class="mt-2"
                         :before-change="validateAsync"
            >
              <b-form>
                <label class="smaller-font">Full Name *</label>
                <b-form-group :class="{'error-label': invalidName}">
                  <b-form-input id="name_input" :class="{'error-border': invalidName, 'input-field': 'true'}" v-model.trim="user.name"></b-form-input>
                </b-form-group>

                <label class="smaller-font">{{role === 'student' ? 'University *' : 'Company *'}}</label>
                <b-form-group
                              :class="{'error-label': invalidOrganization}"
                >
                  <UniversitySelect  :class="{'error-border': invalidOrganization}" v-model.trim="user.company" @addCompany="addCompany" v-if="role === 'student'"/>
                  <b-form-input id="name"  :class="{'error-border': invalidOrganization}" v-model.trim="user.company" v-if="role==='employer'"></b-form-input>
                </b-form-group>

                <label class="smaller-font">Website</label>
                <b-form-group
                >
                  <b-form-input id="website" v-model.trim="user.website" class="input-field"></b-form-input>
                </b-form-group>
                <label class="smaller-font">LinkedIn *</label>
                <b-form-group
                              :class="{'error-label': invalidLinkedIn}"
                 >
                   <b-form-input id="linkedin" :class="{'error-border': invalidLinkedIn, 'input-field': 'true'}" v-model.trim="user.social.linkedin"></b-form-input>
                </b-form-group>

                <label class="smaller-font">GitHub</label>
                <b-form-group
                              v-if="role === 'student'"
                >
                  <b-form-input id="github" v-model.trim="user.social.github" class="input-field"></b-form-input>
                </b-form-group>

                <label class="smaller-font">Bio</label>
                <b-form-group
                >
                  <b-form-textarea id="bio" v-model.trim="user.bio" rows="3" class="input-field"></b-form-textarea>
                </b-form-group>
              </b-form>
            </tab-content>
            <tab-content :title="'Education'"
                         v-if="role === 'student'"
                         :icon="role === 'student' ? 'ti-book' : 'ti-bag'"
                         :before-change="validateAsync">
              <div v-for="(education,index) in educations" v-if="role === 'student'">
                <div class="row" v-if="educations.length > 1">
                  <div class="col-11">
                    <hr />
                  </div>
                  <div class="col-1">
                    <button class="btn-outline-danger btn-sm" @click.prevent="deleteItem(index, 'education')">X</button>
                  </div>
                </div>
                <b-form v-if="role === 'student'">

                  <label class="smaller-font">Name of School</label>
                  <b-form-group>
                    <b-form-input id="school" v-model.trim="education.school" class="input-field"></b-form-input>
                  </b-form-group>

                  <label class="smaller-font">Degree</label>
                  <b-form-group>
                    <b-form-input id="degree" v-model.trim="education.degree" class="input-field"></b-form-input>
                  </b-form-group>

                  <label class="smaller-font">Field of Study</label>
                  <b-form-group>
                    <b-form-input id="fieldofstudy" v-model.trim="education.fieldofstudy" class="input-field"></b-form-input>
                  </b-form-group>
                  <div class="row">
                    <div class="col-6">

                      <label class="smaller-font">From</label>
                      <b-form-group>
                        <b-form-input id="from" v-model.trim="education.from" type="date" class="input-field"></b-form-input>
                      </b-form-group>
                    </div>
                    <div class="col-6">
                      <label class="smaller-font">To</label>
                      <b-form-group>
                        <b-form-input id="to" v-model.trim="education.to" type="date" class="input-field"></b-form-input>
                      </b-form-group>
                    </div>
                  </div>
                </b-form>
              </div>
              <button
                v-if="role === 'student'"
                style="width: 100%; border-radius: 10px;"
                class="btn-outline-warning mb-2 mt-1 "
                @click.prevent="addItem('education')">
                Add</button>
            </tab-content>
            <!--           EXPERIENCE TAB-->
            <tab-content
              v-if="role === 'student'"
              title="Experience"
              :before-change="validateAsync"
              icon="ti-bag">
              <div v-for="(experience,index) in experiences">
                <div class="row" v-if="experiences.length > 1">
                  <div class="col-11">
                    <hr />
                  </div>
                  <div class="col-1">
                    <button class="btn-outline-danger btn-sm" @click.prevent="deleteItem(index, 'experience')">X</button>
                  </div>
                </div>
                <b-form>
                  <label class="smaller-font">Name of Organisation</label>
                  <b-form-group>
                    <b-form-input id="company" v-model.trim="experience.company" class="input-field"></b-form-input>
                  </b-form-group>

                  <label class="smaller-font">Title</label>
                  <b-form-group>
                    <b-form-input id="title" v-model.trim="experience.title" class="input-field"></b-form-input>
                  </b-form-group>

                  <label class="smaller-font">Location</label>
                  <b-form-group>
                    <b-form-input id="location" v-model.trim="experience.location" class="input-field"></b-form-input>
                  </b-form-group>
                  <div class="row">
                    <div class="col-6">
                      <label class="smaller-font">From</label>
                      <b-form-group>
                        <b-form-input id="from" v-model.trim="experience.from" type="date" class="input-field"></b-form-input>
                      </b-form-group>
                    </div>
                    <div class="col-6">
                      <label class="smaller-font">To</label>
                      <b-form-group>
                        <b-form-input id="to" v-model.trim="experience.to" type="date" class="input-field"></b-form-input>
                      </b-form-group>
                    </div>
                  </div>
                    <label class="smaller-font">Title</label>
                  <b-form-group>
                    <b-form-textarea id="description" v-model.trim="experience.description" rows="4" class="input-field"></b-form-textarea>
                  </b-form-group>
                </b-form>
              </div>
              <button
                v-if="role === 'student'"
                style="width: 100%; border-radius: 10px;"
                class="btn-outline-warning mb-2 mt-1 "
                @click.prevent="addItem('experience')">
                Add</button>
            </tab-content>
            <tab-content
              :before-change="validateAsync"
              v-if="role === 'student'"
              title="Skills"
              icon="ti-stats-up">
              <b-form-group id="fieldsetHorizontal"
                            :label-cols="4"
                            breakpoint="md"
                            label-size="sm"
                            class="m-0"
                            label="Skills">
              </b-form-group>
              <SkillSelect @addSkills="addSkills"/>
            </tab-content>

          </form-wizard>

        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import NavBar from './NavBar'
import SkillSelect from './SkillSelect'
import UniversitySelect from './UniversitySelect'

export default {
  name: 'ProfileBuilder',
  components: {
    NavBar,
    SkillSelect,
    UniversitySelect
  },
  data () {
    return {
      isError: false,
      invalidName: false,
      invalidOrganization: false,
      invalidLinkedIn: false,
      name: '',
      user: {
        company: '',
        social: {
          linkedin: '',
          github: ''
        }
      },
      role: '',
      company: '',
      experiences: [{
        company: '',
        title: '',
        location: '',
        from: '',
        to: '',
        description: ''
      }],
      educations: [{
        school: '',
        degree: '',
        location: '',
        fieldofstudy: '',
        from: '',
        to: ''
      }],
      skills: [],
      activeIndex: 0,
      loadingWizard: false,
      errorMsg: null,
      goNextIfNoError: false,
      showNoError: false,
      noError: ''
    }
  },
  methods: {
    onComplete: function () {
      var params = {
        'Authorization': 'Bearer ' + localStorage.getItem('jwtToken').substring(4, localStorage.getItem('jwtToken').length),
        'Content-Type': 'application/json'
      }
      var id = localStorage.getItem('user_id')
      axios.patch(`https://ancient-caverns-78426.herokuapp.com/api/user/${id}`, {first_time: false}, {headers: params})
        .then(response => {
          localStorage.setItem('user_first_time', 'false')
          this.$router.push({
            name: 'HomePage'
          })
        })
        .catch(e => {
          console.log(e.response.data)
        })
    },
    handleTabChanged (prevIndex, nextIndex) {
      this.activeIndex = nextIndex
    },
    setLoading: function (value) {
      this.loadingWizard = value
    },
    handleValidation: function (isValid, tabIndex) {
      console.log('Tab: ' + tabIndex + ' valid: ' + isValid)
    },
    handleErrorMessage: function (errorMsg) {
      this.errorMsg = errorMsg
    },
    validateAsync: function () {
      return new Promise((resolve, reject) => {
        var id = localStorage.getItem('user_id')
        var params = {
          'Authorization': 'Bearer ' + localStorage.getItem('jwtToken').substring(4, localStorage.getItem('jwtToken').length),
          'Content-Type': 'application/json'
        }
        if (this.activeIndex === 0) {
          var obj = {
            data: {
              name: this.user.name,
              company: this.company,
              website: this.user.website,
              social: this.user.social,
              bio: this.user.bio
            },
            user: {id: id}
          }
          if (!this.user.name  || !this.user.social.linkedin) {
            this.invalidName = false
            this.invalidOrganization = false
            this.invalidLinkedIn = false
            if (!this.user.name) { this.invalidName = true }
            // if (!this.user.company) { this.invalidOrganization = true }
            if (!this.user.social.linkedin) { this.invalidLinkedIn = true }
            reject('Please enter required fields')
          }

          axios.post(`https://ancient-caverns-78426.herokuapp.com/api/profile/personal`, obj, {headers: params})
            .then(response => {
              resolve(true)
            })
            .catch(e => {
              reject(e.response.data)
            })
        } else if (this.activeIndex === 1) {
          if (this.role === "student") {
            let vals = new Set();
            for (let i = 0; i < this.educations.length; i++) {
              vals.add(this.educations[i].school === "");
              vals.add(this.educations[i].degree === "");
              // vals.add(this.educations[i].location === "");
              vals.add(this.educations[i].fieldofstudy === "");
              vals.add(this.educations[i].from === "");
              vals.add(this.educations[i].to === "");
              if (
                this.educations[i].from != "" &&
                this.educations[i].to != ""
              ) {
                let from = new Date(this.educations[i].from);
                let to = new Date(this.educations[i].to);
                if (from > to) {
                  reject(
                    "Please make sure the to date appears after the from date"
                  );
                }
              }
            }

            if (vals.size == 1) {
              var obj = {
                data: this.educations,
                user: { id: id }
              };

              axios
                .post(`https://ancient-caverns-78426.herokuapp.com/api/profile/education`, obj, {
                  headers: params
                })
                .then(response => {
                  resolve(true);
                })
                .catch(e => {
                  reject(e.response.data);
                });
            } else {
              reject(
                "Please complete all fields, or return to this section later."
              );
            }
          } else {
            console.log("pt employer code");
          }
        } else if (this.activeIndex === 2) {
          if (this.role === "student") {
            let vals = new Set();
            for (let i = 0; i < this.experiences.length; i++) {
              vals.add(this.experiences[i].company === "");
              vals.add(this.experiences[i].title === "");
              vals.add(this.experiences[i].location === "");
              vals.add(this.experiences[i].from === "");
              vals.add(this.experiences[i].description === "");
              if (
                this.experiences[i].from != "" &&
                this.experiences[i].to != ""
              ) {
                let from = new Date(this.experiences[i].from);
                let to = new Date(this.experiences[i].to);
                if (from > to) {
                  reject(
                    "Please make sure the to date appears after the from date"
                  );
                }
              }
            }
            console.log(vals)
            if (vals.size === 1) {
              var obj = {
                data: this.experiences,
                user: { id: id }
              };

              axios
                .post(`https://ancient-caverns-78426.herokuapp.com/api/profile/experience`, obj, {
                  headers: params
                })
                .then(response => {
                  resolve(true);
                })
                .catch(e => {
                  reject(e.response.data);
                });
            } else {
              reject(
                "Please complete all fields, or return to this section later."
              );
            }
          } else {
            console.log("pt employer code");
          }
        } else if (this.activeIndex === 3) {
          if (this.skills.length > 0) {
            var skillsArray = []
            this.skills.forEach(skill => {
              skillsArray.push(skill.name)
            })

            var obj = {
              data: skillsArray,
              user: {id: id}
            }

            axios.post(`https://ancient-caverns-78426.herokuapp.com/api/profile/skills`, obj, {headers: params})
              .then(response => {
                resolve(true)
              })
              .catch(e => {
                reject(e.response.data)
              })
          } else {
            resolve(true)
          }
        }
      })
    },
    addItem (array) {
      if (array === 'education') {
        this.educations.push(
          {
            school: '',
            degree: '',
            fieldofstudy: '',
            from: '',
            to: '',
            current: true
          }
        )
      } else if (array === 'experience') {
        this.experiences.push({
          company: '',
          title: '',
          location: '',
          from: '',
          to: '',
          current: [],
          description: ''
        })
      }
    },
    addSkills (skill) {
      this.skills = skill
    },
    addCompany (skill) {
      this.company = skill.name
    },
    deleteItem (index, array) {
      if (array === 'education') { this.educations = this.educations.splice(this.educations.indexOf(index), 1) } else if (array === 'experience') { this.experiences = this.experiences.splice(this.experiences.indexOf(index), 1) }
    },
    logout () {
      localStorage.removeItem('jwtToken')
      this.$router.push({
        name: 'Login'
      })
    }
  },
  created () {
    if (localStorage.getItem('role') == 'null') {
      const {value: role} = this.$swal({
        title: 'Select Role',
        input: 'select',
        inputOptions: {
          student: 'Student',
          employer: 'Employer'
        },
        allowOutsideClick: false,
        showCancelButton: false,
        inputPlaceholder: 'Select role',
        confirmButtonColor: '#f0ad4e',
        inputValidator: (value) => {
          return new Promise((resolve, reject) => {
            if (value === 'student' || value === 'employer') {
              var id = localStorage.getItem('user_id')
              var params = {
                'Authorization': 'Bearer ' + localStorage.getItem('jwtToken').substring(4, localStorage.getItem('jwtToken').length),
                'Content-Type': 'application/json'
              }
              var obj = {
                user: id,
                role: value
              }
              axios.post('https://ancient-caverns-78426.herokuapp.com/api/profile/updateRole', obj, {headers: params})
                .then(resposne => {
                  localStorage.setItem('role', value)
                  this.role = value
                  resolve()
                })
                .catch(e => {
                  reject('Error')
                })
            } else {
              resolve('You need to select a role :)')
            }
          })
        }
      })
    }
  },
  mounted () {
    document.getElementById("main").style.marginLeft = "0";
    this.role = localStorage.role
  }
}
</script>

<style scoped>
  .main-container {
    height: 100%;
    width: 100% !important;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .swal-title {
    margin: 0px;
    font-size: 25px;
    box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.21);
    margin-bottom: 28px;
  }

  .error-border {
    border-color: red;
  }
  .error-label {
    color: red;
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
</style>
