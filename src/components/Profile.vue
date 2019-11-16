<template>
  <div >
<!--    <NavBar @logout="logout"/>-->
    <button style="float: right; padding-top: 5px;" class="mt-5 mr-5 btn-outline-secondary rounded" @click="getData"><i class="ti-reload"></i></button>
    <span style="font-size: 80px;" class="mx-5 mb-0">Profile</span>
    <p class="" style="color: grey; margin-top: -20px; margin-left: 55px;">{{role === 'student' ? 'Edit your profile detials and check your acceptances!' : 'Add job postings, and message applicants!'}}</p>
    <hr width="94%" align="left" class="mx-5"/>
    <div class="px-5">
      <div class="row">
        <div class="col-lg-3 col-md-5 col-sm-12 text-center">
          <div class="mt-4">
            <img :src="gravatarImage(user.email)" style="height: 250px; width: 250px;"/>
            <div>
              <span style="font-size: 45px;" >{{user.name}}</span>
            </div>
            <div>
              <span style="font-size: 22px; color: grey;">{{user.company}}</span>
            </div>
            <div>
              <button href="#" class="mt-3 pt-2 mr-2 btn btn-outline-warning" @click="profileInputModal"><i
                class="ti-pencil"></i></button>
              <button href="#" class="mt-3 pt-2 mr-2 btn btn-outline-secondary" v-if="user.role === 'student'"
                      @click="showWindow(user.social.github)"><i class="ti-github"></i></button>
              <button href="#" class="mt-3 pt-2 mr-2 btn btn-outline-secondary" v-if="user.social.linkedin"
                      @click="showWindow(user.social.linkedin)"><i class="ti-linkedin"></i></button>
              <button href="#" class="mt-3 pt-2 mr-2 btn btn-outline-secondary" v-if="user.social.linkedin"
                      @click="showWindow(user.website)"><i class="ti-world"></i></button>
            </div>
            <hr width="100%" />
            <div style="justify-content: center; text-align: justify;" class='px-1'>
              <span style="font-size: 16px; font-style: italic;">{{user.bio.length > 40 ? user.bio.substring(0, 150) + ' ...' : user.bio}}</span>
            </div>
          </div>
        </div>
        <div class="col-lg-9 col-md-6 col-sm-12">
          <div class="mb-5 mt-4 container px-0 shadow-sm mb-5 bg-white rounded" v-if="role === 'student'">
            <b-card no-body>
              <b-tabs card style="font-size: 17px;">
                <b-tab title="Acceptances" active style="max-height: 1000px; overflow-y: auto;">
                  <b-card-body>
                    <span v-if="user.acceptances.length === 0">You don't have any acceptances! Start applying!</span>
                    <div v-for="(job, idx) in user.acceptances" class="text-left mt-2">
                      <b-card class="text-left my-2 shadow-hover">
                        <button href="#" style="float: right; margin-top: 5px !important; border: none;"
                                class="mt-3 pt-2 ml-2 btn btn-outline-danger" @click="rejectConfirmedApplicant(job._id, user._id)"><i
                          class="ti-close"></i></button>
                        <button href="#" style="float: right; margin-top: 5px !important; border: none;"
                                class="mt-3 pt-2 btn btn-outline-info"><i class="ti-comment-alt"></i>
                        </button>
                        <div class="row">
                          <div style="" class="col-lg-2 col-md-2 col-sm-12 pr-1">
                            <img style="height: 100px; width: 100px; object-fit: cover;" src="../assets/company.jpg">
                          </div>
                          <div style="text-align: justify" class="col-lg-10 col-md-10 col-sm-12">
                            <h3 class="card-title">{{job.title}}</h3>
                            <div class="row">
                              <div class="col-lg-1 col-md-1 col-sm-12 pr-0">
                                <span class="mt-5" style="margin-right: 4px"><i class="ti-location-pin"></i></span>
                              </div>
                              <div class="col-lg-11 col-md-11 col-sm-12 pl-0">
                                <span>{{job.location}}</span>
                              </div>
                            </div>
                            <p></p>
                            <div class="row">
                              <div class="col-lg-1 col-md-1 col-sm-12 pr-0">
                                <span class="mt-5" style="margin-right: 4px"><i class="ti-briefcase"></i></span>
                              </div>
                              <div class="col-lg-11 col-md-11 col-sm-12 pl-0">
                                <span>{{job.position}}</span>
                              </div>
                            </div>
                            <p></p>
                            <div class="row">
                              <div class="col-lg-1" style="width: 10px !important;">
                                <span style="font-weight: bold;"><i class="ti-receipt"></i></span>
                              </div>
                              <div class="col-lg-11 pl-0">
                                <span style="white-space: pre-wrap;">{{job.description}}</i></span>
                              </div>
                            </div>
                            <p></p>
                            <div class="row">
                              <div class="col-lg-1 col-md-1 col-sm-12 pr-0">
                                <span class="mt-5" style="margin-right: 4px"><i class="ti-star"></i></span>
                              </div>
                              <div class="col-lg-11 col-md-11 col-sm-12 pl-0">
                                <span>{{job.skills.length > 0 ? job.skills.map(s => s.name).join(', ') : 'None'}}</span>
                              </div>
                            </div>
                            <p></p>
                            <div class="row">
                              <div class="col-lg-1 col-md-1 col-sm-12 pr-0">
                                <span class="mt-5" style="margin-right: 4px"><i class="ti-stats-up"></i></span>
                              </div>
                              <div class="col-lg-11 col-md-11 col-sm-12 pl-0">
                                <span>{{job.applicants.length}}</span>
                              </div>
                            </div>
                            <p></p>
                          </div>
                        </div>
                      </b-card>
                    </div>
                  </b-card-body>
                </b-tab>
                <b-tab title="Education" style="max-height: 1000px; overflow-y: auto;">
                  <b-card-body style="font-size: 18px;">
                    <div v-for="edu in user.education" :id="edu.school">
                      <b-card class="mb-3 shadow-hover">
                        <button style="float: right; border: none; margin-top: 5px !important;" class="btn btn-outline-danger ml-2"
                                @click="deleteEducation(edu)"><i class="ti-close"></i></button>
                        <button style="float: right; border: none; margin-top: 5px !important;" class="btn btn-outline-secondary"
                                @click="editEducationModal(edu)"><i class="ti-pencil"></i></button>
                        <p></p>
                        <h4 class="card-title" style="margin-top: -12px;">{{edu.school}}</h4>
                        <hr width="100%" align="left"/>
                        <div class="row">
                          <div class="col-lg-1 col-md-1 col-sm-12 pr-0">
                            <span><i class="ti-bookmark-alt"></i></span>
                          </div>
                          <div class="col-lg-11 col-md-11 col-sm-12 pl-0">
                            <span>{{edu.degree}}</span>
                          </div>
                        </div>
                        <p></p>
                        <div class="row">
                          <div class="col-lg-1 col-md-1 col-sm-12 pr-0">
                            <span><i class="ti-agenda"></i></span>
                          </div>
                          <div class="col-lg-11 col-md-11 col-sm-12 pl-0">
                            <span>{{edu.fieldofstudy}}</span>
                          </div>
                        </div>
                        <p></p>
                        <div class="row">
                          <div class="col-lg-1 col-md-1 col-sm-12 pr-0">
                            <span><i class="ti-time"></i></span>
                          </div>
                          <div class="col-lg-11 col-md-11 col-sm-12 pl-0">
                            <span>{{formatDate(edu.from)}} - {{formatDate(edu.to)}} </span>
                          </div>
                        </div>
                        <p></p>
                      </b-card>
                    </div>
                    <b-button
                      v-if="role === 'student'"
                      style="width: 100%; border-radius: 10px;"
                      variant="outline-warning"
                      class="mb-2 mt-1 "
                      @click="addEducationModal"
                    >
                      Add
                    </b-button>
                  </b-card-body>
                </b-tab>
                <b-tab title="Experiences" style="max-height: 1000px; overflow-y: auto;">
                  <b-card-body style="font-size: 19px;">
                    <div v-for="exp in user.experience">
                      <b-card class="mb-3 shadow-hover">
                        <div class="row">
                          <div class="col-lg-10 col-md-11 col-sm-12">
                            <h3 class="card-title">{{exp.company}}</h3>
                          </div>
                          <div class="col-lg-2 col-md-2 col-sm-12 pl-0">
                            <button style="float: right; border: none;" class="btn btn-outline-danger ml-2"
                                    @click="deleteExperience(exp)"><i class="ti-close"></i></button>
                            <button style="float: right; border: none;" class="btn btn-outline-secondary"
                                    @click="editExperienceModal(exp)"><i class="ti-pencil"></i></button>
                          </div>
                        </div>
                        <hr width="100%" align="left" class="mt-0"/>
                        <p></p>
                        <div class="row">
                          <div class="col-lg-1 col-md-1 col-sm-12 pr-0">
                            <span><i class="ti-briefcase"></i></span>
                          </div>
                          <div class="col-lg-11 col-md-11 col-sm-12 pl-0">
                            <span>{{exp.title}}</span>
                          </div>
                        </div>
                        <p></p>
                        <div class="row">
                          <div class="col-lg-1 col-md-1 col-sm-12 pr-0">
                            <span><i class="ti-location-pin"></i></span>
                          </div>
                          <div class="col-lg-11 col-md-11 col-sm-12 pl-0">
                            <span>{{exp.location}}</span>
                          </div>
                        </div>
                        <p></p>
                        <div class="row">
                          <div class="col-lg-1 col-md-1 col-sm-12 pr-0">
                            <span><i class="ti-time"></i></span>
                          </div>
                          <div class="col-lg-11 col-md-11 col-sm-12 pl-0">
                            <span>{{formatDate(exp.from) }} - {{formatDate(exp.to)}}</span>
                          </div>
                        </div>
                        <p></p>
                        <div class="row">
                          <div class="col-lg-1 col-md-1 col-sm-12 pr-0">
                            <span><i class="ti-receipt"></i></span>
                          </div>
                          <div class="col-lg-11 col-md-11 col-sm-12 pl-0">
                            <span style="text-align: justify">{{exp.description}}</span>
                          </div>
                        </div>
                        <p></p>
                      </b-card>
                    </div>
                    <b-button
                      v-if="role === 'student'"
                      style="width: 100%; border-radius: 10px;"
                      variant="outline-warning"
                      class="mb-2 mt-1 "
                      @click="addExperienceModal"
                    >
                      Add
                    </b-button>
                  </b-card-body>
                </b-tab>
				<b-tab title="Honor" style="max-height: 1000px; overflow-y: auto;">
                  <b-card-body style="font-size: 18px;">
                    <div v-for="hon in user.honor" :id="edu.title">
                      <b-card class="mb-3 shadow-hover">
                        <button style="float: right; border: none; margin-top: 5px !important;" class="btn btn-outline-danger ml-2"
                                @click="deleteHonor(hon)"><i class="ti-close"></i></button>
                        <button style="float: right; border: none; margin-top: 5px !important;" class="btn btn-outline-secondary"
                                @click="editHonorModal(edu)"><i class="ti-pencil"></i></button>
                        <p></p>
                        <h4 class="card-title" style="margin-top: -12px;">{{honor.title}}</h4>
                        <hr width="100%" align="left"/>
                        <div class="row">
                          <div class="col-lg-1 col-md-1 col-sm-12 pr-0">
                            <span><i class="ti-bookmark-alt"></i></span>
                          </div>
                          <div class="col-lg-11 col-md-11 col-sm-12 pl-0">
                            <span>{{hon.issuer}}</span>
                          </div>
                        </div>
                        <p></p>
                        <div class="row">
                          <div class="col-lg-1 col-md-1 col-sm-12 pr-0">
                            <span><i class="ti-agenda"></i></span>
                          </div>
                          <div class="col-lg-11 col-md-11 col-sm-12 pl-0">
                            <span>{{hon.description}}</span>
                          </div>
                        </div>
                        <p></p>
                        <div class="row">
                          <div class="col-lg-1 col-md-1 col-sm-12 pr-0">
                            <span><i class="ti-time"></i></span>
                          </div>
                          <div class="col-lg-11 col-md-11 col-sm-12 pl-0">
                            <span>{{formatDate(hon.issueDate)}} </span>
                          </div>
                        </div>
                        <p></p>
                      </b-card>
                    </div>
                    <b-button
                      v-if="role === 'student'"
                      style="width: 100%; border-radius: 10px;"
                      variant="outline-warning"
                      class="mb-2 mt-1 "
                      @click="addHonorModal"
                    >
                      Add
                    </b-button>
                  </b-card-body>
                </b-tab>
                <b-tab title="Skills" style="max-height: 1000px; overflow-y: auto; min-height: 400px;">
                  <b-card-body style="font-size: 18px;">
                    <b-form class="text-left">
                      <label>Add/Remove Skills:</label>
                      <b-form-group>
                        <SkillSelect @addSkills="addSkills" :recievedValues="user.skills"/>
                        <button class="btn btn-outline-warning" @click.prevent="updateSkills"
                                style="width: 100%; border-radius: 10px;">Save
                        </button>
                      </b-form-group>
                    </b-form>
                    <hr/>
                  </b-card-body>
                </b-tab>
              </b-tabs>
            </b-card>
          </div>

          <div class="mb-5 mt-4 container px-0 shadow-sm mb-5 bg-white rounded" v-if="role === 'employer'">
            <b-card no-body>
              <b-tabs card style="font-size: 18px;">
                <b-tab title="Job Posting" active style="max-height: 1000px; overflow-y: auto;">
                  <b-card-body>
                    <b-input-group class="mb-3">
                      <b-form-input placeholder="Search for job" v-model="employerSearchJob"></b-form-input>
                      <b-input-group-append>
                        <b-button variant="warning" style="border: 1px solid #dba30e"><i class="ti-search"></i></b-button>
                      </b-input-group-append>
                    </b-input-group>
                    <div v-for="(job, idx) in employerJobs">
                      <b-card class="text-left my-2">
                        <button href="#" style="float: right; margin-top: 5px !important; border: none;"
                                class="mt-3 pt-2 ml-2 btn btn-outline-danger" @click="deleteConfirmModal(job)"><i
                          class="ti-close"></i></button>
                        <button href="#" style="float: right; margin-top: 5px !important; border: none;"
                                class="mt-3 pt-2 btn btn-outline-info" @click="jobInfoModal(job)"><i class="ti-pencil"></i>
                        </button>
                        <div class="row">
                          <div style="" class="col-lg-2 col-md-2 col-sm-12 pr-1">
                            <img style="height: 100px; width: 100px; object-fit: cover;" src="../assets/company.jpg">
                          </div>
                          <div style="text-align: justify" class="col-lg-10 col-md-10 col-sm-12">
                            <h3 class="card-title">{{job.title}}</h3>
                            <div class="row">
                              <div class="col-lg-1 col-md-1 col-sm-12 pr-0">
                                <span class="mt-5" style="margin-right: 4px"><i class="ti-location-pin"></i></span>
                              </div>
                              <div class="col-lg-11 col-md-11 col-sm-12 pl-0">
                                <span>{{job.location}}</span>
                              </div>
                            </div>
                            <p></p>
                            <div class="row">
                              <div class="col-lg-1 col-md-1 col-sm-12 pr-0">
                                <span class="mt-5" style="margin-right: 4px"><i class="ti-briefcase"></i></span>
                              </div>
                              <div class="col-lg-11 col-md-11 col-sm-12 pl-0">
                                <span>{{job.position}}</span>
                              </div>
                            </div>
                            <p></p>
                            <div class="row">
                              <div class="col-lg-1" style="width: 10px !important;">
                                <span style="font-weight: bold;"><i class="ti-receipt"></i></span>
                              </div>
                              <div class="col-lg-11 pl-0">
                                <span style="white-space: pre-wrap;">{{job.description}}</i></span>
                              </div>
                            </div>
                            <p></p>
                            <div class="row">
                              <div class="col-lg-1 col-md-1 col-sm-12 pr-0">
                                <span class="mt-5" style="margin-right: 4px"><i class="ti-star"></i></span>
                              </div>
                              <div class="col-lg-11 col-md-11 col-sm-12 pl-0">
                                <span>{{job.skills.length > 0 ? job.skills.map(s => s.name).join(', ') : 'None'}}</span>
                              </div>
                            </div>
                            <p></p>
                            <div class="row">
                              <div class="col-lg-1 col-md-1 col-sm-12 pr-0">
                                <span class="mt-5" style="margin-right: 4px"><i class="ti-stats-up"></i></span>
                              </div>
                              <div class="col-lg-11 col-md-11 col-sm-12 pl-0">
                                <span>{{job.applicants.length}}</span>
                              </div>
                            </div>
                            <p></p>
                          </div>
                        </div>
                      </b-card>
                    </div>
                    <button
                      @click="jobInputModal"
                      v-if="role === 'employer'"
                      style="width: 100%; border-radius: 10px;"
                      class="btn-outline-warning mb-2 mt-1"
                    >
                      Post Job
                    </button>
                  </b-card-body>
                </b-tab>
                <b-tab title="Applicants" style="max-height: 1000px; overflow-y: auto;">
                  <b-card-body>
                    <div v-for="job in user.jobs">
                      <div v-for="user in job.confirmed_users">
                        <b-card class="text-left my-2">
                          <button href="#" style="float: right; margin-top: 8px !important; border: none;" class="mt-3 pt-2 ml-2 btn btn-outline-danger" @click="rejectConfirmedApplicant(job._id, user._id)"><i class="ti-close"></i></button>
                          <button href="#" style="float: right; margin-top: 8px !important; border: none;" class="mt-3 pt-2 btn btn-outline-info"><i class="ti-comment-alt"></i></button>
                          <h3 class="card-title user-hover mt-2" style="cursor: pointer;" @click="applicantDataModal(user)">{{user.name}}</h3>
                          <hr />
                          <span class="mt-5" style="margin-right: 4px"><i class="ti-briefcase"></i></span>
                          <span>{{job.title}}</span>
                          <p></p>
                          <span class="mt-5" style="margin-right: 4px"><i class="ti-book"></i></span>
                          <span>{{user.company}}</span>
                          <p></p>
                          <span class="mt-5" style="margin-right: 4px"><i class="ti-linkedin"></i></span>
                          <a href="#" @click="showWindow(user.social.linkedin)">{{user.social.linkedin}}</a>
                          <p></p>
                          <span class="mt-5" style="margin-right: 4px"><i class="ti-star"></i></span>
                          <span>{{user.skills.map(s => s.name).join(', ')}}</span>
                          <p></p>
                        </b-card>
                      </div>
                    </div>
                  </b-card-body>
                </b-tab>
              </b-tabs>
            </b-card>
          </div>
        </div>
      </div>
    </div>


    <HomePageUserModal :showModal="showApplicantData" @hideModal="hideHomePageUserModal" :user="applicantData" />
    <JobInputModal :showModal="showJobInputModal" @hideModal="hideJobInputModal" :user="user" @getData="getData"/>
    <ProfileInputModal :showModal="showEditProfileModal" :user="user" @hideModal="hideEditProfileInputModal"/>
    <JobInfoModal :showModal="showJobInfoModal" :job="jobInfoToBePassed" @hideModal="hideJobInfoModal"/>
<!--    <DeleteConfirmModal :showModal="showDeleteConfirmModal" @hideModal="hideDeleteConfirmModal" @delete="deleteJobPosting" :job="jobInfoToBePassed"/>-->
    <EducationModal :show-modal="showEducationModal" @hideModal="hideEducationModal" :education="educationToBePassed" :buttonText="educationButtonText" :user="user"/>
    <ExperienceModal :show-modal="showExperienceModal" @hideModal="hideExperienceModal" :experience="experienceToBePassed" :button-text="experienceButtonText" :user="user" />
  </div>
</template>

<script>
import axios from 'axios'
import Fuse from 'fuse.js'
import gravatar from 'gravatar'
import 'font-awesome/css/font-awesome.min.css'
import url from '../config/server_config'

import NavBar from './NavBar'
import JobInputModal from './JobInputModal'
import ProfileInputModal from './ProfileEditModal'
import ProfileSettingsModal from './ProfileSettingsModal'
import JobInfoModal from './JobInfoModal'
import DeleteConfirmModal from './DeleteConfirmModal'
import EducationModal from './EducationModal'
import ExperienceModal from './ExperienceModal'
import HonorModal from './HonorModal'
import HomePageUserModal from './HomePageUserModal'

import Gravatar from 'vue-gravatar'
import SkillSelect from './SkillSelect'

export default {
  name: 'Profile',
  components: {
    SkillSelect,
    NavBar,
    Gravatar,
    JobInputModal,
    ProfileInputModal,
    ProfileSettingsModal,
    JobInfoModal,
    DeleteConfirmModal,
    EducationModal,
	HonorModal,
    ExperienceModal,
    HomePageUserModal
  },
  data () {
    return {
      fuseOptions: {
        shouldSort: true,
        threshold: 0.4,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [
          'title'
        ]
      },
      showToast: false,
      toastContent: '',
      jobInfoToBePassed: {},
      educationToBePassed: {},
      experienceToBePassed: {},
	  honorToBePassed: {},
      applicantData: {},
      educationButtonText: '',
      experienceButtonText: '',
	  honorButtonText: '',
      user_id: localStorage.getItem('user_id'),
      user: {
        acceptances: [],
        bio: '',
        name: '',
        location: '',
        company: '',
        social: {
          linkedin: '',
          github: ''
        }
      },
      skillsToUpdate: [],
      role: localStorage.role,
      show: true,
      showJobInputModal: false,
      showEditProfileModal: false,
      showJobInfoModal: false,
      showDeleteConfirmModal: false,
      showEducationModal: false,
      showExperienceModal: false,
	  showHonorModal: false,
      showApplicantData: false,
      employerSearchJob: '',
      gravatarIcon: null
    }
  },
  computed: {
    employerJobs: {
      get: function (s) {
        if (!this.employerSearchJob) { return this.user.jobs } else {
          var fuse = new Fuse(this.user.jobs, this.fuseOptions)
          return fuse.search(this.employerSearchJob)
        }
      },
      set: function (newVal) {
        return newVal
      }
    }
  },
  watch: {
    user (newData) {
      this.user = newData
    }
  },
  methods: {
    logout () {
      localStorage.removeItem('jwtToken')
      this.$router.push({
        name: 'Login'
      })
    },
    showWindow (ref) {
      window.open(ref)
    },
    gravatarImage (email) {
      return gravatar.url(email)
    },
    formatDate (date) {
      if (date)
        return this.$moment(date).format('MMM Do YY')
      else return 'Present'
    },
    applicantDataModal (user) {
      this.applicantData = user
      this.showApplicantData = !this.showApplicantData
    },
    hideHomePageUserModal () {
      this.showApplicantData = false
    },
    jobInputModal () {
      this.showJobInputModal = !this.showJobInputModal
    },
    hideJobInputModal () {
      this.$swal({
        position: 'top-right',
        backdrop: false,
        showConfirmButton: false,
        timer: 2500,
        width: '300px',
        imageHeight: 20,
        imageWidth: 20,
        background: 'rgba(92,184,92,0.93)',
        title: '<span style="  font-family: \'Raleway\', sans-serif; font-size: 16px; font-weight: 200; color: white; padding-top: 10px;">Successful!</span>'
      })
      this.showJobInputModal = false
    },
    profileInputModal () {
      this.showEditProfileModal = !this.showEditProfileModal
    },
    hideEditProfileInputModal () {
      this.$swal({
        position: 'top-right',
        backdrop: false,
        showConfirmButton: false,
        timer: 2500,
        width: '300px',
        imageHeight: 20,
        imageWidth: 20,
        background: 'rgba(92,184,92,0.93)',
        title: '<span style="  font-family: \'Raleway\', sans-serif; font-size: 16px; font-weight: 200; color: white; padding-top: 10px;">Successful!</span>'
      })
      this.showEditProfileModal = false
    },
    jobInfoModal (job) {
      this.jobInfoToBePassed = job
      this.showJobInfoModal = !this.showJobInfoModal
    },
    hideJobInfoModal () {
      this.showJobInfoModal = false
    },
    deleteConfirmModal (job) {
      this.$swal({
        title: '<span style="font-family: \'Raleway\', sans-serif; font-size: 28px; font-weight: 400;">Are you sure?</span>',
        html: `<span style="font-family: \'Raleway\', sans-serif; font-size: 16px; font-weight: 200">Once deleted, you will not be able to recover the job with title, ${job.title}</span>`,
        type: "warning",
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
      })
        .then((willDelete) => {
          if (willDelete.value) {
            var headers = {
              Authorization: 'Bearer ' + localStorage.getItem('jwtToken').substring(4, localStorage.getItem('jwtToken').length)
            }
            axios.delete(`${url}/api/jobs/${job._id}`, {headers: headers})
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
                  title: '<span style="font-family: \'Raleway\', sans-serif; font-size: 16px; font-weight: 200; color: white; padding-top: 10px;">Successfully deleted!</span>'
                })
                this.getData()
              })
              .catch(err => {
                alert(err.response.data)
              })
          }
        });
      // this.jobInfoToBePassed = job
      // this.showDeleteConfirmModal = !this.showDeleteConfirmModal
    },
    hideDeleteConfirmModal () {
      this.$swal({
        position: 'top-right',
        backdrop: false,
        showConfirmButton: false,
        timer: 2500,
        width: '300px',
        imageHeight: 20,
        imageWidth: 20,
        background: 'rgba(92,184,92,0.93)',
        title: '<span style="  font-family: \'Raleway\', sans-serif; font-size: 16px; font-weight: 200; color: white; padding-top: 10px;">Successful!</span>'
      })
      this.showDeleteConfirmModal = false
    },
    editEducationModal (education) {
      this.educationToBePassed = education
      this.educationButtonText = 'Edit Education'
      this.showEducationModal = !this.showEducationModal
    },
    hideEducationModal () {
      this.showEducationModal = false
      this.getData()
    },
    editExperienceModal (experience) {
      this.experienceToBePassed = experience
      this.experienceButtonText = 'Edit Experience'
      this.showExperienceModal = !this.showExperienceModal
    },
    hideExperienceModal () {
      this.showExperienceModal = false
      this.getData()
    },
	editHonorModal (honor) {
      this.honorToBePassed = honor
      this.honorButtonText = 'Edit Honor'
      this.showHonorModal = !this.showHonorModal
    },
    hideHonorModal () {
      this.showHonorModal = false
      this.getData()
    },
    addEducationModal () {
      this.educationToBePassed = {
        to: null,
        from: null,
        school: '',
        fieldofstudy: '',
        degree: '',
        current: false
      }
      this.educationButtonText = 'Add Education'
      this.showEducationModal = !this.showEducationModal
    },
    addExperienceModal () {
      this.experienceToBePassed = {
        to: null,
        from: null,
        company: '',
        title: '',
        location: '',
        description: '',
        current: true
      }
      this.experienceButtonText = 'Add Experience'
      this.showExperienceModal = !this.showExperienceModal
    },
	addHonorModal () {
      this.honorToBePassed = {
        issueDate: null,
        title: '',
        issuer: '',
        description: ''    
      }
      this.HonorButtonText = 'Add Honor'
      this.showHonorModal = !this.showHonorModal
    },
    deleteExperience (exp) {
      this.$swal({
        title: '<span style="font-family: \'Raleway\', sans-serif; font-size: 28px; font-weight: 400;">Are you sure?</span>',
        html: `<span style="font-family: \'Raleway\', sans-serif; font-size: 16px; font-weight: 200">Once deleted, you will not be able to recover the experience.</span>`,
        type: "warning",
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
      })
        .then((willDelete) => {
          if (willDelete.value) {
            var headers = {
              Authorization: 'Bearer ' + localStorage.getItem('jwtToken').substring(4, localStorage.getItem('jwtToken').length)
            }

            axios.delete(`${url}/api/profile/experience/${exp._id}`, {headers: headers})
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
                  title: '<span style="font-family: \'Raleway\', sans-serif; font-size: 16px; font-weight: 200; color: white; padding-top: 10px;">Successfully deleted!</span>'
                })
                this.getData()
              })
              .catch(err => {
                alert(err.response.data)
              })
          }
        });
    },
    deleteEducation (edu) {
      this.$swal({
        title: '<span style="font-family: \'Raleway\', sans-serif; font-size: 28px; font-weight: 400;">Are you sure?</span>',
        html: `<span style="font-family: \'Raleway\', sans-serif; font-size: 16px; font-weight: 200">Once deleted, you will not be able to recover the education.</span>`,
        type: "warning",
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
      })
        .then((willDelete) => {
          if (willDelete.value) {
            var headers = {
              Authorization: 'Bearer ' + localStorage.getItem('jwtToken').substring(4, localStorage.getItem('jwtToken').length)
            }
            axios.delete(`${url}/api/profile/education/${edu._id}`, {headers: headers})
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
                  title: '<span style="font-family: \'Raleway\', sans-serif; font-size: 16px; font-weight: 200; color: white; padding-top: 10px;">Successfully deleted!</span>'
                })
                this.getData()
              })
              .catch(err => {
                alert(err.response.data)
              })
          }
        });

    },
    deleteHonor (exp) {
      this.$swal({
        title: '<span style="font-family: \'Raleway\', sans-serif; font-size: 28px; font-weight: 400;">Are you sure?</span>',
        html: `<span style="font-family: \'Raleway\', sans-serif; font-size: 16px; font-weight: 200">Once deleted, you will not be able to recover the experience.</span>`,
        type: "warning",
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
      })
        .then((willDelete) => {
          if (willDelete.value) {
            var headers = {
              Authorization: 'Bearer ' + localStorage.getItem('jwtToken').substring(4, localStorage.getItem('jwtToken').length)
            }

            axios.delete(`${url}/api/profile/honor/${hon._id}`, {headers: headers})
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
                  title: '<span style="font-family: \'Raleway\', sans-serif; font-size: 16px; font-weight: 200; color: white; padding-top: 10px;">Successfully deleted!</span>'
                })
                this.getData()
              })
              .catch(err => {
                alert(err.response.data)
              })
          }
        });
    },
    rejectConfirmedApplicant (job_id, user_id) {
      this.$swal({
        title: '<span style="font-family: \'Raleway\', sans-serif; font-size: 28px; font-weight: 400;">Are you sure?</span>',
        html: `<span style="font-family: \'Raleway\', sans-serif; font-size: 16px; font-weight: 200">Once rejected, you will not be able to message the user again.</span>`,
        type: "warning",
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
      })
        .then((willDelete) => {
          if (willDelete.value) {
            var headers = {
              Authorization: 'Bearer ' + localStorage.getItem('jwtToken').substring(4, localStorage.getItem('jwtToken').length)
            }

            axios.patch(`${url}/api/jobs/rejectconfirmedapplicant`, {job: job_id, user: user_id}, {headers: headers})
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
                  title: '<span style="font-family: \'Raleway\', sans-serif; font-size: 16px; font-weight: 200; color: white; padding-top: 10px;">Successfully deleted!</span>'
                })
                this.getData()
              })
              .catch(err => {
                alert('Delete could not happen.')
              })
          }
        });

    },
    addSkills (skills) {
      this.skillsToUpdate = skills
    },
    updateSkills () {
      var headers = {
        Authorization: 'Bearer ' + localStorage.getItem('jwtToken').substring(4, localStorage.getItem('jwtToken').length)
      }

      axios.post(`${url}/api/profile/skills`, {data: this.skillsToUpdate, user: {id: this.user._id}}, {headers: headers})
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
            title: '<span style="  font-family: \'Raleway\', sans-serif; font-size: 16px; font-weight: 200; color: white; padding-top: 10px;">Successful!</span>'
          })
          this.getData()
        })
        .catch(e => {
          console.log(e)
        })
    },
    getData () {
      var headers = {
        Authorization: 'Bearer ' + localStorage.getItem('jwtToken').substring(4, localStorage.getItem('jwtToken').length)
      }

      axios.get(`${url}/api/user/${this.user_id}`, {headers: headers})
        .then(response => {
          this.user = response.data
        })
        .catch(e => {
          if (e.response.status === 401) {
            this.$router.push({
              name: 'Login'
            })
          }
        })
    }
  },
  created () {
    this.getData()
  }
}
</script>

<style scoped>
  button {
    cursor: pointer;
  },
.user-hover {
  color: black;
}

.user-hover:hover {
  color: grey
}
.shadow-hover {
  box-shadow: none;
  transition: all 0.4s;
}
  .shadow-hover:hover {
    box-shadow: 1px 2px 7px #bdbdbd;
  }
  .swal-wide {
    font-family: 'Raleway', sans-serif !important;

  }
</style>
