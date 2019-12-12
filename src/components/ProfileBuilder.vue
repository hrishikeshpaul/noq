
<template>
  <div>
    <div class="mt-5 container">
      <div class="container main-container">
        <div class="mr-5">
          <button
            class="btn-outline-secondary"
            style="cursor: pointer; border-radius: 10px; padding-top: 5px; padding-bottom: 5px !important; border: none !important;"
            @click="logout"
          >
            Logout
            <i class="ti-back-left"></i>
          </button>
        </div>
        <b-card style="max-height: 85vh; overflow-y: auto; min-height: 60vh">
          <form-wizard
            v-if="role"
            :color="'black'"
            @on-complete="onComplete"
            step-size="sm"
            color="#DA9F74"
            @on-change="handleTabChanged"
            @on-loading="setLoading"
            @on-validate="handleValidation"
            @on-error="handleErrorMessage"
          >
            <h2 slot="title">Hi, let us get you started with your profile!</h2>
            <div
              class="alert alert-danger mb-2 text-center"
              role="alert"
              v-if="errorMsg"
            >{{errorMsg}}</div>

            <tab-content
              title="Personal details"
              icon="ti-user"
              class="mt-2"
              :before-change="validateAsync"
            >
              <b-form>
                <!-- -->
                <label class="smaller-font">Profile Picture</label>

                <div class="text-center nice-font mb-2">
                  <div class="wrapper">
                    <img
                      alt
                      :src="user.profilepicture ? user.profilepicture : require('../assets/blank_profile.png')"
                      style="height: 180px; width: 180px; border-radius: 50%; object-fit: cover; border: 4px solid rgba(233, 228, 228, 0.58);"
                    />
                    <div class="overlay">
                      <div class="text">
                        <label class="btn-upload">
                          <input type="file" name="fileupload" @change="onFileChanged" />
                          <button class="btn">
                            <i class="ti-pencil"></i>
                          </button>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <label class="smaller-font">Full Name *</label>
                <b-form-group :class="{'error-label': invalidName}">
                  <b-form-input
                    id="name_input"
                    :class="{'error-border': invalidName, 'input-field': 'true'}"
                    v-model.trim="user.name"
                  ></b-form-input>
                </b-form-group>

                <label class="smaller-font">{{role === 'student' ? 'University *' : 'Company *'}}</label>
                <b-form-group :class="{'error-label': invalidOrganization}">
                  <UniversitySelect
                    :class="{'error-border': invalidOrganization}"
                    v-model.trim="user.company"
                    @addCompany="addCompany"
                    v-if="role === 'student'"
                  />
                  <b-form-input
                    id="name"
                    class="input-field"
                    :class="{'error-border': invalidOrganization}"
                    v-model.trim="user.company"
                    v-if="role === 'employer'"
                  ></b-form-input>
                </b-form-group>

                <label class="smaller-font">Website</label>
                <b-form-group>
                  <b-form-input id="website" v-model.trim="user.website" class="input-field"></b-form-input>
                </b-form-group>
                <label class="smaller-font">LinkedIn *</label>
                <b-form-group :class="{'error-label': invalidLinkedIn}">
                  <b-form-input
                    id="linkedin"
                    :class="{'error-border': invalidLinkedIn, 'input-field': 'true'}"
                    v-model.trim="user.social.linkedin"
                  ></b-form-input>
                </b-form-group>

                <label class="smaller-font" v-if="role === 'student'">GitHub</label>
                <b-form-group v-if="role === 'student'">
                  <b-form-input id="github" v-model.trim="user.social.github" class="input-field"></b-form-input>
                </b-form-group>

                <label class="smaller-font">Bio</label>
                <b-form-group>
                  <b-form-textarea id="bio" v-model.trim="user.bio" rows="3" class="input-field"></b-form-textarea>
                </b-form-group>
              </b-form>
            </tab-content>
            <tab-content
              :title="'Education'"
              v-if="role === 'student'"
              :icon="role === 'student' ? 'ti-book' : 'ti-bag'"
              :before-change="validateAsync"
            >
              <div v-for="(education,index) in educations" v-if="role === 'student'">
                <div class="row" v-if="educations.length > 1">
                  <div class="col-11">
                    <hr />
                  </div>
                  <div class="col-1">
                    <button
                      class="btn-outline-danger btn-sm"
                      @click.prevent="deleteItem(index, 'education')"
                    >X</button>
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
                    <b-form-input
                      id="fieldofstudy"
                      v-model.trim="education.fieldofstudy"
                      class="input-field"
                    ></b-form-input>
                  </b-form-group>
                  <div class="row">
                    <div class="col-6">
                      <label class="smaller-font">From</label>
                      <b-form-group>
                        <b-form-input
                          id="from"
                          v-model.trim="education.from"
                          type="date"
                          class="input-field"
                        ></b-form-input>
                      </b-form-group>
                    </div>
                    <div class="col-6">
                      <label class="smaller-font">To</label>
                      <b-form-group>
                        <b-form-input
                          id="to"
                          v-model.trim="education.to"
                          type="date"
                          class="input-field"
                        ></b-form-input>
                      </b-form-group>
                    </div>
                  </div>
                </b-form>
              </div>
              <button
                v-if="role === 'student'"
                style="width: 100%; border-radius: 4px;"
                class="btn-outline-primary mb-2 mt-1"
                @click.prevent="addItem('education')"
              >
                <b>Add</b>
              </button>
            </tab-content>
            <!--           EXPERIENCE TAB-->
            <tab-content
              v-if="role === 'student'"
              title="Experience"
              :before-change="validateAsync"
              icon="ti-bag"
            >
              <div v-for="(experience,index) in experiences">
                <div class="row" v-if="experiences.length > 1">
                  <div class="col-11">
                    <hr />
                  </div>
                  <div class="col-1">
                    <button
                      class="btn-outline-danger btn-sm"
                      @click.prevent="deleteItem(index, 'experience')"
                    >X</button>
                  </div>
                </div>
                <b-form>
                  <label class="smaller-font">Name of Organisation</label>
                  <b-form-group>
                    <b-form-input
                      id="company"
                      v-model.trim="experience.company"
                      class="input-field"
                    ></b-form-input>
                  </b-form-group>

                  <label class="smaller-font">Title</label>
                  <b-form-group>
                    <b-form-input id="title" v-model.trim="experience.title" class="input-field"></b-form-input>
                  </b-form-group>

                  <label class="smaller-font">Location</label>
                  <b-form-group>
                    <b-form-input
                      id="location"
                      v-model.trim="experience.location"
                      class="input-field"
                    ></b-form-input>
                  </b-form-group>
                  <div class="row">
                    <div class="col-6">
                      <label class="smaller-font">From</label>
                      <b-form-group>
                        <b-form-input
                          id="from"
                          v-model.trim="experience.from"
                          type="date"
                          class="input-field"
                        ></b-form-input>
                      </b-form-group>
                    </div>
                    <div class="col-6">
                      <label class="smaller-font">To</label>
                      <b-form-group>
                        <b-form-input
                          id="to"
                          v-model.trim="experience.to"
                          type="date"
                          class="input-field"
                        ></b-form-input>
                      </b-form-group>
                    </div>
                  </div>
                  <label class="smaller-font">Description</label>
                  <b-form-group>
                    <b-form-textarea
                      id="description"
                      v-model.trim="experience.description"
                      rows="4"
                      class="input-field"
                    ></b-form-textarea>
                  </b-form-group>
                </b-form>
              </div>
              <button
                v-if="role === 'student'"
                style="width: 100%; border-radius: 3px;"
                class="btn-outline-primary mb-2 mt-1"
                @click.prevent="addItem('experience')"
              >Add</button>
            </tab-content>
            <tab-content
              :title="'Honor'"
              v-if="role === 'student'"
              :icon="role === 'student' ? 'ti-medall' : 'ti-bag'"
              :before-change="validateAsync"
            >
              <div v-for="(honor,index) in honors" v-if="role === 'student'">
                <div class="row" v-if="honors.length > 1">
                  <div class="col-11">
                    <hr />
                  </div>
                  <div class="col-1">
                    <button
                      class="btn-outline-danger btn-sm"
                      @click.prevent="deleteItem(index, 'honor')"
                    >X</button>
                  </div>
                </div>
                <b-form v-if="role === 'student'">
                  <label class="smaller-font">Title of Honor</label>
                  <b-form-group>
                    <b-form-input id="title" v-model.trim="honor.title" class="input-field"></b-form-input>
                  </b-form-group>

                  <label class="smaller-font">Issuer</label>
                  <b-form-group>
                    <b-form-input id="issuer" v-model.trim="honor.issuer" class="input-field"></b-form-input>
                  </b-form-group>

                  <label class="smaller-font">Description</label>
                  <b-form-group>
                    <b-form-input
                      id="description"
                      v-model.trim="honor.description"
                      class="input-field"
                    ></b-form-input>
                  </b-form-group>
                  <div class="row">
                    <div class="col-12">
                      <label class="smaller-font">Issue Date</label>
                      <b-form-group>
                        <b-form-input
                          id="issueDate"
                          v-model.trim="honor.issueDate"
                          type="date"
                          class="input-field"
                        ></b-form-input>
                      </b-form-group>
                    </div>
                  </div>
                </b-form>
              </div>
              <button
                v-if="role === 'student'"
                style="width: 100%; border-radius: 4px;"
                class="btn-outline-primary mb-2 mt-1"
                @click.prevent="addItem('honor')"
              >
                <b>Add</b>
              </button>
            </tab-content>
            <tab-content
              :title="'Certification'"
              v-if="role === 'student'"
              :icon="role === 'student' ? 'ti-bookmark-alt' : 'ti-bag'"
              :before-change="validateAsync"
            >
              <div v-for="(certification,index) in certifications" v-if="role === 'student'">
                <div class="row" v-if="certifications.length > 1">
                  <div class="col-11">
                    <hr />
                  </div>
                  <div class="col-1">
                    <button
                      class="btn-outline-danger btn-sm"
                      @click.prevent="deleteItem(index, 'certification')"
                    >X</button>
                  </div>
                </div>
                <b-form v-if="role === 'student'">
                  <label class="smaller-font">Title of certification</label>
                  <b-form-group>
                    <b-form-input id="title" v-model.trim="certification.title" class="input-field"></b-form-input>
                  </b-form-group>

                  <label class="smaller-font">Issuer</label>
                  <b-form-group>
                    <b-form-input
                      id="issuer"
                      v-model.trim="certification.issuer"
                      class="input-field"
                    ></b-form-input>
                  </b-form-group>

                  <label class="smaller-font">Description</label>
                  <b-form-group>
                    <b-form-input
                      id="description"
                      v-model.trim="certification.description"
                      class="input-field"
                    ></b-form-input>
                  </b-form-group>
                  <div class="row">
                    <div class="col-6">
                      <label class="smaller-font">Issue Date</label>
                      <b-form-group>
                        <b-form-input
                          id="issueDate"
                          v-model.trim="certification.issueDate"
                          type="date"
                          class="input-field"
                        ></b-form-input>
                      </b-form-group>
                    </div>
                    <div class="col-6">
                      <label class="smaller-font">Expiry Date</label>
                      <b-form-group>
                        <b-form-input
                          id="expiryDate"
                          v-model.trim="certification.expiryDate"
                          type="date"
                          class="input-field"
                        ></b-form-input>
                      </b-form-group>
                    </div>
                  </div>
                </b-form>
              </div>
              <button
                v-if="role === 'student'"
                style="width: 100%; border-radius: 4px;"
                class="btn-outline-primary mb-2 mt-1"
                @click.prevent="addItem('certification')"
              >
                <b>Add</b>
              </button>
            </tab-content>
            <tab-content
              :before-change="validateAsync"
              v-if="role === 'student'"
              title="Skills"
              icon="ti-stats-up"
            >
              <b-form-group
                id="fieldsetHorizontal"
                :label-cols="4"
                breakpoint="md"
                label-size="sm"
                class="m-0"
                label="Skills"
              ></b-form-group>
              <SkillSelect @addSkills="addSkills" />
            </tab-content>
          </form-wizard>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import NavBar from "./NavBar";
import SkillSelect from "./SkillSelect";
import UniversitySelect from "./UniversitySelect";
import url from "../config/server_config";
export default {
  name: "ProfileBuilder",
  components: {
    NavBar,
    SkillSelect,
    UniversitySelect
  },
  data() {
    return {
      isError: false,
      invalidName: false,
      invalidPicture: false,
      invalidOrganization: false,
      invalidLinkedIn: false,
      name: "",
      user: {
        bio: " ",
        company: "",
        profilepicture: null,
        social: {
          linkedin: "",
          github: ""
        }
      },
      role: "",
      company: "",
      experiences: [
        {
          company: "",
          title: "",
          location: "",
          from: "",
          to: "",
          description: ""
        }
      ],
      educations: [
        {
          school: "",
          degree: "",
          location: "",
          fieldofstudy: "",
          from: "",
          to: ""
        }
      ],
      honors: [
        {
          title: "",
          issuer: "",
          description: "",
          issueDate: ""
        }
      ],
      certifications: [
        {
          title: "",
          issuer: "",
          description: "",
          issueDate: "",
          expiryDate: ""
        }
      ],
      skills: [],
      activeIndex: 0,
      loadingWizard: false,
      errorMsg: null,
      goNextIfNoError: false,
      showNoError: false,
      noError: ""
    };
  },
  methods: {
    onFileChanged(event) {
      var headers = {
        Authorization:
          "Bearer " +
          localStorage
            .getItem("jwtToken")
            .substring(4, localStorage.getItem("jwtToken").length)
      };
      var file = event.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = e => {
        this.user.profilepicture = e.target.result;
        axios
          .post(
            `${url}/api/profile/picture`,
            {
              image: e.target.result.replace(/^data:image\/[a-z]+;base64,/, ""),
              user_id: this.user._id
            },
            { headers: headers }
          )
          .then(response => {
            if (response.status === 204) {
              this.$swal({
                position: "bottom-right",
                backdrop: false,
                showConfirmButton: false,
                timer: 2500,
                width: "300px",
                imageHeight: 20,
                imageWidth: 20,
                background: "rgba(92,184,92,0.93)",
                title:
                  "<span style=\"  font-family: 'Roboto', sans-serif; font-size: 16px; font-weight: 200; color: white; padding-top: 10px;\">Successfully updated profile picture!</span>"
              });
            }
          })
          .catch(e => {
            if (e.response.status === 401) {
              this.$router.push({
                name: "Login"
              });
            }
          });
      };
    },
    onComplete: function() {
      var params = {
        Authorization:
          "Bearer " +
          localStorage
            .getItem("jwtToken")
            .substring(4, localStorage.getItem("jwtToken").length),
        "Content-Type": "application/json"
      };
      var id = localStorage.getItem("user_id");
      axios
        .patch(
          `${url}/api/user/${id}`,
          { first_time: false },
          { headers: params }
        )
        .then(response => {
          localStorage.setItem("user_first_time", "false");
          this.$swal({
            type: "success",
            showConfirmButton: true,
            timer: 4500,
            width: "400px",
            imageHeight: 20,
            imageWidth: 20,
            html:
              "<span style=\"font-family: 'Roboto', sans-serif; font-size: 16px; font-weight: 200;padding-top: 10px;\">Your profile has been set up!</span>",
            title:
              "<h3 style=\"font-family: 'Roboto', sans-serif; font-size: 16px; font-weight: 300\">Successful!</h3>"
          });
          this.$router.push({
            name: "HomePage"
          });
        })
        .catch(e => {
          console.log(e.response.data);
        });
    },
    handleTabChanged(prevIndex, nextIndex) {
      this.activeIndex = nextIndex;
    },
    setLoading: function(value) {
      this.loadingWizard = value;
    },
    handleValidation: function(isValid, tabIndex) {
      console.log("Tab: " + tabIndex + " valid: " + isValid);
    },
    handleErrorMessage: function(errorMsg) {
      this.errorMsg = errorMsg;
    },
    validateAsync: function() {
      return new Promise((resolve, reject) => {
        var id = localStorage.getItem("user_id");
        var params = {
          Authorization:
            "Bearer " +
            localStorage
              .getItem("jwtToken")
              .substring(4, localStorage.getItem("jwtToken").length),
          "Content-Type": "application/json"
        };
        if (this.activeIndex === 0) {
          var obj = {
            data: {
              name: this.user.name,
              company: this.user.company,
              website: this.user.website,
              social: this.user.social,
              bio: this.user.bio,
              profilepicture: this.user.profilepicture
            },
            user: { id: id }
          };
          if (!this.user.name || !this.user.social.linkedin) {
            this.invalidName = false;
            this.invalidOrganization = false;
            this.invalidLinkedIn = false;
            if (!this.user.name) {
              this.invalidName = true;
            }
            // if (!this.user.company) { this.invalidOrganization = true }
            if (!this.user.social.linkedin) {
              this.invalidLinkedIn = true;
            }
            reject("Please enter required fields");
          }
          console.log(obj);
          axios
            .post(`${url}/api/profile/personal`, obj, { headers: params })
            .then(response => {
              resolve(true);
            })
            .catch(e => {
              reject(e.response.data);
            });
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
              //get iterator:
              var it = vals.values();
              //get first entry:
              var first = it.next();
              //get value out of the iterator entry:
              var value = first.value;
              if (value === false) {
                var obj = {
                  data: this.educations,
                  user: { id: id }
                };
                axios
                  .post(`${url}/api/profile/education`, obj, {
                    headers: params
                  })
                  .then(response => {
                    resolve(true);
                  })
                  .catch(e => {
                    reject(e.response.data);
                  });
              } else {
                resolve(true);
              }
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
            if (vals.size === 1) {
              //get iterator:
              var it = vals.values();
              //get first entry:
              var first = it.next();
              //get value out of the iterator entry:
              var value = first.value;
              if (value === false) {
                var obj = {
                  data: this.experiences,
                  user: { id: id }
                };
                axios
                  .post(`${url}/api/profile/experience`, obj, {
                    headers: params
                  })
                  .then(response => {
                    resolve(true);
                  })
                  .catch(e => {
                    reject(e.response.data);
                  });
              } else {
                resolve(true);
              }
            } else {
              reject(
                "Please complete all fields, or return to this section later."
              );
            }
          } else {
            console.log("pt employer code");
          }
        } else if (this.activeIndex === 3) {
          if (this.role === "student") {
            let vals = new Set();
            for (let i = 0; i < this.honors.length; i++) {
              vals.add(this.honors[i].title === "");
              vals.add(this.honors[i].issuer === "");
              // vals.add(this.educations[i].location === "");
              vals.add(this.honors[i].description === "");
              vals.add(this.honors[i].issueDate === "");
            }
            if (vals.size == 1) {
              //get iterator:
              var it = vals.values();
              //get first entry:
              var first = it.next();
              //get value out of the iterator entry:
              var value = first.value;
              if (value === false) {
                var obj = {
                  data: this.honors,
                  user: { id: id }
                };
                axios
                  .post(`${url}/api/profile/honor`, obj, {
                    headers: params
                  })
                  .then(response => {
                    resolve(true);
                  })
                  .catch(e => {
                    reject(e.response.data);
                  });
              } else {
                resolve(true);
              }
            } else {
              reject(
                "Please complete all fields, or return to this section later."
              );
            }
          } else {
            console.log("pt employer code");
          }
        } else if (this.activeIndex === 4) {
          if (this.role === "student") {
            let vals = new Set();
            for (let i = 0; i < this.certifications.length; i++) {
              vals.add(this.certifications[i].title === "");
              vals.add(this.certifications[i].issuer === "");
              // vals.add(this.educations[i].location === "");
              vals.add(this.certifications[i].description === "");
              vals.add(this.certifications[i].issueDate === "");
              vals.add(this.certifications[i].expiryDate === "");
            }
            if (vals.size == 1) {
              //get iterator:
              var it = vals.values();
              //get first entry:
              var first = it.next();
              //get value out of the iterator entry:
              var value = first.value;
              if (value === false) {
                var obj = {
                  data: this.certifications,
                  user: { id: id }
                };
                axios
                  .post(`${url}/api/profile/certification`, obj, {
                    headers: params
                  })
                  .then(response => {
                    resolve(true);
                  })
                  .catch(e => {
                    reject(e.response.data);
                  });
              } else {
                resolve(true);
              }
            } else {
              reject(
                "Please complete all fields, or return to this section later."
              );
            }
          } else {
            console.log("pt employer code");
          }
        } else if (this.activeIndex === 5) {
          if (this.skills.length > 0) {
            // var skillsArray = []
            // this.skills.forEach(skill => {
            //   skillsArray.push(skill.name)
            // })
            var obj = {
              data: this.skills,
              user: { id: id }
            };
            axios
              .post(`${url}/api/profile/skills`, obj, { headers: params })
              .then(response => {
                resolve(true);
              })
              .catch(e => {
                reject(e.response.data);
              });
          } else {
            resolve(true);
          }
        }
      });
    },
    addItem(array) {
      if (array === "education") {
        this.educations.push({
          school: "",
          degree: "",
          fieldofstudy: "",
          from: "",
          to: "",
          current: true
        });
      } else if (array === "experience") {
        this.experiences.push({
          company: "",
          title: "",
          location: "",
          from: "",
          to: "",
          current: [],
          description: ""
        });
      } else if (array === "honor") {
        this.honors.push({
          title: "",
          issuer: "",
          issueDate: "",
          description: ""
        });
      } else if (array === "certification") {
        this.honors.push({
          title: "",
          issuer: "",
          issueDate: "",
          expiryDate: "",
          description: ""
        });
      }
    },
    addSkills(skill) {
      this.skills = skill;
    },
    addCompany(skill) {
      this.user.company = skill.name;
    },
    deleteItem(index, array) {
      if (array === "education") {
        this.educations = this.educations.splice(
          this.educations.indexOf(index),
          1
        );
      } else if (array === "experience") {
        this.experiences = this.experiences.splice(
          this.experiences.indexOf(index),
          1
        );
      }
    },
    logout() {
      localStorage.removeItem("jwtToken");
      this.$router.push({
        name: "Login"
      });
    }
  },
  created() {
    if (localStorage.getItem("role") == "null") {
      const { value: role } = this.$swal({
        title: "Select Role",
        input: "select",
        inputOptions: {
          student: "Student",
          employer: "Employer"
        },
        allowOutsideClick: false,
        showCancelButton: false,
        inputPlaceholder: "Select role",
        confirmButtonColor: "#f0ad4e",
        inputValidator: value => {
          return new Promise((resolve, reject) => {
            if (value === "student" || value === "employer") {
              var id = localStorage.getItem("user_id");
              var params = {
                Authorization:
                  "Bearer " +
                  localStorage
                    .getItem("jwtToken")
                    .substring(4, localStorage.getItem("jwtToken").length),
                "Content-Type": "application/json"
              };
              var obj = {
                user: id,
                role: value
              };
              axios
                .post(`${url}/api/profile/updateRole`, obj, { headers: params })
                .then(resposne => {
                  localStorage.setItem("role", value);
                  this.role = value;
                  resolve();
                })
                .catch(e => {
                  reject("Error");
                });
            } else {
              resolve("You need to select a role :)");
            }
          });
        }
      });
    }
  },
  mounted() {
    document.getElementById("main").style.marginLeft = "0";
    this.role = localStorage.role;
  }
};
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
  font-family: "Roboto", sans-serif;
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
  cursor: pointer !important;
  background-color: white;
  border: 1px solid #c68967 !important;
  color: grey !important;
}
/deep/ .btn-outline-primary:hover {
  border-color: #c68967 !important;
  background-color: #de9a73 !important;
  color: white !important;
}
/deep/ .btn-outline-primary.active {
  border-color: #c68967 !important;
  background-color: #bf8463 !important;
  color: white !important;
}
.wrapper {
  position: relative;
  border-radius: 10px;
}
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
  transition: 0.5s ease;
  /*background-color: #262827;*/
}
.btn-upload {
  cursor: pointer !important;
  position: relative;
  overflow: hidden;
  display: inline-block;
}
.btn-upload input[type="file"] {
  cursor: pointer !important;
  position: absolute;
  opacity: 0;
  z-index: 0;
  max-width: 100%;
  height: 100%;
  display: block;
}
.btn-upload .btn {
  cursor: pointer !important;
  padding: 8px 12px;
  background: white;
  border: 1px solid #c68967;
  color: black;
  /*border: /z0;*/
}
.btn-upload:hover .btn {
  cursor: pointer !important;
  padding: 8px 12px;
  background: #f5f8f5;
  color: black;
}
</style>
