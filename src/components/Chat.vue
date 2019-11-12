<template>
<div>
  <div style="font-size: 60px;" class="mx-5 mb-0 mt-3">Messages</div>
  <p class="" style="color: grey; margin-top: -5px; margin-left: 55px;">Make some conversations!</p>
  <hr width="94%" align="left" class="mx-5"/>
  <div class="card mx-5">
    <div class="card-body pt-0 px-0" style="height: 78vh;">
      <div class="row" style="height: 100%">
        <div class="col-4 p-0 pl-4 pr-2 pt-3" style="border-right: 1px solid #c4c4c4; overflow-y: auto; max-height: 700px;">
          <input id="from" type="text"  class="input-field form-control" placeholder="Search.." />
          <hr />
          <div v-for="message in messages">
            <div class="py-3 message-card pl-2" @click="openChat(message.id)" :style="{'background-color': openedChat.id == message.id ? '#c4c4c4' : 'none'}">
              <div class="row">
                <div class="col-2">
                  <img :src="message.image" style="height: 65px; width: 65px; object-fit: cover"/>
                </div>
                <div class="col-7">
                  <span style="font-size: 18px; font-weight: 300;">{{message.name}}</span>
                  <span class="pt-1" style="display: block; font-size: 14px;">{{message.company}}</span>
                </div>
                <div class="col-3">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-8 p-0 pr-3" style="padding-right: 15px !important; border-top-right-radius: 10px !important;">
          <div v-if="noChat" style="background-color: #007bff; height: 72px">
            <div class="pt-3">
              <span style="font-size: 25px; font-weight: 400; padding-left: 15px; color: white; ">Open a chat!</span>
            </div>
          </div>
          <div v-if="!noChat">
            <div style="background-color: #007bff; height: 72px">
              <div class="pt-2">
                <span
                  style="font-size: 20px; font-weight: 400; padding-left: 15px; color: white">{{openedChat.name}}</span>
                <p style="padding-left: 15px; color: white; margin-bottom: 0px;">{{openedChat.online ? 'Online': 'Offline'}}</p>
              </div>
            </div>
            <div>
              <div class="chat-box">
                <div class="chat-here" style="height: 700px;">
                  <div v-for="chat in openedChatMessages">
                    <div class="px-2 mt-2 py-1" :style="{'background-color': chat.from._id == user_id ? 'rgba(0,123,255,0.12)':'none'}">
                      <div class="row">
                        <div class="col-10">
                          <span style="font-size: 15px; font-weight: 500; padding-left: 15px;">{{chat.from.name}}</span>
                        </div>
                        <div class="col-2 text-right">
                          <span style="font-size: 12px;">{{formatDate2(chat.date)}}</span>
                        </div>
                      </div>
                      <div>
                        <span style="padding-left: 15px;">{{chat.body}}</span>
                      </div>
                    </div>
<!--                    {{chat.from.name}} ({{formatDate2(chat.date)}}}) : {{formatDate2(chat.date)}}-->
                  </div>
                </div>
              </div>
              <div class="input-group mb-3 px-3 pt-2">
                <input type="text" class="form-control" placeholder="Type your message..." v-model="messageBody">
                <div class="input-group-append">
                  <button class="btn btn-outline-primary" type="button" @click="sendMessage">Send</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
  import axios from 'axios'
  import io from 'socket.io-client'
  import url from '../config/server_config'

  export default {
  name: 'Chat',
  data () {
    return {
      user: {},
      noChat: true,
      openedChat: {},
      messageBody: '',
      openedChatMessages: [],
      messages: [], // all the users that are in the list ot chat with!
      user_id: localStorage.user_id,
      socket: io('localhost:3000'),
      whichChatIsOpened: '',
      isUserOnline: false,
    }
  },
  created () {
    this.getData()
    this.socket.emit('register', this.user_id)
    // this.socket.emit('online', this.user_id)
  },
  beforeDestroy () {
    // console.log('destroyed: ', this.user_id)
    this.socket.emit('disconnect', this.user_id)
  },
  watch: {
    openedChat (newVal) {
      // console.log(newVal)
      return newVal
    },
    messages (newVal) {
      console.log('newval:', newVal)
    }
  },
  mounted () {
    this.socket.on('MESSAGE', (data) => {
      this.openedChatMessages.push(data)
    })

    this.socket.on('ONLINE_USERS', data => {
      this.messages.forEach(user => {
        data.forEach(id => {
          if (user.id == id)
            user.online = true
        })
      })
      console.log(data)
      console.log('online users: ', this.messages)
    })
  },
  methods: {

    formatDate (date) {
      if (date)
        return this.$moment(date).format('MMM Do YY')
      else return 'Present'
    },
    formatDate2 (date) {
      if (date)
        return this.$moment(date).format('hh:mm A, MM/DD')
      else return 'Present'
    },
    openChat (id) {
      this.noChat = false
      this.openedChat = this.messages.find(x => x.id === id)

      var headers = {
        Authorization: 'Bearer ' + localStorage.getItem('jwtToken').substring(4, localStorage.getItem('jwtToken').length)
      }

      axios.post(`${url}/api/messages/`, {from: this.user_id, to: id}, {headers: headers})
        .then(res => {

          this.openedChat.messages = []
          res.data.sort(function (a, b) {
            return new Date(a.date) - new Date(b.date);
          });
          this.openedChatMessages = res.data

          console.log(this.openedChatMessages)
        })
        .catch(e => {
          console.log(e)
        })
    },
    sendMessage () {
      this.openedChat.messages.push({
        from: this.user_id,
        to: this.openedChat.id,
        body: this.messageBody,
        date: new Date()
      })
      this.socket.emit('SEND_MESSAGE', {
        from: this.user_id,
        to: this.openedChat.id,
        body: this.messageBody
      });
      this.messageBody = ''
      this.openChat(this.openedChat.id)
    },
    getData () {
      var headers = {
        Authorization: 'Bearer ' + localStorage.getItem('jwtToken').substring(4, localStorage.getItem('jwtToken').length)
      }

      axios.get(`${url}/api/user/${this.user_id}`, {headers: headers})
        .then(response => {
          this.user = response.data
          // console.log(this.user)
          if (this.user.role === 'student') {
            this.user.acceptances.forEach(a => {
              this.messages.push({
                online: false,
                id: a.employer._id,
                name: a.employer.name,
                company: a.employer.company,
                email: a.employer.email,
                image: require('../assets/blank_profile.png')
              })
            })
          }
          if (this.user.role === 'employer') {
            this.user.jobs.forEach(job => {
              job.confirmed_users.forEach(a => {
                this.messages.push({
                  online: false,
                  id: a._id,
                  name: a.name,
                  company: a.employer.company,
                  email: a.email,
                  image: require('../assets/blank_profile.png')
                })
              })
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
    },

  }
}
</script>

<style scoped>
.message-card {

}
  .message-card:hover {
    background-color: #d1d1d1;
    cursor: pointer;
  }
  .chat-box {
    max-height: 620px;
    overflow-y: auto;
    position: relative;
  }
  button {
    cursor: pointer;
  }
</style>
