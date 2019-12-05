<template>
  <div>
    <multiselect
      v-model="value"
      :max-height="150"
      tag-placeholder="Add this as new tag"
      :placeholder="fetchingSkills ? 'Skills Loading...' : 'Search or add a tag'"
      label="name" track-by="id"
      :options="options"
      :taggable="true"
      :multiple="true"
      :option-height="194"
      @search-change="searchQuery"
      @tag="addTag"></multiselect>
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
      options: [],
      fetchingSkills: false
    }
  },
  props: {
    recievedValues: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  mounted () {
    this.fetchingSkills = true
    axios({
      method: 'GET',
      'url': 'https://cors-anywhere.herokuapp.com/' +
          'https://trendyskills.com/service?q=keywords&like=' +
          '' +
          '&key=ULkph5viBzDWhvnh'
    })
      .then(result => {
        this.fetchingSkills = false
        var arr = result.data.keywords
        arr.forEach(s => {
          this.options.push({name: s.keyName, id: s.id, points: 0})
          if (this.recievedValues.length > 0) {
            this.value = this.recievedValues
          }
        })
      })
  },
  watch: {
    value (newVal) {
      if (typeof newVal.hasOwnProperty('name') !== null) {
        this.$emit('addSkills', newVal)
      }
    }
  },
  methods: {
    searchQuery (newVal) {
      axios({
        method: 'GET',
        'url': 'https://cors-anywhere.herokuapp.com/' +
            'https://trendyskills.com/service?q=keywords&like=' +
            newVal +
            '&key=ULkph5viBzDWhvnh'
      })
        .then(result => {
          var arr = result.data.keywords
          arr.forEach(s => {
            this.options.push({name: s.keyName, id: s.id})
          })
        })
    },

    addTag (newTag) {
      const tag = {
        name: newTag,
        id: newTag.substring(0, 2) + Math.floor((Math.random() * 10000000))
      }
      this.options.push(tag)
      this.value.push(tag)
    }
  }
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


</style>
