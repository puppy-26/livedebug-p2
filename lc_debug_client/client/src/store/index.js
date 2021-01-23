import Vue from 'vue'
import Vuex from 'vuex'
import yugiohAPI from '../api/yugioh'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cardList: [],
    cardDetail: null,
    cardComments: null,
    notif: {}
  },
  mutations: {
    SET_CARD_LIST (state, payload) {
      state.cardList = payload
    },
    SET_CARD_DETAIL (state, payload) {
      state.cardDetail = payload
    },
    SET_CARD_COMMENTS (state, payload) {
      state.cardComments = payload
    },
    ADD_CARD_COMMENTS (state, payload) {
      state.cardComments = [payload, ...state.cardComments]
    },
    SET_NOTIF (state, payload) {
      state.notif = payload
    }
  },
  actions: {
    fetchCardList (context, payload) {
      context.commit('SET_CARD_LIST', [])
      yugiohAPI
        .get('/cards/page/' + payload.page)
        .then(({ data }) => {
          context.commit('SET_CARD_LIST', data.cards)
        })
        .catch(err => {
          context.commit('SET_NOTIF', {
            message: err.message,
            color: 'danger'
          })
          setTimeout(() => {
            context.commit('SET_NOTIF', {})
          }, 2000)
        })
    },
    fetchCardDetail (context, payload) {
      context.commit('SET_CARD_DETAIL', null)
      yugiohAPI
        .get('/cards/detail/' + payload.card_number)
        .then(({ data }) => {
          console.log(data.card)
          context.commit('SET_CARD_DETAIL', data.card)
        })
        .catch(err => {
          context.commit('SET_NOTIF', {
            message: err.message,
            color: 'danger'
          })
          setTimeout(() => {
            context.commit('SET_NOTIF', {})
          }, 2000)
        })
    },
    fetchCardComments (context, payload) {
      axios.get('http://localhost:3000/comments/?_sort=id&_order=desc&card_number=' + payload.card_number)
        .then(({ data }) => {
          console.log(data, payload)
          context.commit('SET_CARD_COMMENTS', data)
        })
        .catch(err => {
          context.commit('SET_NOTIF', {
            message: err.message,
            color: 'danger'
          })
          setTimeout(() => {
            context.commit('SET_NOTIF', {})
          }, 2000)
        })
    },
    addComment (context, payload) {
      const { content, name, cardNumber } = payload
      axios.post('http://localhost:3000/comments', {
        content,
        name,
        card_number: cardNumber
      })
    }
  },
  modules: {
  }
})
