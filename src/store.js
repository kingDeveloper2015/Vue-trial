import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    showModal: false,
    updateFlag: false
  },
  getters: {
    getModalState (state) {
      return state.showModal
    },
    getUpdateState (state) {
      return state.updateFlag
    }
  },
  mutations: {
    newPost (state) {
      state.showModal = true
      state.updateFlag = false
    },
    updatePost (state) {
      state.showModal = true
      state.updateFlag = true
    },
    closeDialog (state) {
      state.showModal = false
    }
  }
})
