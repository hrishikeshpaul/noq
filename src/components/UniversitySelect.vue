<template>
  <div class="">
    <multiselect
      v-model="value"
      :max-height="150"
      tag-placeholder="Add this as new tag"
      placeholder="Search or add a tag"
      label="name" track-by="id"
      :options="options"
      :taggable="true"
      :multiple="false"
      :option-height="104"
    ></multiselect>
  </div>
</template>

<script>
  import Multiselect from 'vue-multiselect'
  import colleges from '../assets/college.json'

  export default {
    components: {
      Multiselect
    },
    props: {
      rVal: {
        type: String
      }
    },
    data () {
      return {
        value: {keyName: 'Vue.js', id: 'JavaScript'},
        options: colleges
      }
    },
    created () {
      console.log('herer')
      console.log(this.rVal)
      if(this.rVal) {
        var o = this.options.find(x => x.name === this.rVal)
        this.value = {name: o.name, id: o.id}
      } else {
        this.value = {}
      }
    },
    watch: {
      value (newVal) {
        if (typeof newVal.hasOwnProperty('name') !== null) {
          this.$emit('addCompany', newVal)
        }
      }
    },
    methods: {
      nameWithLang ({name, language}) {
        return `${name} — [${language}]`
      }
    }
  }
</script>

<style scoped>
  /deep/ .multiselect__single {
    background-color: #e6e6e6;
    font-weight: 300 !important;
  }
  /deep/ .multiselect__tags {
    background-color: #e6e6e6;
    border: none !important;
    font-weight: 300 !important;
  }

  /deep/ .multiselect__tags:hover {
    background-color: #e3e3e3;
    font-weight: 300 !important;
  }
  /deep/ .multiselect__single:hover {
    background-color: #e3e3e3;
    font-weight: 300 !important;
  }
  /deep/ .multiselect__input {
    background-color: #e6e6e6;
    font-weight: 300 !important;
  }
</style>
