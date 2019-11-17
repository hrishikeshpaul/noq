<template>

  <div >
<!--    <NavBar @logout="logout"/>-->
    <nav class="navbar navbar-light bg-light shadow-nav">
      <a class="navbar-brand pl-3" href="#" style="color: #17252A; font-weight: 300; font-size: 25px;">Profile</a>
      <div class="text-center w-50">
        <div class="row px-3 py-1">
          <div class="col-11">
          </div>
          <div class="col-1">
                <button style="float: right; padding-top: 5px;" class="btn-outline-secondary rounded ml-1" @click="getData"><i class="ti-reload"></i></button>
          </div>
        </div>
      </div>
    </nav>

    <div class="px-5">
      <div class="row">
        <div class="col-lg-3 col-md-5 col-sm-12 text-center">
          <div class="mt-4">
            <img :src="user.profilepicture ? user.profilepicture.toString() : require('../assets/blank_profile.png')"
                 style="height: 250px; width: 250px; object-fit: cover" class="profile-border"/>
            <div class="mt-2">
              <span style="font-size: 30px; margin-top: 5px;" >{{user.name}}</span>
            </div>
            <div style="margin-top: -5px;">
              <span style="font-size: 16px; color: grey;">{{user.company}}</span>
            </div>
            <div>
              <button href="#" class="mt-3 pt-2 mr-2 btn btn-outline-primary" @click="profileInputModal"><i
                class="ti-pencil"></i></button>
              <button href="#" class="mt-3 pt-2 mr-2 btn btn-outline-secondary" v-if="user.role === 'student'"
                      @click="showWindow(user.social.github)"><i class="ti-github"></i></button>
              <button href="#" class="mt-3 pt-2 mr-2 btn btn-outline-secondary" v-if="user.social.linkedin"
                      @click="showWindow(user.social.linkedin)"><i class="ti-linkedin"></i></button>
              <button href="#" class="mt-3 pt-2 mr-2 btn btn-outline-secondary" v-if="user.social.linkedin"
                      @click="showWindow(user.website)"><i class="ti-world"></i></button>
            </div>
            <hr width="100%"/>
            <div style="justify-content: center; text-align: justify;" class='px-1'>
              <span style="font-size: 16px; font-style: italic;">{{user.bio.length > 40 ? user.bio.substring(0, 150) + ' ...' : user.bio}}</span>
            </div>
          </div>
        </div>
        <div class="col-lg-9 col-md-6 col-sm-12">
          <div class="mb-5 mt-4 container px-0 shadow-sm mb-5 bg-white rounded" v-if="role === 'student'">
<!--            <b-card no-body style="border: 1px solid rgba(251,174,131,0.77);">-->
            <b-card no-body style="border: none;">
              <b-tabs card style="font-size: 16px;">
                <b-tab title="Acceptances" active style="max-height: 1000px; overflow-y: auto; background-color: rgba(255,250,250,0.85)">
                  <b-card-body class="p-0">
                    <span v-if="user.acceptances.length === 0">You don't have any acceptances! Start applying!</span>
                    <div v-for="(job, idx) in user.acceptances" class="text-left mt-2">
                      <b-card class="text-left my-2 shadow-hover">
                        <button href="#" style="float: right; margin-top: 5px !important; border: none;"
                                class="mt-3 pt-2 ml-2 btn btn-outline-danger"
                                @click="rejectConfirmedApplicant(job._id, user._id)"><i
                          class="ti-close"></i></button>
                        <button href="#" style="float: right; margin-top: 5px !important; border: none;"
                                class="mt-3 pt-2 btn btn-outline-info" @click="messageUserModal(job.employer)"><i
                          class="ti-comment-alt"></i>
                        </button>
                        <div class="row">
                          <div style="" class="col-lg-2 col-md-2 col-sm-12 pr-1">
                            <img style="height: 100px; width: 100px; object-fit: cover;"
                                 :src="job.employer.profilepicture ? job.employer.profilepicture.toString() : require('../assets/company.jpg')"
                                 class="icon-border">
                          </div>
                          <div style="text-align: justify" class="col-lg-10 col-md-10 col-sm-12">
                            <h5 class="card-title">{{job.title}}</h5>
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
                <b-tab title="Education" style="max-height: 1000px; overflow-y: auto; background-color: rgba(255,250,250,0.85)">
                  <b-card-body style="font-size: 16px;">
                    <div v-for="edu in user.education" :id="edu.school">
                      <b-card class="mb-3 shadow-hover">
                        <button style="float: right; border: none; margin-top: 5px !important;"
                                class="btn btn-outline-danger ml-2"
                                @click="deleteEducation(edu)"><i class="ti-close"></i></button>
                        <button style="float: right; border: none; margin-top: 5px !important;"
                                class="btn btn-outline-secondary"
                                @click="editEducationModal(edu)"><i class="ti-pencil"></i></button>
                        <p></p>
                        <h5 class="card-title" style="margin-top: -12px;">{{edu.school}}</h5>
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
                      style="width: 100%; border-radius: 5px;"
                      variant="outline-primary"
                      class="mb-2 mt-1 "
                      @click="addEducationModal"
                    >
                      Add
                    </b-button>
                  </b-card-body>
                </b-tab>
                <b-tab title="Experiences" style="max-height: 1000px; overflow-y: auto; background-color: rgba(255,250,250,0.85)">
                  <b-card-body style="font-size: 16px;">
                    <div v-for="exp in user.experience">
                      <b-card class="mb-3 shadow-hover">
                        <div class="row">
                          <div class="col-lg-10 col-md-11 col-sm-12">
                            <h5 class="card-title">{{exp.company}}</h5>
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
                      variant="outline-primary"
                      class="mb-2 mt-1 "
                      @click="addExperienceModal"
                    >
                      Add
                    </b-button>
                  </b-card-body>
                </b-tab>
                <b-tab title="Honor" style="max-height: 1000px; overflow-y: auto;">
                  <b-card-body style="font-size: 16px;">
                    <div v-for="hon in user.honor" :id="hon.title">
                      <b-card class="mb-3 shadow-hover">
                        <button style="float: right; border: none; margin-top: 5px !important;" class="btn btn-outline-danger ml-2"
                                @click="deleteHonor(hon)"><i class="ti-close"></i></button>
                        <button style="float: right; border: none; margin-top: 5px !important;" class="btn btn-outline-secondary"
                                @click="editHonorModal(hon)"><i class="ti-pencil"></i></button>
                        <p></p>
                        <h5 class="card-title" style="margin-top: -12px;">{{hon.title}}</h5>
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
                      style="width: 100%; border-radius: 5px;"
                      variant="outline-primary"
                      class="mb-2 mt-1 "
                      @click="addHonorModal"
                    >
                      Add
                    </b-button>
                  </b-card-body>
                </b-tab>
                <b-tab title="Certification" style="max-height: 1000px; overflow-y: auto;">
                  <b-card-body style="font-size: 16px;">
                    <div v-for="cert in user.certification" :id="cert.title">
                      <b-card class="mb-3 shadow-hover">
                        <button style="float: right; border: none; margin-top: 5px !important;"
                                class="btn btn-outline-danger ml-2"
                                @click="deleteCertification(cert)"><i class="ti-close"></i></button>
                        <button style="float: right; border: none; margin-top: 5px !important;"
                                class="btn btn-outline-secondary"
                                @click="editCertificationModal(cert)"><i class="ti-pencil"></i></button>
                        <p></p>
                        <h5 class="card-title" style="margin-top: -12px; ">{{cert.title}}</h5>
                        <hr width="100%" align="left"/>
                        <div class="row">
                          <div class="col-lg-1 col-md-1 col-sm-12 pr-0">
                            <span><i class="ti-bookmark-alt"></i></span>
                          </div>
                          <div class="col-lg-11 col-md-11 col-sm-12 pl-0">
                            <span>{{cert.issuer}}</span>
                          </div>
                        </div>
                        <p></p>
                        <div class="row">
                          <div class="col-lg-1 col-md-1 col-sm-12 pr-0">
                            <span><i class="ti-agenda"></i></span>
                          </div>
                          <div class="col-lg-11 col-md-11 col-sm-12 pl-0">
                            <span>{{cert.description}}</span>
                          </div>
                        </div>
                        <p></p>
                        <div class="row">
                          <div class="col-lg-1 col-md-1 col-sm-12 pr-0">
                            <span><i class="ti-time"></i></span>
                          </div>
                          <div class="col-lg-11 col-md-11 col-sm-12 pl-0">
                            <span>{{formatDate(cert.issueDate)}}  - {{formatDate(cert.expiryDate)}} </span>
                          </div>
                        </div>
                        <p></p>
                      </b-card>
                    </div>
                    <b-button
                      v-if="role === 'student'"
                      style="width: 100%; border-radius: 5px;"
                      variant="outline-primary"
                      class="mb-2 mt-1 "
                      @click="addCertificationModal"
                    >
                      Add
                    </b-button>
                  </b-card-body>
                </b-tab>


                <b-tab title="Skills" style="max-height: 1000px; overflow-y: auto; min-height: 400px;">
                  <b-card-body style="font-size: 16px;">
                    <b-form class="text-left">
                      <label>Add/Remove Skills:</label>
                      <b-form-group>
                        <SkillSelect @addSkills="addSkills" :recievedValues="user.skills"/>
                        <button class="btn btn-outline-primary" @click.prevent="updateSkills"
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
              <b-tabs card style="font-size: 16px;">
                <b-tab title="Job Posting" active style="max-height: 1000px; overflow-y: auto; background-color: rgba(255,250,250,0.85)">
                  <b-card-body class="py-2">
                    <b-input-group class="mb-3">
                      <b-form-input placeholder="Search for job" v-model="employerSearchJob"></b-form-input>
                      <b-input-group-append>
                        <button class="btn btn-primary"><i class="ti-search"></i></button>
                      </b-input-group-append>
                    </b-input-group>
                    <div v-for="(job, idx) in employerJobs">
                      <b-card class="text-left my-2 card-collapse"
                              style="height: 140px; overflow-y: hidden; background-color: #fdfdfd" :id="idx">
                        <div>
                          <button href="#" style="float: right; margin-top: -2px !important; border: none;"
                                  class="mt-3 pt-2 ml-2 btn btn-outline-danger" @click="deleteConfirmModal(job)"><i
                            class="ti-close"></i></button>
                          <button href="#" style="float: right; margin-top: -2px !important; border: none;"
                                  class="mt-3 pt-2 btn btn-outline-info" @click="jobInfoModal(job)"><i
                            class="ti-pencil"></i>
                          </button>
                        </div>
                        <div class="row">
                          <div style="" class="col-lg-2 col-md-2 col-sm-12 pr-1">
                            <img style="height: 100px; width: 100px; object-fit: cover;" class="icon-border"
                                 :src="user.profilepicture ? user.profilepicture.toString() : require('../assets/company.jpg')">
                          </div>
                          <div style="text-align: justify" class="col-lg-10 col-md-10 col-sm-12">
                            <h5 class="card-title title-collapse" @click="expandCollapseItem(idx, job.collapse, job._id)" style="font-weight: 300;">{{job.title}}</h5>
                            <div class="row">
                              <div class="col-lg-1 col-md-1 col-sm-12 pr-0">
                                <span class="mt-5" style="margin-right: 4px"><i class="ti-location-pin"></i></span>
                              </div>
                              <div class="col-lg-11 col-md-11 col-sm-12 pl-0">
                                <span style="font-size: 15px;">{{job.location}}</span>
                              </div>
                            </div>
                            <p></p>
                            <div class="row">
                              <div class="col-lg-1 col-md-1 col-sm-12 pr-0">
                                <span class="mt-5" style="margin-right: 4px"><i class="ti-briefcase"></i></span>
                              </div>
                              <div class="col-lg-11 col-md-11 col-sm-12 pl-0">
                                <span style="font-size: 15px;">{{job.position}}</span>
                              </div>
                            </div>
                            <p></p>
                            <div class="row">
                              <div class="col-lg-1 col-md-1 col-sm-12 pr-0">
                                <span class="mt-5" style="margin-right: 4px"><i class="ti-star"></i></span>
                              </div>
                              <div class="col-lg-11 col-md-11 col-sm-12 pl-0">
                                <span style="font-size: 15px;">{{job.skills.length > 0 ? job.skills.map(s => s.name).join(', ') : 'None'}}</span>
                              </div>
                            </div>
                            <p></p>
                            <div class="row">
                              <div class="col-lg-1" style="width: 10px !important;">
                                <span style="font-weight: bold;"><i class="ti-receipt"></i></span>
                              </div>
                              <div class="col-lg-11 pl-0">
                                <span style="white-space: pre-wrap; font-size: 15px;">{{job.description}}</i></span>
                              </div>
                            </div>
                            <p></p>
                            <div class="row">
                              <div class="col-lg-1 col-md-1 col-sm-12 pr-0">
                                <span class="mt-5" style="margin-right: 4px"><i class="ti-stats-up"></i></span>
                              </div>
                              <div class="col-lg-11 col-md-11 col-sm-12 pl-0">
                                <span style="font-size: 15px;">{{job.applicants.length}}</span>
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
                      style="width: 100%; border-radius: 5px;"
                      class="mt-2 btn btn-outline-primary w-100"
                    >
                      Post Job
                    </button>
                  </b-card-body>
                </b-tab>
                <b-tab title="Applicants" style="max-height: 1000px; overflow-y: auto; background-color: rgba(255,250,250,0.85)">
                  <b-card-body>
                    <div v-for="job in user.jobs">
                      <div v-for="user in job.confirmed_users">
                        <b-card class="text-left my-2">
                          <button href="#" style="float: right; margin-top: 8px !important; border: none;" class="mt-3 pt-2 ml-2 btn btn-outline-danger" @click="rejectConfirmedApplicant(job._id, user._id)"><i class="ti-close"></i></button>
                          <button href="#" style="float: right; margin-top: 8px !important; border: none;" class="mt-3 pt-2 btn btn-outline-info"><i class="ti-comment-alt" @click="messageUserModal(user)"></i></button>
                          <h5 class="card-title user-hover mt-2" style="cursor: pointer; font-weight: 300;" @click="applicantDataModal(user)">{{user.name}}</h5>
                          <hr />
                          <span class="mt-5" style="margin-right: 4px"><i class="ti-briefcase"></i></span>
                          <span style="font-size: 15px;">{{job.title}}</span>
                          <p></p>
                          <span class="mt-5" style="margin-right: 4px"><i class="ti-book"></i></span>
                          <span style="font-size: 15px;">{{user.company}}</span>
                          <p></p>
                          <span class="mt-5" style="margin-right: 4px"><i class="ti-linkedin"></i></span>
                          <a href="#" @click="showWindow(user.social.linkedin)" style="font-size: 15px;">{{user.social.linkedin}}</a>
                          <p></p>
                          <span class="mt-5" style="margin-right: 4px"><i class="ti-star"></i></span>
                          <span style="font-size: 15px;">{{user.skills.map(s => s.name).join(', ')}}</span>
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

    <MessageUserModal :showModal="showMessageUserModal" @hideModal="hideMessageUserModal" :user="messageUserData"/>
    <HomePageUserModal :showModal="showApplicantData" @hideModal="hideHomePageUserModal" :user="applicantData"/>
    <JobInputModal :showModal="showJobInputModal" @hideModal="hideJobInputModal" :user="user" @getData="getData"/>
    <ProfileInputModal :showModal="showEditProfileModal" :user="user" @hideModal="hideEditProfileInputModal"/>
    <JobInfoModal :showModal="showJobInfoModal" :job="jobInfoToBePassed" @hideModal="hideJobInfoModal"/>
    <!--    <DeleteConfirmModal :showModal="showDeleteConfirmModal" @hideModal="hideDeleteConfirmModal" @delete="deleteJobPosting" :job="jobInfoToBePassed"/>-->
    <EducationModal :show-modal="showEducationModal" @hideModal="hideEducationModal" :education="educationToBePassed"
                    :buttonText="educationButtonText" :user="user"/>
    <ExperienceModal :show-modal="showExperienceModal" @hideModal="hideExperienceModal"
                     :experience="experienceToBePassed" :button-text="experienceButtonText" :user="user"/>
    <HonorModal :show-modal="showHonorModal" @hideModal="hideHonorModal" :honor="honorToBePassed"
                :buttonText="honorButtonText" :user="user"/>
    <CertificationModal :show-modal="showCertificationModal" @hideModal="hideCertificationModal"
                        :certification="certificationToBePassed" :buttonText="certificationButtonText" :user="user"/>
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
import CertificationModal from './CertificationModal'
import HonorModal from './HonorModal'
import HomePageUserModal from './HomePageUserModal'
import MessageUserModal from './MessageUserModal'

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
    ExperienceModal,
    HonorModal,
    CertificationModal,
    HomePageUserModal,
    MessageUserModal
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
      certificationToBePassed: {},
      honorToBePassed: {},
      applicantData: {},
      messageUserData: {},
      educationButtonText: '',
      experienceButtonText: '',
      honorButtonText: '',
      certificationButtonText: '',
      user_id: localStorage.getItem('user_id'),
      user: {
        profilepicture: '',
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
      showCertificationModal: false,
      showApplicantData: false,
      showMessageUserModal: false,
      employerSearchJob: '',
      gravatarIcon: null
    }
  },
  computed: {
    employerJobs: {
      get: function (s) {
        if (!this.employerSearchJob) {
          return this.user.jobs
        } else {
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
    expandCollapseItem (idx, collapse, jobId) {
      if (collapse) {
        this.employerJobs[idx].collapse = false
        document.getElementById(idx).style.height = '140px'
        document.getElementById(idx).style.transition = 'height 0.5s ease-in 0s'
      } else {
        this.employerJobs[idx].collapse = true
        document.getElementById(idx).style.height = '100%'
        document.getElementById(idx).style.transition = 'height 0.5s ease-in 0s'
      }
    },
    logout () {
      localStorage.removeItem('jwtToken')
      this.$router.push({
        name: 'Login'
      })
    },
    hideMessageUserModal () {
      this.showMessageUserModal = false
    },
    showWindow (ref) {
      window.open(ref)
    },
    gravatarImage (email) {
      return gravatar.url(email)
    },
    formatDate (date) {
      if (date) {
        return this.$moment(date).format('MMM Do YY')
      } else {
        return 'Present'
      }
    },
    messageUserModal (user) {
      this.messageUserData = user
      this.showMessageUserModal = !this.showMessageUserModal
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
        title: '<span style="  font-family: \'Roboto\', sans-serif; font-size: 16px; font-weight: 200; color: white; padding-top: 10px;">Successful!</span>'
      })
      this.showJobInputModal = false
    },
    profileInputModal () {
      this.showEditProfileModal = !this.showEditProfileModal
    },
    hideEditProfileInputModal () {
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
        title: '<span style="font-family: \'Roboto\', sans-serif; font-size: 28px; font-weight: 400;">Are you sure?</span>',
        html: `<span style="font-family: \'Roboto\', sans-serif; font-size: 16px; font-weight: 200">Once deleted, you will not be able to recover the job with title, ${job.title}</span>`,
        type: "warning",
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!'
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
                  title: '<span style="font-family: \'Roboto\', sans-serif; font-size: 16px; font-weight: 200; color: white; padding-top: 10px;">Successfully deleted!</span>'
                })
                this.getData()
              })
              .catch(err => {
                alert(err.response.data)
              })
          }
        })
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
        title: '<span style="  font-family: \'Roboto\', sans-serif; font-size: 16px; font-weight: 200; color: white; padding-top: 10px;">Successful!</span>'
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
    editCertificationModal (certification) {
      this.certificationToBePassed = certification
      this.certificationButtonText = 'Edit Certification'
      this.showCertificationModal = !this.showCertificationModal
    },
    hideCertificationModal () {
      this.showCertificationModal = false
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
      this.honorButtonText = 'Add Honor'
      this.showHonorModal = !this.showHonorModal
    },
    addCertificationModal () {
      this.certificationToBePassed = {
        issueDate: null,
        title: '',
        issuer: '',
        description: ''
      }
      this.certificationButtonText = 'Add Certification'
      this.showCertificationModal = !this.showCertificationModal
    },
    deleteExperience (exp) {
      this.$swal({
        title: '<span style="font-family: \'Roboto\', sans-serif; font-size: 28px; font-weight: 400;">Are you sure?</span>',
        html: `<span style="font-family: \'Roboto\', sans-serif; font-size: 16px; font-weight: 200">Once deleted, you will not be able to recover the experience.</span>`,
        type: "warning",
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!'
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
                  title: '<span style="font-family: \'Roboto\', sans-serif; font-size: 16px; font-weight: 200; color: white; padding-top: 10px;">Successfully deleted!</span>'
                })
                this.getData()
              })
              .catch(err => {
                alert(err.response.data)
              })
          }
        })
    },
    deleteEducation (edu) {
      this.$swal({
        title: '<span style="font-family: \'Roboto\', sans-serif; font-size: 28px; font-weight: 400;">Are you sure?</span>',
        html: `<span style="font-family: \'Roboto\', sans-serif; font-size: 16px; font-weight: 200">Once deleted, you will not be able to recover the education.</span>`,
        type: "warning",
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!'
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
                  title: '<span style="font-family: \'Roboto\', sans-serif; font-size: 16px; font-weight: 200; color: white; padding-top: 10px;">Successfully deleted!</span>'
                })
                this.getData()
              })
              .catch(err => {
                alert(err.response.data)
              })
          }
        })
    },
    deleteHonor (hon) {
      this.$swal({
        title: '<span style="font-family: \'Raleway\', sans-serif; font-size: 28px; font-weight: 400;">Are you sure?</span>',
        html: `<span style="font-family: \'Raleway\', sans-serif; font-size: 16px; font-weight: 200">Once deleted, you will not be able to recover the experience.</span>`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!'
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
        })
    },
    deleteCertification (cert) {
      this.$swal({
        title: '<span style="font-family: \'Raleway\', sans-serif; font-size: 28px; font-weight: 400;">Are you sure?</span>',
        html: `<span style="font-family: \'Raleway\', sans-serif; font-size: 16px; font-weight: 200">Once deleted, you will not be able to recover the experience.</span>`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!'
      })
        .then((willDelete) => {
          if (willDelete.value) {
            var headers = {
              Authorization: 'Bearer ' + localStorage.getItem('jwtToken').substring(4, localStorage.getItem('jwtToken').length)
            }

            axios.delete(`${url}/api/profile/certification/${cert._id}`, {headers: headers})
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
        })
    },
    rejectConfirmedApplicant (job_id, user_id) {
      this.$swal({
        title: '<span style="font-family: \'Roboto\', sans-serif; font-size: 28px; font-weight: 400;">Are you sure?</span>',
        html: `<span style="font-family: \'Roboto\', sans-serif; font-size: 16px; font-weight: 200">Once rejected, you will not be able to message the user again.</span>`,
        type: "warning",
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!'
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
                  title: '<span style="font-family: \'Roboto\', sans-serif; font-size: 16px; font-weight: 200; color: white; padding-top: 10px;">Successfully deleted!</span>'
                })
                this.getData()
              })
              .catch(err => {
                alert('Delete could not happen.')
              })
          }
        })
    },
    addSkills (skills) {
      this.skillsToUpdate = skills
    },
    updateSkills () {
      var headers = {
        Authorization: 'Bearer ' + localStorage.getItem('jwtToken').substring(4, localStorage.getItem('jwtToken').length)
      }

      axios.post(`${url}/api/profile/skills`, {
        data: this.skillsToUpdate,
        user: {id: this.user._id}
      }, {headers: headers})
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
            title: '<span style="  font-family: \'Roboto\', sans-serif; font-size: 16px; font-weight: 200; color: white; padding-top: 10px;">Successful!</span>'
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
          this.user.jobs.forEach(job => {
            job.collapse = false
          })
          console.log(this.user)
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
    border-radius: 5px;
  }
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
    font-family: 'Roboto', sans-serif !important;

  }

  .card-collapse {
    transition: height 0.5s ease-in .5s
  }

  .title-collapse {
    cursor: pointer;
  }

  .title-collapse:hover {
    color: #4c4c4c;
  }

  /deep/ .card-header {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    background-color: #3e3e3e;
    /*background-color: rgba(255, 187, 138, 0.61) !important;*/
  }

  /deep/ .nav-link {
    /*color: #88491C*/
    color: white;
  }

  /deep/ .nav-link:hover {
    border-color: transparent;
    background-color: #f6af85;
  }

  /deep/ .nav-link.active {
    color: white;
    background-color: #DA9A74;
    border-color: transparent;
    /*background-color: #FFD1B1 !important;*/
  }

  /deep/ .nav-item {
    margin: 0;
  }

  /deep/ .card-header {
    border-bottom: 0;
  }
  .profile-border {
    border: 1px solid rgba(218, 151, 111, 0.58);
    border-radius: 5px;
    /*box-shadow: 3px 3px 5px grey;*/
  }

  .icon-border {
    border: 1px solid #bfbfbf;
    border-radius: 5px;
  }
  /deep/ .multiselect__tag {
    font-size: 1rem;
  }

  /deep/ .btn-outline-primary {
    border-color: #c68967 !important;
    color: grey;
  }

  /deep/ .btn-outline-primary:hover {
    border-color: #c68967 !important;
    background-color: #de9a73;
    color: white;
  }

  /deep/ .bg-light {
    background-color: #e8e8e8 !important;
  }

  /deep/ .card-header {
    padding-left: 10px;
    padding-top: 0px;
  }

  /deep/ .btn-primary {
    background-color: #de9a73;
    color: white;
    border-color: #c68967 !important;
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }
</style>
