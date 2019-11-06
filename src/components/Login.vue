<template>
  <div>
      <div style="height: 100vh; position: relative; ">
      <div id="video_overlays"></div>
      <video autoplay loop muted id="video" style="width: 100%; height: auto; position: absolute; z-index: -2;">
        <source src="../assets/lv2.mp4" type="video/mp4">
      </video>
      <div class="container">
        <div style="display: block;">
          <div class="mt-4">
            <b-card style="border-radius: 8px !important; background-color: rgb(252,252,252); max-height: 720px; overflow-y: auto; transition: all 0.5s;">
              <div class="text-center big-title">
                <span class="px-2 logo-noq">noQ</span>
              </div>
              <p class="text-center mt-1" style="font-size: 15px; color: gray">Making Career Fairs Easier</p>
              <hr />
              <div style="width: 400px;">
                <b-tabs content-class="mt-3" v-model="tabIndex" >
                  <b-tab :title="forgotPassword ? 'Forgot Password' : 'Login'">
                    <div v-if="error">
                      <b-alert show :variant="variant" v-html="error"></b-alert>
                    </div>
                      <div class="text-center mt-4" v-if="!forgotPassword">
                        <a class="btn btn-md light linkedin-btn" @click="linkedInLogin" style="background-color: #597ca0; color: white;">Linked <i class="ti-linkedin"></i></a>
                      </div>
                      <div class="center-separator my-3 mt-4" v-if="!forgotPassword">
                        or
                      </div>
                      <b-form>
                        <label class="smaller-font">Email</label>
                        <b-form-group id="fieldsetHorizontal">
                          <b-form-input id="username" v-model.trim="login.username"></b-form-input>
                        </b-form-group>
                        <label v-if="!forgotPassword" class="smaller-font">Password</label>
                        <b-form-group id="fieldsetHorizontal"
                                      v-if="!forgotPassword"
                                      class="mb-2 smaller-font"
                                      >
                          <b-form-input type="password" id="password" v-model.trim="login.password" ></b-form-input>
                        </b-form-group>
                        <button type="submit" class="mt-3 mb-3 btn-outline-primary" style="width: 100%; height: 35px; border-radius: 5px" @click.prevent="onSubmit" v-if="!forgotPassword">{{forgotPassword ? 'Reset Password' : 'Login'}}</button>
                        <button type="submit" class="mt-1 mb-3 btn-outline-primary" style="width: 100%; height: 35px; border-radius: 10px" @click.prevent="resetPassword" v-else>{{forgotPassword ? 'Reset Password' : 'Login'}}</button>
                        <div class="align-content-center ">
                          <div class="g-recaptcha" id="recaptcha" style="margin-left: 45px;" data-sitekey="6Lf7Ab4UAAAAAMD1Px2wHu6_LKXPd2b02BNTPfBs"></div>
                        </div>
                        <hr class="mb-2"/>
                        <a href="" class="text-muted mt-0" @click.prevent="forgotPassword = !forgotPassword">{{forgotPassword ? 'Back' : 'Forgot Password?'}}</a>
                        <br />
                        <a href="" class="text-muted" @click.prevent="changeTab(1)" v-if="!forgotPassword">Don't have an account?</a>
                      </b-form>
                  </b-tab>
                  <b-tab title="Register">
                    <Register @registered="registration_completed" @linkedin="linkedInLogin"/>
                  </b-tab>
                </b-tabs>
              </div>
            </b-card>
          </div>
          <div class="mt-5 pt-5 text-center">
            <a class="align-bottom" href="#"><i class="arrow down down-arrow"></i></a>
          </div>
        </div>
      </div>
    </div>
    <!-- WHAT DO WE OFFER -->
    <div style="background-color: white; align-items: center; padding-bottom: 20px;" class="pt-4 pb-5">
      <div class="text-center big-title" style="color: black;">
        What do we offer?
        <hr style="width: 50%"/>
      </div>

      <div>
        <div class="row mt-5" style="align-items: center" >
          <div class="col-lg-4 col-xs-1 col-sm-2 text-center" >
            <img src="../assets/job.png" class="mb-4"/>
            <br />
            <span class="offer-title">Efficient Job Matching</span>
            <br />
            <div class="px-5 pt-2">
            <span class="offer-description">A matching based system to efficiently get paired up with jobs or students that suit
              you the best, based on your skills.
            </span>
            </div>
          </div>
          <div class="col-lg-4 col-xs-1 col-sm-1 col-md-2 text-center" >
            <img src="../assets/filter.png" class="mb-4"/>
            <br />
            <span class="offer-title">Discover Filtering</span>
            <br />
            <div class="px-5 pt-2">
            <span class="offer-description">Companies and organizations are filtered based on their requirements and a student's skillset
            </span>
            </div>
          </div>
          <div class="col-lg-4 col-xs-1 col-sm-1 col-md-2 text-center" >
            <img src="../assets/chat.png" class="mb-4"/>
            <br />
            <span class="offer-title">Seamless Communication</span>
            <br />
            <div class="px-5 pt-2">
            <span class="offer-description">An efficient chatting system to set up interviews, meetings etc.
            </span>
            </div>
          </div>
        </div>
        <div class="row mt-5 " style="align-items: center" >
          <div class="col-lg-4 col-xs-1 col-sm-2 text-center" >
            <img src="../assets/profile.png" class="mb-4"/>
            <br />
            <span class="offer-title">Profile Builder</span>
            <br />
            <div class="px-5 pt-2">
            <span class="offer-description"> An intuitive profile builder for organization and students to convey valuable information
            </span>
            </div>
          </div>
          <div class="col-lg-4 col-xs-1 col-sm-1 col-md-2 text-center" >
            <img src="../assets/queue.png" class="mb-4"/>
            <br />
            <span class="offer-title">Queue Reduction</span>
            <br />
            <div class="px-5 pt-2">
            <span class="offer-description"> Drastically reducing queues at career fairs by pre-matching students to employers.
            </span>
            </div>
          </div>
          <div class="col-lg-4 col-xs-1 col-sm-1 col-md-2 text-center" >
            <img src="../assets/posting.png" class="mb-4"/>
            <br />
            <span class="offer-title">Easy Job Posting</span>
            <br />
            <div class="px-5 pt-2">
            <span class="offer-description"> An easy way for organizations to post jobs to look for potential employers.
            </span>
            </div>
          </div>
        </div>

      </div>
    </div>
    <div style="background-color: #fff0e0; align-items: center" class="pt-4 pb-5">
      <div class="text-center big-title" style="color: black">
        Our Team
        <hr style="width: 50%"/>
      </div>
      <!-- OUR TEAM -->
      <div class="px-5">
        <div class="row" style="align-items: center;" >
          <div class="col-lg-3 col-xs-1 col-sm-1 col-md-2 text-center p-5" >
            <b-card
              title="Cole Norton"
              sub-title="Indiana University"
            >
              <hr width="50%"/>
              <b-card-text>colen81@iu.edu</b-card-text>
              <b-card-text></b-card-text>
            </b-card>
          </div>
          <div class="col-lg-3 col-xs-1 col-sm-1 col-md-2 text-center  p-5" >
           <b-card
             title="H Paul"
             sub-title="Indiana University"
           >
             <hr width="50%"/>
             <b-card-text>Graduate, Computer Science</b-card-text>
             <b-card-text>hrpaul@iu.edu</b-card-text>
           </b-card>
          </div>

          <div class="col-lg-3 col-xs-1 col-sm-1 col-md-2 text-center p-5" >
            <b-card
              title="Rui Zhang"
              sub-title="Indiana University"
            >
              <hr width="50%"/>
              <b-card-text>Junior, Computer Science</b-card-text>
              <b-card-text>rz1@iu.edu</b-card-text>
            </b-card>
          </div>
          <div class="col-lg-3 col-xs-1 col-sm-1 col-md-2 text-center p-5" >
            <b-card
              title="Sharanya R"
              sub-title="Indiana University"
            >
              <hr width="50%"/>
              <b-card-text>Graduate, Computer Science</b-card-text>
              <b-card-text>sharavi@iu.edu</b-card-text>
            </b-card>
          </div>
        </div>
      </div>
    </div>
    <div style="background-color: #6c757d;" class="p-3 text-center">
      <span style="color: white;">A Project by students from Indiana University, Bloomington</span>
    </div>

  </div>

</template>

<script>
import axios from 'axios'
import Register from './Register'
import url from '../config/server_config'
export default {
  name: 'Login',
  data () {
    return {
      login: {},
      error: '',
      tabIndex: 0,
      variant: 'danger',
      forgotPassword: false
    }
  },
  mounted () {
    document.getElementById("main").style.marginLeft = "0";
    grecaptcha.render("recaptcha", {
            sitekey: '6Lf7Ab4UAAAAAMD1Px2wHu6_LKXPd2b02BNTPfBs',
        })
  },
  components: {
    Register,
    // Recaptcha
  },
  watch: {
    tabIndex (val) {
      this.error = ''
    },
    error (val) {
      if (val) {
        setTimeout(() => this.error = '', 5000)
      }
    }
  },
  methods: {
    linkedInLogin () {
      axios.get(`${url}/auth/linkedin`, {
        headers: {
          'Access-Control-Allow-Origin': '*'}
        }).then(response => {
          window.location.href = response.data
        })
        .catch(e => {
          this.error = e.response.data.msg
        })
    },
    resetPassword () {
      axios.post(`${url}/api/auth/forgot/`, {email: this.login.username})
        .then(response => {
          this.error = 'Further Instructions has been send sent to the email id.'
          this.variant = 'success'
        })
        .catch(e => {
          this.error = e.response.data.msg
        })
    },
    changeTab (idx) {
      if (idx === 1) {
        this.tabIndex = 1
      }
    },
    registration_completed (val) {
      if (val) {
        this.tabIndex = 0
        this.error = 'Successfully Registered. Please verify your email address.'
        this.variant = 'success'
      }
    },
    onSubmit (evt) {
      evt.preventDefault()
      if (grecaptcha.getResponse() == 0){
        this.error = 'Please verify captcha'
        this.variant = 'danger'
        grecaptcha.reset()
        return false
      }
      axios.post(`${url}/api/auth/login/`, this.login)
        .then(response => {
          localStorage.setItem('jwtToken', response.data.token)
          localStorage.setItem('user_first_time', response.data.user.first_time)
          localStorage.setItem('user_id', response.data.user._id)
          localStorage.setItem('role', response.data.user.role)
          localStorage.setItem('email', response.data.user.email)

          if (response.data.user.first_time) {
            this.$router.push({
              name: 'ProfileBuilder'
            })
          } else {
            this.$router.push({
              name: 'HomePage'
            })
          }
        })
        .catch(e => {

          this.error = e.response.data.msg

          if (e.response.data.link) {
            this.variant = 'danger'
            this.error = this.error + ` Please click <a href="${url}/api/auth/resend/${this.login.username}" @click.prevent="" >here</a> to resend token.`
          }
        })
    },
    register () {
      this.$router.push({
        name: 'Register'
      })
    },
    submit (response){
      console.log(response)
    }
  }
}
</script>

<style scoped>
  .container {
    height: 100%;
    width: 100% !important;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .down-arrow {
    border: solid white;
    border-width: 0 3px 3px 0;
    display: inline-block;
    padding: 3px;
    height: 30px;
    width: 30px;
  }
  .down {
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
  }

  .logo-noq {
    /*background-color: #f7c141;*/
    background-color: rgba(28, 16, 15, 0.85);
    padding-bottom: 8px;
    border-radius: 10px;
    box-shadow: 2px 2px 2px #b4b4b4;
  }

  .big-title{
    font-size: 50px;
    color: white;
  }

  .offer-title{
    font-size: 20px;
  }

  .offer-description {
    text-align: justify;
  }

  #video_overlays {
    position: fixed;
    background-color: rgba(0, 0, 0, 0.46);
    z-index: -1;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }
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
    cursor: pointer;
  }

  .linkedin-btn:hover{
    background-color: #6c9ccb !important;
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
