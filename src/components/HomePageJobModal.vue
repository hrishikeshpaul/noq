<template>
  <div>
    <div >
      <b-modal ref="modal" hide-footer v-model="show" data-keyboard="false" size="lg"
               data-backdrop="static" :title="newJob.title" class="nice-font">
<!--        <template v-slot:modal-title>-->
<!--          <div style="font-size: 40px;" class="nice-font px-3">-->
<!--            {{newJob.title}}-->
<!--          </div>-->
<!--          <p style="font-size: 17px; color: #7f8993; margin-top: -7px; padding-left: 5px;" class="mb-0 px-3 nice-font">{{newJob.company}}</p>-->
<!--        </template>-->
        <div style="max-height: 600px !important; overflow-y: auto; background-color: #f6f6f6;">
          <div class="text-center nice-font">
            <img :src="newJob.employer.profilepicture ? newJob.employer.profilepicture.toString() : require('../assets/company.jpg')" style="height: 150px; width: 150px; border-radius: 50%; object-fit: cover;border: 3px solid #929292;"/>
            <p style="font-size: 20px;" class="pt-2 mb-0 pb-0">{{newJob.company}}</p>
            <p style="color: gray; font-size: 18px">{{newJob.location}}</p>
            <hr />
          </div>
          <div class="px-3 nice-font">
            <div class="row">
              <div class="col-lg-1 col-md-1 col-sm-1" style="color: gray; font-size: 16px">
                <span><i class="ti-briefcase"></i></span>
              </div>
              <div class="col-lg-11 col-md-11 col-sm-11 pl-0" style="font-size: 16px">
                {{newJob.position}}
              </div>
            </div>
          </div>
          <hr />
          <div class="px-3 nice-font">
            <div class="row">
              <div class="col-lg-1 col-md-1 col-sm-1" style="color: gray; font-size: 16px">
                <span><i class="ti-star"></i></span>
              </div>
              <div class="col-lg-11 col-md-11 col-sm-11 pl-0">
                <div style="font-size: 16px">
                  {{displaySkills(newJob.skills)}}
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div class="px-3 nice-font">
            <div class="row">
              <div class="col-lg-1 col-md-1 col-sm-1 mt-1" style="color: gray; font-size: 16px;">
                <span style="margin-top: 5px !important;"><i class="ti-receipt"></i></span>
              </div>
              <div class="col-lg-11 col-md-11 col-sm-11 pl-0" style="font-size: 16px;">
                <span style="white-space: pre-wrap;">{{newJob.description}}</span>
              </div>
            </div>
          </div>
          <hr />
          <div class="row text-center">
            <div class="col-3"></div>
            <div class="col-3">
              <button class=" mr-5 btn-lg btn-danger ml-5" @click="$emit('reject', newJob._id)" style="border: none;"><i class="ti-close"></i></button>
            </div>
            <div class="col-3">
              <button @click="$emit('accept', newJob)" class=" mr-4 btn-lg btn-success" style="border: none;"><i class="ti-check"></i></button>
            </div>
            <div class="col-3"></div>
          </div>
        </div>
      </b-modal>
    </div>
  </div>
</template>

<script>

export default {
  name: 'JobInfoModal',
  components: {
  },
  props: {
    showModal: {
      type: Boolean,
      default: false,
      required: true
    },
    job: {
      type: Object
    }
  },
  data () {
    return {
      show: false,
      newJob: {
        employer: {
          profilepicture: ''
        },
        location: '',
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
    job (newVal) {
      this.newJob = newVal
      console.log(this.newJob)
    }
  },
  methods: {
    displaySkills (skills) {
      if (skills.length > 0) {
        if (skills.length > 10) {
          return skills[0].name + ", " + skills[1].name + " & more"
        } else {
          return skills.map(s => s.name).join(', ')
        }
      } else {
        return 'None'
      }
    },
  }
}
</script>

<style scoped>
  .nice-font {
    font-family: 'Roboto', sans-serif;
    font-weight: 300;
  }
  /deep/ .modal-title {
    font-family: 'Roboto', sans-serif;
    font-weight: 200;
    padding-left: 1rem;
    font-size: 35px;
  }
  /deep/ .modal-header {
    color: white !important;
    background-color: #DA9F74 !important;
  }
  /deep/ .close {
    color: white;
  }
  /deep/ .modal-body {
    padding: 15px !important;
    background-color: #f6f6f6 !important;
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
  .ti-receipt {
    color: darkgreen;
  }
  /deep/ .modal {
    backdrop-filter: saturate(180%) blur(5px) !important;
  }

</style>
