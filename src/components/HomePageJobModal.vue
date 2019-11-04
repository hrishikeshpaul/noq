<template>
  <div>
    <div >
      <b-modal ref="modal" hide-footer v-model="show" data-keyboard="false" size="lg"
               data-backdrop="static" :title="newJob.title" class="nice-font">
        <template v-slot:modal-title>
          <div style="font-size: 40px;" class="nice-font px-3">
            {{newJob.title}}
          </div>
          <p style="font-size: 17px; color: #7f8993; margin-top: -7px; padding-left: 5px;" class="mb-0 px-3 nice-font">{{newJob.company}}</p>
        </template>
        <div style="max-height: 600px !important; overflow-y: auto" class="mb-3">
          <div class="text-center nice-font">
            <img src="../assets/company.jpg" style="height: 150px; width: 150px; border-radius: 50%;"/>
            <p style="font-size: 30px;" class="pt-2 mb-0 pb-0">{{newJob.company}}</p>
            <p style="color: gray; font-size: 20px">{{newJob.location}}</p>
            <hr />
          </div>
          <div class="px-3 nice-font">
            <div class="row">
              <div class="col-lg-1 col-md-1 col-sm-1" style="color: gray; font-size: 20px">
                <span><i class="ti-briefcase"></i></span>
              </div>
              <div class="col-lg-11 col-md-11 col-sm-11 pl-0" style="font-size: 20px">
                {{newJob.position}}
              </div>
            </div>
          </div>
          <hr />
          <div class="px-3 nice-font">
            <div class="row">
              <div class="col-lg-1 col-md-1 col-sm-1 mt-1" style="color: gray; font-size: 20px">
                <span style="margin-top: 5px !important;"><i class="ti-receipt"></i></span>
              </div>
              <div class="col-lg-11 col-md-11 col-sm-11 pl-0" style="font-size: 20px">
                <span style="white-space: pre-wrap;">{{newJob.description}}</span>
              </div>
            </div>
          </div>
          <hr />
          <div class="px-3 nice-font">
            <div class="row">
              <div class="col-lg-1 col-md-1 col-sm-1" style="color: gray; font-size: 20px">
                <span><i class="ti-star"></i></span>
              </div>
              <div class="col-lg-11 col-md-11 col-sm-11 pl-0" style="font-size: 20px">
                <div style="font-size: 20px">
                  {{displaySkills(newJob.skills)}}
                </div>
              </div>
            </div>
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
    font-family: 'Raleway', sans-serif;
    font-weight: 200;
  }
</style>
