<template>
  <div>
    <multiselect
      v-model="value"
      :max-height="200"
      tag-placeholder="Add this as new tag"
      :placeholder="fetchingSkills ? 'Loading your skills...' : 'Select your skills to filter jobs'"
      label="name" track-by="id"
      :options="options"
      :limit="3"
      :taggable="false"
      :multiple="true"
      :option-height="194"
    >
      <div >Filter jobs base on your selected skills</div>

    </multiselect>
  </div>
</template>

<script>
  import Multiselect from 'vue-multiselect'
  import 'vue-multiselect/dist/vue-multiselect.min.css'
  import axios from 'axios'

  export default {
    name: 'SkillSelect',
    components: {
      Multiselect
    },
    data () {
      return {
        value: [],
        options: [{name: 'a', id: 1}, {name: 'b', id: 12}, {name: 'c', id: 122}],
        fetchingSkills: false
      }
    },
    props: {
      existingSkills: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    mounted () {
      console.log(this.existingSkills)
      this.options = this.existingSkills
      // this.value = this.existingSkills
    }, watch: {
      value (newVal) {
        if (typeof newVal.hasOwnProperty('name') !== null) {
          this.$emit('filterSkills', newVal)
        }
      }
    },
  }
</script>

<style scoped>
  /deep/ .multiselect__tag {
    background-color: #c68967;
  }

  /deep/ .multiselect__tag-icon::after {
    color: white;
  }

  /deep/ .multiselect__tag-icon:hover {
    color: white;
    background-color: #a06f53 !important;
  }

  /deep/ .multiselect__tags {
    border-radius: 5px;
    border-width: 1px;
    height: 10px;
    /*border-color:  #a06f53 !important;*/
    background-color: #ffffff;
  }

</style>
