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
                <button style="float: right; border: none" class="btn-secondary btn rounded ml-1" @click="getData"><i class="ti-reload"></i></button>
          </div>
        </div>
      </div>
    </nav>

    <LoadingBar v-show="isLoading" />

    <div class="px-5">
      <div class="row">
        <div class="col-lg-3 col-md-5 col-sm-12 text-center">
          <div class="mt-4 card py-4 px-4" style="height: 773px;">
            <div class="">
              <img :src="user.profilepicture ? user.profilepicture.toString() : require('../assets/blank_profile.png')"
                   style="height: 250px; width: 250px; object-fit: cover" class="profile-border"/>
              <div class="mt-2">
                <span style="font-size: 30px; margin-top: 5px;" >{{user.name}}</span>
              </div>
              <div style="margin-top: -5px;">
                <span style="font-size: 16px; color: grey;">{{user.company}}</span>
              </div>
              <div>
                <button href="#" class="mt-3 pt-2 mr-2 btn btn-primary" @click="profileInputModal"><i
                  class="ti-pencil"></i></button>
                <button href="#" class="mt-3 pt-2 mr-2 btn btn-secondary" v-if="user.role === 'student'"
                        @click="showWindow(user.social.github)"><i class="ti-github"></i></button>
                <button href="#" class="mt-3 pt-2 mr-2 btn btn-secondary" v-if="user.social.linkedin"
                        @click="showWindow(user.social.linkedin)"><i class="ti-linkedin"></i></button>
                <button href="#" class="mt-3 pt-2 mr-2 btn btn-secondary" v-if="user.social.linkedin"
                        @click="showWindow(user.website)"><i class="ti-world"></i></button>
              </div>
              <hr width="100%"/>
              <div style="justify-content: center; text-align: justify; overflow-y: auto; max-height: 300px;" class='px-1'>
                <span style="font-size: 16px; font-style: italic;">{{user.bio}}</span>
<!--                <span style="font-size: 16px; font-style: italic;">{{user.bio.length > 40 ? user.bio.substring(0, 150) + ' ...' : user.bio}}</span>-->
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-9 col-md-6 col-sm-12">
          <div class="mb-5 mt-4 container px-0 mb-5 bg-white rounded" v-if="role === 'student'" style="outline: none !important;">
            <b-card no-body style="border: none;">
              <b-tabs card style="font-size: 16px;">
                <b-tab title="Interests" active style="max-height: 730px; overflow-y: auto; background-color: rgba(196,196,196,0.24)" class="px-0 pt-0">
                  <b-card-body class="p-0 mt-4">
                    <span v-if="user.acceptances.length === 0">You don't have any acceptances! Start applying!</span>
                    <div v-for="(job, idx) in user.acceptances" class="text-left mt-2">
                      <b-card class="text-left my-2 shadow-hover show-hover-indicator" :id="'job' + idx" style="height: 133px; overflow-y: hidden;">
                        <div class="hover-indicator"></div>
                        <div class="row">
                          <div style="" class="col-lg-2 col-md-2 col-sm-12 pr-1">
                            <img style="height: 100px; width: 100px; object-fit: cover;"
                                 :src="job.employer.profilepicture ? job.employer.profilepicture.toString() : require('../assets/company.jpg')"
                                 class="icon-border">
                          </div>
                          <div style="text-align: justify" class="col-lg-8 col-md-8 col-sm-12">
                            <h5 class="card-title title-collapse" @click="expandCollapseInterests(idx, job.collapse, 'job')">{{job.title}}</h5>
                            <div class="row">
                              <div class="col-lg-1 col-md-1 col-sm-12 pr-0">
                                <span class="mt-5" style="margin-right: 4px"><i class="ti-location-pin"></i></span>
                              </div>
                              <div class="col-lg-11 col-md-11 col-sm-12 pl-0">
                                <span style="font-size: 14px;">{{job.location}}</span>
                              </div>
                            </div>
                            <p></p>
                            <div class="row">
                              <div class="col-lg-1 col-md-1 col-sm-12 pr-0">
                                <span class="mt-5" style="margin-right: 4px"><i class="ti-briefcase"></i></span>
                              </div>
                              <div class="col-lg-11 col-md-11 col-sm-12 pl-0">
                                <span style="font-size: 14px;">{{job.position}}</span>
                              </div>
                            </div>
                            <p></p>
                            <div class="row">
                              <div class="col-lg-1" style="width: 10px !important;">
                                <span style="font-weight: bold;"><i class="ti-receipt"></i></span>
                              </div>
                              <div class="col-lg-11 pl-0">
                                <span style="white-space: pre-wrap; font-size: 14px;">{{job.description}}</span>
                              </div>
                            </div>
                            <p></p>
                            <div class="row">
                              <div class="col-lg-1 col-md-1 col-sm-12 pr-0">
                                <span class="mt-5" style="margin-right: 4px"><i class="ti-star"></i></span>
                              </div>
                              <div class="col-lg-11 col-md-11 col-sm-12 pl-0">
                                <span style="font-size: 14px;">{{job.skills.length > 0 ? job.skills.map(s => s.name).join(', ') : 'None'}}</span>
                              </div>
                            </div>
                            <p></p>
                            <div class="row">
                              <div class="col-lg-1 col-md-1 col-sm-12 pr-0">
                                <span class="mt-5" style="margin-right: 4px"><i class=""></i></span>
                              </div>
                              <div class="col-lg-11 col-md-11 col-sm-12 pl-0">
                                <span style="font-size: 14px;">{{job.applicants.length}}</span>
                              </div>
                            </div>
                            <p></p>
                          </div>
                          <div class="col-lg-2 col-md-2 col-sm-1 pr-0">
                            <button href="#" style="margin-top: -5px !important; border: none;"
                                    class="mt-3 pt-2 btn btn-outline-info" @click="messageUserModal(job.employer)"><i
                              class="ti-comment-alt"></i>
                            </button>
                            <button href="#" style="margin-top: -5px !important; border: none;"
                                    class="mt-3 pt-2 ml-2 btn btn-outline-danger"
                                    @click="rejectConfirmedApplicant(job._id, user._id)"><i
                              class="ti-close"></i></button>
                            <button href="#" style="margin-top: -5px !important; border: none;" class="mt-3 pt-2 btn btn-outline-secondary">
                              <i class="ti-angle-down" :id="'icon' + idx + 'job'" @click="expandCollapseInterests(idx, job.collapse, 'job')"></i></button>
                          </div>
                        </div>
                      </b-card>
                    </div>
                  </b-card-body>
                </b-tab>

                <b-tab title="Education" style="max-height: 1000px; overflow-y: auto; background-color: rgba(196,196,196,0.24); box-shadow: none;" class="px-0 pt-0">
                  <b-card-body style="font-size: 16px;" class="px-0">
                    <div v-for="(edu, idx) in user.education" :id="edu.school">
                      <b-card class="mb-3 shadow-hover show-hover-indicator" style="height: 76px; overflow-y: hidden;" :id="'edu' + idx">
                        <div class="hover-indicator"></div>
                        <button href="#" style="float: right; margin-top: -7px !important; border: none;" class="mt-3 pt-2 ml-2 btn btn-outline-secondary">
                          <i class="ti-angle-down" :id="'icon' + idx + 'edu'" @click="expandCollapseEdu(idx, edu.collapse, 'edu')"></i></button>
                        <button style="float: right; border: none; margin-top: -5px !important;"
                                class="btn btn-outline-danger ml-2"
                                @click="deleteEducation(edu)"><i class="ti-close"></i></button>
                        <button style="float: right; border: none; margin-top: -7px !important;"
                                class="btn btn-outline-secondary"
                                @click="editEducationModal(edu)"><i class="ti-pencil"></i></button>
                      <h5 class="card-title title-collapse" @click="expandCollapseEdu(idx, edu.collapse, 'edu')">{{edu.school}} </h5>
                        <hr width="100%" align="left" />
                        <div class="row">
                          <div class="px-3">
                            <span><i class="ti-bookmark-alt"></i></span>
                          </div>
                          <div class="col-lg-11 col-md-11 col-sm-12 pl-0">
                            <span style="font-size: 14px;">{{edu.degree +', ' +  edu.fieldofstudy}}</span>
                          </div>
                        </div>
                        <p></p>
                        <div class= "row">
                          <div class="px-3">
                            <span><i class="ti-time"></i></span>
                          </div>
                          <div class="col-lg-11 col-md-11 col-sm-12 pl-0">
                            <span style="font-size: 14px;">{{formatDate(edu.from)}} - {{formatDate(edu.to)}} </span>
                          </div>
                        </div>
                        <p></p>
                      </b-card>
                    </div>
                    <div class="text-right">
                      <button
                        v-if="role === 'student'"
                        style="width: 100%; border-radius: 5px;"
                        class="mb-2 mt-1 btn btn-primary w-25"
                        @click="addEducationModal"
                      >
                        Add
                      </button>
                    </div>
                  </b-card-body>

                </b-tab>

                <b-tab title="Experiences" style="max-height: 1000px; overflow-y: auto; background-color: rgba(196,196,196,0.24); box-shadow: none;" class="px-0 pt-0">
                  <b-card-body style="font-size: 16px;" class="px-0">
                    <div v-for="(exp, idx) in user.experience">
                      <b-card class="mb-3 shadow-hover show-hover-indicator" style="height: 73px; overflow-y: hidden;" :id="'exp' + idx">
                        <div class="hover-indicator"></div>
                        <div class="row">
                          <div class="col-lg-10 col-md-11 col-sm-12">
                            <h5 class="card-title title-collapse" @click="expandCollapseExp(idx, exp.collapse, 'exp')">{{exp.company}}</h5>
                          </div>
                          <div class="col-lg-2 col-md-2 col-sm-12 pl-0">
                            <button href="#" style="float: right; margin-top: -7px !important; border: none;" class="mt-3 pt-2 ml-2 btn btn-outline-secondary">
                              <i class="ti-angle-down" :id="'icon' + idx + 'exp'" @click="expandCollapseExp(idx, exp.collapse, 'exp')"></i></button>
                            <button style="float: right; border: none; margin-top: -5px;" class="btn btn-outline-danger ml-2"
                                    @click="deleteExperience(exp)"><i class="ti-close"></i></button>
                            <button style="float: right; border: none; margin-top: -7px;" class="btn btn-outline-secondary"
                                    @click="editExperienceModal(exp)"><i class="ti-pencil"></i></button>
                          </div>
                        </div>
                        <hr width="100%" align="left" class="mt-0"/>
                        <p></p>
                        <div class="row">
                          <div class="px-3">
                            <span><i class="ti-briefcase"></i></span>
                          </div>
                          <div class="col-lg-11 col-md-11 col-sm-12 pl-0">
                            <span style="font-size: 14px;">{{exp.title}}</span>
                          </div>
                        </div>
                        <p></p>
                        <div class="row">
                          <div class="px-3">
                            <span><i class="ti-location-pin"></i></span>
                          </div>
                          <div class="col-lg-11 col-md-11 col-sm-12 pl-0">
                            <span style="font-size: 14px;">{{exp.location}}</span>
                          </div>
                        </div>
                        <p></p>
                        <div class="row">
                          <div class="px-3">
                            <span><i class="ti-time"></i></span>
                          </div>
                          <div class="col-lg-11 col-md-11 col-sm-12 pl-0">
                            <span style="font-size: 14px;">{{formatDate(exp.from) }} - {{formatDate(exp.to)}}</span>
                          </div>
                        </div>
                        <p></p>
                        <div class="row">
                          <div class="px-3">
                            <span><i class="ti-receipt"></i></span>
                          </div>
                          <div class="col-lg-11 col-md-11 col-sm-12 pl-0">
                            <span style="text-align: justify; font-size: 14px;">{{exp.description}}</span>
                          </div>
                        </div>
                        <p></p>
                      </b-card>
                    </div>
                    <div class="text-right">
                      <button
                        v-if="role === 'student'"
                        style="width: 100%; border-radius: 5px;"
                        class="mb-2 mt-1 btn btn-primary w-25"
                        @click="addExperienceModal"
                      >
                        Add
                      </button>
                    </div>
                  </b-card-body>
                </b-tab>

                <b-tab title="Honor" style="max-height: 1000px; overflow-y: auto; background-color: rgba(196,196,196,0.24); box-shadow: none;" class="px-0 pt-0">
                  <b-card-body style="font-size: 16px;" class="px-0">
                    <div v-for="(hon, idx) in user.honor">
                      <b-card class="mb-3 shadow-hover show-hover-indicator" style="height: 73px; overflow-y: hidden;" :id="'hon' + idx">
                        <div class="hover-indicator"></div>
                        <div class="row">
                          <div class="col-lg-10 col-md-11 col-sm-12">
                            <h5 class="card-title title-collapse" @click="expandCollapseHon(idx, hon.collapse, 'hon')">{{hon.title}}</h5>
                          </div>
                          <div class="col-lg-2 col-md-2 col-sm-12 pl-0">
                            <button href="#" style="float: right; margin-top: -7px !important; border: none;" class="mt-3 pt-2 ml-2 btn btn-outline-secondary">
                              <i class="ti-angle-down" :id="'icon' + idx + 'hon'" @click="expandCollapseHon(idx, hon.collapse, 'hon')"></i></button>
                            <button style="float: right; border: none; margin-top: -5px;" class="btn btn-outline-danger ml-2"
                                    @click="deleteHonor(hon)"><i class="ti-close"></i></button>
                            <button style="float: right; border: none; margin-top: -7px;" class="btn btn-outline-secondary"
                                    @click="editHonorModal(hon)"><i class="ti-pencil"></i></button>
                          </div>
                        </div>
                        <hr width="100%" align="left" class="mt-0"/>
                        <p></p>
                        <div class="row">
                          <div class="px-3">
                            <span><i class="ti-location-pin"></i></span>
                          </div>
                          <div class="col-lg-11 col-md-11 col-sm-12 pl-0">
                            <span style="font-size: 14px;">{{hon.issuer}}</span>
                          </div>
                        </div>
                        <p></p>
                        <div class="row">
                          <div class="px-3">
                            <span><i class="ti-time"></i></span>
                          </div>
                          <div class="col-lg-11 col-md-11 col-sm-12 pl-0">
                            <span style="font-size: 14px;">{{formatDate(hon.issueDate) }} </span>
                          </div>
                        </div>
                        <p></p>
                        <div class="row">
                          <div class="px-3">
                            <span><i class="ti-receipt"></i></span>
                          </div>
                          <div class="col-lg-11 col-md-11 col-sm-12 pl-0">
                            <span style="text-align: justify; font-size: 14px;">{{hon.description}}</span>
                          </div>
                        </div>
                        <p></p>
                      </b-card>
                    </div>
                    <div class="text-right">
                      <div class="text-right">
                        <button
                          v-if="role === 'student'"
                          style="width: 100%; border-radius: 5px;"
                          class="mb-2 mt-1 btn btn-primary w-25"
                          @click="addHonorModal"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </b-card-body>
                </b-tab>
                <b-tab title="Certification" style="max-height: 1000px; overflow-y: auto; background-color: rgba(196,196,196,0.24); box-shadow: none;" class="px-0 pt-0">
                  <b-card-body style="font-size: 16px;" class="px-0">
                    <div v-for="(cert, idx) in user.certification">
                      <b-card class="mb-3 shadow-hover show-hover-indicator" style="height: 73px; overflow-y: hidden;" :id="'cert' + idx">
                        <div class="hover-indicator"></div>
                        <div class="row">
                          <div class="col-lg-10 col-md-11 col-sm-12">
                            <h5 class="card-title title-collapse" @click="expandCollapseCert(idx, cert.collapse, 'cert')">{{cert.title}}</h5>
                          </div>
                          <div class="col-lg-2 col-md-2 col-sm-12 pl-0">
                            <button href="#" style="float: right; margin-top: -7px !important; border: none;" class="mt-3 pt-2 ml-2 btn btn-outline-secondary">
                              <i class="ti-angle-down" :id="'icon' + idx + 'cert'" @click="expandCollapseCert(idx, cert.collapse, 'cert')"></i></button>
                            <button style="float: right; border: none; margin-top: -5px;" class="btn btn-outline-danger ml-2"
                                    @click="deleteCertification(cert)"><i class="ti-close"></i></button>
                            <button style="float: right; border: none; margin-top: -7px;" class="btn btn-outline-secondary"
                                    @click="editCertificationModal(cert)"><i class="ti-pencil"></i></button>
                          </div>
                        </div>
                        <hr width="100%" align="left" class="mt-0"/>
                        <p></p>
                        <div class="row">
                          <div class="px-3">
                            <span><i class="ti-location-pin"></i></span>
                          </div>
                          <div class="col-lg-11 col-md-11 col-sm-12 pl-0">
                            <span style="font-size: 14px;">{{cert.issuer}}</span>
                          </div>
                        </div>
                        <p></p>
                        <div class="row">
                          <div class="px-3">
                            <span><i class="ti-time"></i></span>
                          </div>
                          <div class="col-lg-11 col-md-11 col-sm-12 pl-0">
                            <span style="font-size: 14px;">{{formatDate(cert.issueDate)}}  - {{formatDate(cert.expiryDate)}} </span>
                          </div>
                        </div>
                        <p></p>
                        <div class="row">
                          <div class="px-3">
                            <span><i class="ti-receipt"></i></span>
                          </div>
                          <div class="col-lg-11 col-md-11 col-sm-12 pl-0">
                            <span style="text-align: justify; font-size: 14px;">{{cert.description}}</span>
                          </div>
                        </div>
                        <p></p>
                      </b-card>
                    </div>
                    <div class="text-right">
                      <button
                        v-if="role === 'student'"
                        style="border-radius: 5px;"
                        class="mb-2 mt-1 btn btn-outline-primary w-25"
                        @click="addCertificationModal"
                      >
                        Add
                      </button>
                    </div>
                  </b-card-body>
                </b-tab>

                <b-tab title="Skills" style="max-height: 1000px; overflow-y: auto; min-height: 400px; background-color: rgba(196,196,196,0.24); box-shadow: none;" class="px-0 pt-0">
                 <div class="card px-0 mt-3" >
                   <b-card-body style="font-size: 16px;">
                     <b-form class="text-left">
                       <label>Add/Remove Skills:</label>
                       <b-form-group>
                         <SkillSelect @addSkills="addSkills" :recievedValues="user.skills" class="mb-2"/>
                         <div class="text-right">
                           <button class="btn btn-outline-primary w-25 mt-4" @click.prevent="updateSkills"
                                   style="border-radius: 5px;">Save
                           </button>
                         </div>
                       </b-form-group>
                     </b-form>
                   </b-card-body>
                 </div>
                </b-tab>
              </b-tabs>
            </b-card>
          </div>

          <div class="mb-5 mt-4 container px-0 mb-5 bg-white rounded" v-if="role === 'employer'" style="outline: none !important;">
            <b-card no-body style="border: none;">
              <b-tabs card style="font-size: 16px;">
                <b-tab title="Job Posting" active style="max-height: 1000px; overflow-y: auto; background-color: rgba(196,196,196,0.24); box-shadow: none;" class="px-0 pt-0" >
                  <b-card-body class="py-2 px-0">
                    <b-input-group class="mb-3 w-100">
                      <b-form-input placeholder="Search for job" v-model="employerSearchJob" style="font-weight: 300;"></b-form-input>
                      <b-input-group-append>
                        <button class="btn btn-primary"><i class="ti-search"></i></button>
                      </b-input-group-append>
                    </b-input-group>
                    <div v-for="(job, idx) in employerJobs">
                      <b-card class="text-left my-2 card-collapse shadow-hover"
                              style="height: 136px; overflow-y: hidden; background-color: #fdfdfd" :id="idx">
                        <div class="row">
                          <div style="" class="col-lg-2 col-md-2 col-sm-12 pr-1">
                            <img style="height: 100px; width: 100px; object-fit: cover;" class="icon-border"
                                 :src="user.profilepicture ? user.profilepicture.toString() : require('../assets/company.jpg')">
                          </div>
                          <div style="text-align: justify" class="col-lg-7 col-md-7 col-sm-12">
                            <h5 class="card-title title-collapse" @click="expandCollapseItem(idx, job.collapse, job._id)">{{job.title}}</h5>
                            <div class="row">
                              <div class="col-lg-1 col-md-1 col-sm-12 pr-0">
                                <span class="mt-5" style="margin-right: 4px"><i class="ti-location-pin"></i></span>
                              </div>
                              <div class="col-lg-11 col-md-11 col-sm-12 pl-0">
                                <span style="font-size: 14px;">{{job.location}}</span>
                              </div>
                            </div>
                            <p></p>
                            <div class="row">
                              <div class="col-lg-1 col-md-1 col-sm-12 pr-0">
                                <span class="mt-5" style="margin-right: 4px"><i class="ti-briefcase"></i></span>
                              </div>
                              <div class="col-lg-11 col-md-11 col-sm-12 pl-0">
                                <span style="font-size: 14px;">{{job.position}}</span>
                              </div>
                            </div>
                            <p></p>
                            <div class="row">
                              <div class="col-lg-1 col-md-1 col-sm-12 pr-0">
                                <span class="mt-5" style="margin-right: 4px"><i class="ti-star"></i></span>
                              </div>
                              <div class="col-lg-11 col-md-11 col-sm-12 pl-0">
                                <span style="font-size: 14px;">{{job.skills.length > 0 ? job.skills.map(s => s.name).join(', ') : 'None'}}</span>
                              </div>
                            </div>
                            <p></p>
                            <div class="row">
                              <div class="col-lg-1 col-md-1 col-sm-12 pr-0" style="width: 10px !important;">
                                <span style="font-weight: bold;"><i class="ti-receipt"></i></span>
                              </div>
                              <div class="col-lg-11 pl-0">
                                <span style="white-space: pre-wrap; font-size: 14px;">{{job.description}}</span>
                              </div>
                            </div>
                            <p></p>
                            <div class="row">
                              <div class="col-lg-1 col-md-1 col-sm-12 pr-0">
                                <span class="mt-5" style="margin-right: 4px"><i class="ti-stats-up"></i></span>
                              </div>
                              <div class="col-lg-11 col-md-11 col-sm-12 pl-0">
                                <span style="font-size: 14px;">{{job.applicants.length}}</span>
                              </div>
                            </div>
                            <p></p>
                          </div>
                          <div class="col-lg-3 col-md-3 col-sm-12">
                            <button href="#" style="float: right; margin-top: -2px !important; border: none;" class="mt-3 pt-2 ml-2 btn btn-outline-secondary">
                              <i class="ti-angle-down" :id="'icon' + idx + job._id" @click="expandCollapseItem(idx, job.collapse, job._id)"></i></button>
                            <button href="#" style="float: right; margin-top: -2px !important; border: none;"
                                    class="mt-3 pt-2 ml-2 btn btn-outline-danger" @click="deleteConfirmModal(job)"><i
                              class="ti-close"></i></button>
                            <button href="#" style="float: right; margin-top: -2px !important; border: none;"
                                    class="mt-3 pt-2 btn btn-outline-info" @click="jobInfoModal(job)"><i
                              class="ti-pencil"></i>
                            </button>
                          </div>
                        </div>
                      </b-card>
                    </div>
                    <div class="text-right">
                      <button
                        @click="jobInputModal"
                        v-if="role === 'employer'"
                        style="border-radius: 5px;"
                        class="mt-2 btn btn-primary w-25"
                      >
                        Post Job
                      </button>
                    </div>
                  </b-card-body>
                </b-tab>
                <b-tab title="Applicants" style="max-height: 1000px; overflow-y: auto; background-color: rgba(196,196,196,0.24); box-shadow: none;" class="px-0 pt-0">
                  <b-card-body class="px-0 pt-0">
                    <div v-for="(job, jidx) in user.jobs">
                      <div v-for="(user, idx) in job.confirmed_users">
                        <b-card class="text-left shadow-hover my-2" style="height: 76px; overflow-y: hidden;" :id="'applicant' + idx + jidx">
                          <button href="#" style="float: right; margin-top: -5px !important; border: none;" class="mt-3 pt-2 btn btn-outline-secondary"><i class="ti-angle-down" :id="'applicant' + 'icon' + idx + jidx" @click="expandCollapseApplicants(idx, jidx, user.collapse, 'applicant')"></i></button>
                          <button href="#" style="float: right; margin-top: -5px !important; border: none;" class="mt-3 pt-2 ml-2 btn btn-outline-danger" @click="rejectConfirmedApplicant(job._id, user._id)"><i class="ti-close"></i></button>
                          <button href="#" style="float: right; margin-top: -5px !important; border: none;" class="mt-3 pt-2 ml-2 btn btn-outline-info"><i class="ti-comment-alt" @click="messageUserModal(user)"></i></button>
                          <h5 class="card-title user-hover  mt-1" style="cursor: pointer; font-weight: 300;" @click="applicantDataModal(user)">{{user.name}}</h5>
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
    <HomePageUserModal :showModal="showApplicantData" @hideModal="hideHomePageUserModal" :user="applicantData" :showButtons="false"/>
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
import LoadingBar from './LoadingBar'

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
    MessageUserModal,
    LoadingBar
  },
  data () {
    return {
      isLoading: true,
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
        document.getElementById(idx).style.height = '136px'
        // document.getElementById(idx).style.transition = 'height 0.5s ease-in 0s'
        document.getElementById('icon' + idx + jobId).classList.remove('ti-angle-up')
        document.getElementById('icon' + idx + jobId).classList.add('ti-angle-down')
      } else {
        this.employerJobs[idx].collapse = true
        document.getElementById(idx).style.height = '100%'
        document.getElementById('icon' + idx + jobId).classList.remove('ti-angle-down')
        document.getElementById('icon' + idx + jobId).classList.add('ti-angle-up')
        // document.getElementById(idx).style.transition = 'height 0.5s ease-in 0s'
      }
    },
    expandCollapseExp (idx, collapse, param) {
      if (collapse) {
        this.user.experience[idx].collapse = false
        document.getElementById(param + idx).style.height = '73px'
        document.getElementById('icon' + idx + param).classList.remove('ti-angle-up')
        document.getElementById('icon' + idx + param).classList.add('ti-angle-down')
        // document.getElementById(param + idx).style.transition = 'height 0.5s ease-in 0s'
      } else {
        this.user.experience[idx].collapse = true
        document.getElementById(param + idx).style.height = '100%'
        // document.getElementById(param + idx).style.transition = 'height 0.5s ease-in 0s'
        document.getElementById('icon' + idx + param).classList.remove('ti-angle-down')
        document.getElementById('icon' + idx + param).classList.add('ti-angle-up')
      }
    },
    expandCollapseHon (idx, collapse, param) {
      if (collapse) {
        this.user.honor[idx].collapse = false
        document.getElementById(param + idx).style.height = '73px'
        document.getElementById('icon' + idx + param).classList.remove('ti-angle-up')
        document.getElementById('icon' + idx + param).classList.add('ti-angle-down')
        // document.getElementById(param + idx).style.transition = 'height 0.5s ease-in 0s'
      } else {
        this.user.honor[idx].collapse = true
        document.getElementById(param + idx).style.height = '100%'
        // document.getElementById(param + idx).style.transition = 'height 0.5s ease-in 0s'
        document.getElementById('icon' + idx + param).classList.remove('ti-angle-down')
        document.getElementById('icon' + idx + param).classList.add('ti-angle-up')
      }
    },
    expandCollapseCert (idx, collapse, param) {
      if (collapse) {
        this.user.certification[idx].collapse = false
        document.getElementById(param + idx).style.height = '73px'
        document.getElementById('icon' + idx + param).classList.remove('ti-angle-up')
        document.getElementById('icon' + idx + param).classList.add('ti-angle-down')
        // document.getElementById(param + idx).style.transition = 'height 0.5s ease-in 0s'
      } else {
        this.user.certification[idx].collapse = true
        document.getElementById(param + idx).style.height = '100%'
        // document.getElementById(param + idx).style.transition = 'height 0.5s ease-in 0s'
        document.getElementById('icon' + idx + param).classList.remove('ti-angle-down')
        document.getElementById('icon' + idx + param).classList.add('ti-angle-up')
      }
    },
    expandCollapseEdu (idx, collapse, param) {
      if (collapse) {
        this.user.education[idx].collapse = false
        document.getElementById(param + idx).style.height = '76px'
        // document.getElementById(param + idx).style.transition = 'height 0.5s ease-in 0s'
        document.getElementById('icon' + idx + param).classList.remove('ti-angle-up')
        document.getElementById('icon' + idx + param).classList.add('ti-angle-down')
      } else {
        this.user.education[idx].collapse = true
        document.getElementById(param + idx).style.height = '100%'
        // document.getElementById(param + idx).style.transition = 'height 0.5s ease-in 0s'
        document.getElementById('icon' + idx + param).classList.remove('ti-angle-down')
        document.getElementById('icon' + idx + param).classList.add('ti-angle-up')
      }
    },
    expandCollapseInterests (idx, collapse, param) {
      if (collapse) {
        this.user.acceptances[idx].collapse = false
        document.getElementById(param + idx).style.height = '133px'
        document.getElementById('icon' + idx + param).classList.remove('ti-angle-up')
        document.getElementById('icon' + idx + param).classList.add('ti-angle-down')
        // document.getElementById(param + idx).style.transition = 'height 0.5s ease-in 0s'
      } else {
        this.user.acceptances[idx].collapse = true
        document.getElementById(param + idx).style.height = '100%'
        // document.getElementById(param + idx).style.transition = 'height 0.5s ease-in 0s'
        document.getElementById('icon' + idx + param).classList.remove('ti-angle-down')
        document.getElementById('icon' + idx + param).classList.add('ti-angle-up')
      }
    },
    expandCollapseApplicants (idx, jobIdx, collapse, param) {
      if (collapse) {
        this.user.jobs[jobIdx].confirmed_users[idx].collapse = false
        document.getElementById(param + idx + jobIdx).style.height = '76px'
        // document.getElementById(param + idx + jobIdx).style.transition = 'height 0.5s ease-in 0s'
        document.getElementById(param + 'icon' + idx + jobIdx).classList.remove('ti-angle-up')
        document.getElementById(param + 'icon' + idx + jobIdx).classList.add('ti-angle-down')
      } else {
        this.user.jobs[jobIdx].confirmed_users[idx].collapse = true
        document.getElementById(param + idx + jobIdx).style.height = '100%'
        // document.getElementById(param + idx + jobIdx).style.transition = 'height 0.5s ease-in 0s'
        document.getElementById(param + 'icon' + idx + jobIdx).classList.remove('ti-angle-down')
        document.getElementById(param + 'icon' + idx + jobIdx).classList.add('ti-angle-up')
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
        return this.$moment(date).format('MMM D, YYYY')
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
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!'
      })
        .then((willDelete) => {
          if (willDelete.value) {
            var headers = {
              // Authorization: 'Bearer ' + localStorage.getItem('jwtToken').substring(4, localStorage.getItem('jwtToken').length)
            }
            axios.delete(`${url}/api/jobs/${job._id}`, {headers: headers})
              .then(response => {
                this.$swal({
                  position: 'bottom-right',
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
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!'
      })
        .then((willDelete) => {
          if (willDelete.value) {
            var headers = {
              // Authorization: 'Bearer ' + localStorage.getItem('jwtToken').substring(4, localStorage.getItem('jwtToken').length)
            }

            axios.delete(`${url}/api/profile/experience/${exp._id}`, {headers: headers})
              .then(response => {
                this.$swal({
                  position: 'bottom-right',
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
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!'
      })
        .then((willDelete) => {
          if (willDelete.value) {
            var headers = {
              // Authorization: 'Bearer ' + localStorage.getItem('jwtToken').substring(4, localStorage.getItem('jwtToken').length)
            }
            axios.delete(`${url}/api/profile/education/${edu._id}`, {headers: headers})
              .then(response => {
                this.$swal({
                  position: 'bottom-right',
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
              // Authorization: 'Bearer ' + localStorage.getItem('jwtToken').substring(4, localStorage.getItem('jwtToken').length)
            }

            axios.delete(`${url}/api/profile/honor/${hon._id}`, {headers: headers})
              .then(response => {
                this.$swal({
                  position: 'bottom-right',
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
              // Authorization: 'Bearer ' + localStorage.getItem('jwtToken').substring(4, localStorage.getItem('jwtToken').length)
            }

            axios.delete(`${url}/api/profile/certification/${cert._id}`, {headers: headers})
              .then(response => {
                this.$swal({
                  position: 'bottom-right',
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
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!'
      })
        .then((willDelete) => {
          if (willDelete.value) {
            var headers = {
              // Authorization: 'Bearer ' + localStorage.getItem('jwtToken').substring(4, localStorage.getItem('jwtToken').length)
            }

            axios.patch(`${url}/api/jobs/rejectconfirmedapplicant`, {job: job_id, user: user_id}, {headers: headers})
              .then(response => {
                this.$swal({
                  position: 'bottom-right',
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
        // Authorization: 'Bearer ' + localStorage.getItem('jwtToken').substring(4, localStorage.getItem('jwtToken').length)
      }

      axios.post(`${url}/api/profile/skills`, {
        data: this.skillsToUpdate,
        user: {id: this.user._id}
      }, {headers: headers})
        .then(response => {
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
          this.getData()
        })
        .catch(e => {
          console.log(e)
        })
    },
    getData () {
      var headers = {
        // Authorization: 'Bearer ' + localStorage.getItem('jwtToken').substring(4, localStorage.getItem('jwtToken').length)
      }

      this.isLoading = true

      axios.get(`${url}/api/user/${this.user_id}`, {headers: headers})
        .then(response => {
          this.isLoading = false
          this.user = response.data
          this.user.jobs.forEach(job => {
            job.collapse = false
            job.confirmed_users.forEach(user => {
              user.collapse = false
            })
          })
          this.user.experience.forEach(exp => {
            exp.collapse = false
          })
          this.user.education.forEach(edu => {
            edu.collapse = false
          })
          if (this.user.acceptances.length > 0) {
            this.user.acceptances.forEach(acc => {
              acc.collapse = false
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
    transition: height 0.5s;
  }

  .shadow-hover:hover {
    /*outline: 10px solid #f6af85;*/
    /*outline-offset: -10px;*/
    border-color: #DA9A74;
    border-width: 1px;
    background-color: rgb(255, 246, 242) !important;
    box-shadow: 1px 2px 5px #bdbdbd;
    transition: all 0.5s;
  }
  .hover-indicator{
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    /*width: 10px;*/
    background-color: #DA9A74 !important;
    display: none;
    transition: all 0.5s;
  }

  .show-hover-indicator:hover .hover-indicator{
    display: block;    transition: all 0.5s;

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
    background-color: #3e3e3e !important;
    border-radius: 5px !important;
    /*background-color: rgba(255, 187, 138, 0.61) !important;*/
  }

  /deep/ .nav-link {
    border-bottom-left-radius: 5px !important;
    /*color: #88491C*/
    color: white !important;
    font-weight: 300 !important;
  }

  /deep/ .nav-link:hover {
    border-color: transparent !important;
    background-color: #f6af85 !important;
  }

  /deep/ .nav-link.active {
    color: white !important;
    background-color: #DA9A74 !important;
    border-color: transparent !important;
    /*background-color: #FFD1B1 !important;*/
  }

  /deep/ .nav-item {
    margin: 0 !important;
  }

  /deep/ .card-header {
    border-bottom: 0 !important;
  }
  .profile-border {
    border: 4px solid rgba(227, 222, 222, 0.69);
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
    color: grey !important;
    border: 1px solid #c68967 !important;
  }

  /deep/ .btn-outline-primary:hover {
    border: 1px solid #c68967;
    background-color: #de9a73 !important;
    color: white !important;
  }

  /deep/ .bg-light {
    background-color: rgba(202, 202, 202, 0.98) !important;
    /*background-color: #e1e1e1 !important;*/
  }

  /deep/ .card-header {
    padding-left: 10px;
    padding-top: 0;
  }

  /deep/ .btn-primary {
    background-color: #de9a73 !important;
    color: white !important;
    border-color: #de9a73 !important;
  }

  /deep/ .btn-primary:active {
    outline: none !important;
    background-color: #b07a5b !important;
    color: white !important;
    border-color: #de9a73 !important;
  }

  /deep/ .btn-primary:hover {
    background-color: #cf906b !important;
    color: white !important;
    border-color: #cf906b !important;
  }

  h5 {
    font-size: 16px;
    font-weight: 400;
  }
</style>
