<template>
<div>
  <div style="font-size: 30px;" class="mx-5 mb-0 mt-3">Messages</div>
<!--  <p class="" style="color: grey; margin-top: -5px; margin-left: 50px;">Make some conversations!</p>-->
  <hr width="94%" align="left" class="mx-5"/>
  <div class="card mx-5">
    <div class="card-body pt-0 px-0" style="height: 78vh;">
      <div class="row" style="height: 100%">
        <div class="col-5 p-0 pl-4 pr-2 pt-3" style="border-right: 1px solid #c4c4c4; overflow-y: auto; max-height: 700px;">
          <div>
            <b-card no-body>
              <b-tabs card>
                <b-tab title="Conversations" active @click="getData2">
                  <b-card-text>
                    <input type="text" class="input-field form-control" placeholder="Search.." v-model="searchConversations"/>
                    <hr />
                    <div v-for="conversation in computedUserConversations">
                      <div class="py-3 message-card pl-2" @click="openChat(conversation)" :style="{'background-color': openedChat.name === conversation.conversation_name ? '#c5c5c5' : 'transparent' }">
                        <div class="row">
                          <div class="col-2">
                            <img src="../assets/blank_profile.png" style="height: 65px; width: 65px; object-fit: cover"/>
                          </div>
                          <div class="col-7">
                            <span style="font-size: 18px; font-weight: 300;">{{conversation.user.name}}</span>
                            <span class="pt-1" style="display: block; font-size: 14px;">{{conversation.user.company}}</span>
                          </div>
                          <div class="col-3 text-right">
                            <span style="font-size: 12px; padding-right: 8px;">{{formatDate(conversation.lastUpdatedAt)}}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </b-card-text>
                </b-tab>
                <b-tab title="Contacts">
                  <b-card-text>
                    <input type="text" class="input-field form-control" placeholder="Search.." v-model="searchContacts"/>
                    <hr />
                    <div v-for="contact in computedUserContacts">
                      <!--            :style="{'background-color': openedChat.name == conversation.name ? 'none' : 'none'}"-->
                      <div class="py-3 message-card pl-2" @click="messageUserModal(contact)">
                        <div class="row">
                          <div class="col-2">
                            <img src="../assets/blank_profile.png" style="height: 65px; width: 65px; object-fit: cover"/>
                          </div>
                          <div class="col-10">
                            <span style="font-size: 18px; font-weight: 300;">{{contact.name}}</span>
                            <span class="pt-1" style="display: block; font-size: 14px;">{{contact.company}}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </b-card-text>
                </b-tab>
              </b-tabs>
            </b-card>
          </div>
        </div>
        <div class="col-7 p-0 pr-3" style="padding-right: 15px !important; border-top-right-radius: 10px !important;">
          <div v-if="noChat" style="background-color: #007bff; height: 72px">
            <div class="pt-3">
              <span style="font-size: 25px; font-weight: 400; padding-left: 15px; color: white; ">Open a chat!</span>
            </div>
          </div>
          <div v-if="!noChat">
            <div style="background-color: #007bff; height: 72px">
              <div class="pt-2">
                <span
                  style="font-size: 20px; font-weight: 400; padding-left: 15px; color: white">{{!openedChat.group ? role === 'student' ? openedChat.users[0].name : openedChat.users[1].name : 'Group Chat'}}</span>
                <p style="padding-left: 15px; color: white; margin-bottom: 0px;">{{userStatus}}</p>
              </div>
            </div>
            <div>
              <div class="chat-box" id="chatBox">
                <div class="chat-here" style="height: 700px;">
                  <div v-for="(chat, idx) in openedChat.messages">
                    <div class="px-2 mt-2 py-1" >
                      <div>
                        <div class="row mt-1 pt-1 mx-2 chat-border-top" :style="{'float': chat.from._id == user_id ? 'right' : 'left', 'width': '430px', 'background-color': chat.from._id == user_id ? 'rgba(0,123,255,0.12)':'#D6D6D6'}">
                          <div class="col-8 pl-0" style="border-radius: 5px;">
                            <span style="font-size: 15px; font-weight: 500; padding-left: 15px;">{{getFromName(chat.from.name)}}</span>
                          </div>
                          <div class="col-4 text-right">
                            <span style="font-size: 12px;">{{formatDate2(chat.date)}}</span>
                          </div>
                        </div>
                        <div>
                          <div class="row mb-1 pb-1 mx-2 chat-border-bottom pl-0" :style="{'float': chat.from._id == user_id ? 'right' : 'left', 'width': '430px', 'background-color': chat.from._id == user_id ? 'rgba(0,123,255,0.12)':'#d6d6d6'}">
                            <div class="col-11"><span style="padding-left: 15px;">{{chat.body}}</span></div>
                            <div class="col-1 text-right" v-if="chat.from._id === user_id"><i :class="chat.read ? 'ti-eye' : chat.delivered ? 'ti-check' : 'ti-time'" style="font-size: 10px; font-weight: bold"></i></div>
                          </div>
                        </div>
                      </div>
                    </div>
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
  <MessageUserModal :showModal="showMessageUserModal" @hideModal="hideMessageUserModal" :user="messageUserData" />
</div>
</template>

<script>
import axios from 'axios'
import io from 'socket.io-client'
import url from '../config/server_config'
import Fuse from 'fuse.js'

import MessageUserModal from './MessageUserModal'

export default {
  name: 'Chat',
  components: {
    MessageUserModal
  },
  data () {
    return {
      fuseOptions: {
        shouldSort: true,
        threshold: 0.2,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [
          'name'
        ]
      },
      fuseOptions2: {
        shouldSort: true,
        threshold: 0.2,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [
          'user.name'
        ]
      },
      user: {},
      user_name: '',
      noChat: true,
      openedChat: {
      },
      messageBody: '',
      onlineUsers: [],
      onlineOfflineUsers: [],
      userContacts: [],
      userStatus: 'Offline',
      userConversations: [],
      allUserConversations: [],
      openedChatMessages: [],
      messages: [], // all the users that are in the list ot chat with!
      user_id: localStorage.user_id,
      role: localStorage.role,
      socket: io('localhost:3000'),
      whichChatIsOpened: '',
      isUserOnline: false,
      total_msg_length: 0,
      showMessageUserModal: false,
      messageUserData: {},
      searchConversations: '',
      searchContacts: ''
    }
  },
  created () {
    this.getData2()
    this.getContacts()
    this.socket.emit('register', this.user_id)
    // window.setInterval(function () {
    //   var elem = document.getElementById('chatBox')
    //   if (elem) { elem.scrollTop = elem.scrollHeight }
    // }, 10000)
  },
  beforeDestroy () {
    this.socket.emit('disconnect', this.user_id)
  },
  computed: {
    computedUserContacts: {
      get: function (s) {
        if (!this.searchContacts) {
          return this.userContacts
        } else {
          var fuse = new Fuse(this.userContacts, this.fuseOptions)
          return fuse.search(this.searchContacts)
        }
      },
      set: function (val) {
        return val
      }
    },
    computedUserConversations: {
      get: function (s) {
        if (!this.searchConversations) {
          return this.userConversations
        } else {
          var fuse = new Fuse(this.userConversations, this.fuseOptions2)
          return fuse.search(this.searchConversations)
        }
      },
      set: function (val) {
        return val
      }
    }
  },
  watch: {
    openedChat (newVal) {
      // console.log(newVal)
      return newVal
    },
    onlineUsers (newVal) {
      newVal.forEach(id => {
        if (this.openedChat.hasOwnProperty(id)) { this.openedChat[id] = true }
      })
      if (!this.noChat) { this.getUserStatus() }
    },
    messageBody (val) {
      if (val.length > 0) {
        if (this.role === 'student')
          this.socket.emit('typing', {from: this.user_id, to: this.openedChat.users[0]._id, status: 'typing'})
        else if (this.role === 'employer')
          this.socket.emit('typing', {from: this.user_id, to: this.openedChat.users[1]._id, status: 'typing'})
      } else if (val.length === 0) {
        if (this.role === 'student')
          this.socket.emit('typing', {from: this.user_id, to: this.openedChat.users[0]._id, status: 'stopped'})
        else if (this.role === 'employer')
          this.socket.emit('typing', {from: this.user_id, to: this.openedChat.users[1]._id, status: 'stopped'})
      }
    }
  },
  mounted () {
    this.socket.on('MESSAGE', (data) => {
      var indexToRemove = 0
      for (var i = 0; i < this.openedChat.messages.length; i++) {
        if (this.openedChat.messages[i].hasOwnProperty('temp')) {
          indexToRemove = i
          break
        }
      }
      if (indexToRemove !== 0) {
        this.openedChat.messages.splice(indexToRemove, 1)
      }
      this.openedChat.messages.push(data)
      // console.log('this is opened chat: ', this.openedChat.messages)
    })

    this.socket.on('OFFLINE_USER', id => {

      if (this.openedChat.hasOwnProperty(id)) { this.openedChat[id] = false }
    })

    this.socket.on('ONLINE_USERS', data => {
      // console.log('online user data: ', data)
      this.onlineUsers = data
    })

    this.socket.on('TYPING', data => {
      if (data.status == 'typing') {
        this.userStatus = 'typing...'
      } else if(data.status == 'stopped')
        this.getUserStatus()
    })

    this.socket.on('PVT_READ', (messages) => {
      if (this.openedChat.hasOwnProperty(name)) {
        this.openedChat.messages.forEach(message => {
          messages.forEach(newMsg => {
            if (newMsg._id === message._id) { message.read = true }
          })
        })
      }
    })
  },
  methods: {
    hideMessageUserModal () {
      this.showMessageUserModal = false
    },
    messageUserModal (user) {
      this.messageUserData = user
      this.showMessageUserModal = !this.showMessageUserModal
    },
    getUserStatus () {
      if (this.role === 'student') {
        if (this.openedChat[this.openedChat.users[0]._id]) { this.userStatus = 'Online' } else this.userStatus = 'Offline'
      } else if (this.role === 'employer') {
        if (this.openedChat[this.openedChat.users[1]._id]) { this.userStatus = 'Online' } else this.userStatus = 'Offline'
      }
    },
    getFromName (name) {
      this.user_name = name
      return name
    },
    formatDate (date) {
      if (date) { return this.$moment(date).format('MMM Do YY') } else return 'Present'
    },
    formatDate2 (date) {
      if (date) { return this.$moment(date).format('hh:mm A, MM/DD') } else return 'Present'
    },
    openChat (conversation) {
      // this.onlineUsers = []
      this.socket.emit('PVT_ONLINE')
      this.openedChat = []
      this.noChat = false
      this.openedChat = this.allUserConversations.find(x => x.name === conversation.conversation_name)
      if (!this.openedChat.group) {
        this.openedChat[this.openedChat.users[0]._id] = false
        this.openedChat[this.openedChat.users[1]._id] = false
      }
      this.socket.emit('PVT_READ', this.openedChat)
      this.onlineUsers.forEach(id => {
        if (this.openedChat.hasOwnProperty(id)) { this.openedChat[id] = true }
      })
    },
    sendMessage () {
      var temp_obj = {
        from: this.user_name,
        date: new Date(),
        body: this.messageBody,
        temp: true,
        delivered: false
      }

      this.openedChat.messages.push(temp_obj)
      window.setInterval(function () {
        var elem = document.getElementById('chatBox')
        if (elem) { elem.scrollTop = elem.scrollHeight }
      }, 10)

      if (this.role === 'student') {
        this.socket.emit('SEND_MESSAGE', {
          from: this.user_id,
          to: [this.openedChat.users[0]._id],
          group: false,
          conversation_id: this.openedChat._id,
          name: this.openedChat.name,
          body: this.messageBody
        })
      } else if (this.role === 'employer') {
        this.socket.emit('SEND_MESSAGE', {
          from: this.user_id,
          to: [this.openedChat.users[1]._id],
          group: false,
          conversation_id: this.openedChat._id,
          name: this.openedChat.name,
          body: this.messageBody
        })
      }
      this.messageBody = ''
    },
    getData2 () {
      var headers = {
        Authorization: 'Bearer ' + localStorage.getItem('jwtToken').substring(4, localStorage.getItem('jwtToken').length)
      }

      this.allUserConversations = []
      this.userConversations = []

      axios.get(`${url}/api/messages/conversation/${this.user_id}`, {headers: headers})
        .then(response => {
          this.allUserConversations = response.data
          this.allUserConversations.forEach(conv => {
            if (!conv.group) {
              if (this.role === 'student') {
                this.userConversations.push({
                  user: conv.users[0],
                  conversation_name: conv.name,
                  lastUpdatedAt: conv.lastUpdatedAt,
                  lastUpdatedBy: conv.lastUpdatedBy
                })
              } else if (this.role === 'employer') {
                this.userConversations.push({
                  user: conv.users[1],
                  conversation_name: conv.name,
                  lastUpdatedAt: conv.lastUpdatedAt,
                  lastUpdatedBy: conv.lastUpdatedBy
                })
              }
            }
          })
        })
        .catch(e => {
          if (e.response.status === 401) {
            this.$router.push({
              name: 'Login'
            })
          }
        })
    },

    getContacts () {
      var headers = {
        Authorization: 'Bearer ' + localStorage.getItem('jwtToken').substring(4, localStorage.getItem('jwtToken').length)
      }

      axios.get(`${url}/api/user/${this.user_id}`, {headers: headers})
        .then(response => {
          this.userContacts = []
          if (this.role === 'student') {
            response.data.acceptances.forEach(job => {
              // this.userContacts.push(job.employer)
              this.userContacts.findIndex(x => x._id === job.employer._id) === -1 ? this.userContacts.push(job.employer) : console.log("object already exists")
            })
          } else if (this.role === 'employer') {
            response.data.jobs.forEach(job => {
              job.confirmed_users.forEach(user => {
                this.userContacts.findIndex(x => x._id === user._id) === -1 ? this.userContacts.push(user) : console.log("object already exists")
              })
            })
          }
        })
        .catch(e => {
          if (e.response === 401) {
            this.$router.push({
              name: 'Login'
            })
          }
        })

    }

  }
}
</script>

<style scoped>
.message-card {

}
  .message-card:hover {
    background-color: #d1d1d1 !important;
    cursor: pointer;
  }
  .chat-box {
    max-height: 560px;
    overflow-y: auto;
    position: relative;
    /*display: flex;*/
    /*flex-direction: column-reverse;*/
    /*padding-bottom: 20px;*/
  }
  button {
    cursor: pointer;
  }
  .chat-border-top {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  .chat-border-bottom {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }
</style>
