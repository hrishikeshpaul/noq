<template>
  <div class="">
    <multiselect
      style="height: 40px;"
      v-model="value"
      :max-height="150"
      tag-placeholder="Add this as new tag"
      placeholder="Search or add a tag"
      label="name" track-by="code"
      :options="options"
      :taggable="true"
      :option-height="104"
      @tag="addTag"></multiselect>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'

export default {
  name: 'FilterBar',
  props: {
    options: {
      type: Array,
      required: true
    }
  },
  components: {
    Multiselect
  },
  data () {
    return {
      value: [
        this.options[0]
      ]
    }
  },
  watch: {
    value (newVal) {
      if (typeof newVal.hasOwnProperty('code') !== null) {
        this.$emit('group', newVal.code)
      } else {
        this.value.push({ name: 'Position', code: 'position' })
      }
    }
  },
  methods: {
    addTag (newTag) {
      const tag = {
        name: newTag,
        code: newTag.substring(0, 2) + Math.floor((Math.random() * 10000000))
      }
      this.options.push(tag)
      this.value.push(tag)
    }
  }
}
</script>

<style scoped>
/deep/ .multiselect__tags {
  /*background-color: #FFD8B1;*/
  color: black;
}

/deep/ .multiselect__single {
  /*background-color: #FFD8B1;*/
  color:black;
}
/deep/ .multiselect__select::before {
  /*color: #FFD8B1;*/
  /*color:black !important;*/
}
  /deep/ .multiselect__input {
    /*background-color: #FFD8B1;*/
  }
</style>
