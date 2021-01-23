<template>
    <div class="row">

      <!-- card detail -->
      <div class="col-md-4" v-if="cardDetail">
        <div class="card mb-4 shadow-sm">
          <img class="bd-placeholder-img card-img-top" width="100%" height="340"
            style="object-fit: cover; object-position: 0 0"
            :src="cardDetail.img">
          <div class="card-body">
            <h5 class="card-title text-center">{{ cardDetail.name }}</h5>
            <ul class="list-group list-group-flush">
              <li class="list-group-item">Card Number: {{ cardDetail.card_number }}</li>
              <li class="list-group-item">Card Set: {{ cardDetail.card_set }}</li>
              <li class="list-group-item">{{ cardDetail.rarity }}</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="col-md-4" v-else>
        <LoadingBar />
      </div>

      <!-- card comment -->
      <div class="col-md-8">

        <!-- add new comment to card -->
        <form class="mb-4" @submit.prevent="addComment">
          <div class="form-group">
            <input
              type="text"
              class="form-control"
              placeholder="Enter your name"
              v-model="name"
              required
            >
          </div>
          <div class="form-group">
            <input
              type="text"
              class="form-control"
              placeholder="Your comment about this card"
              v-model="content"
              required
            >
          </div>
          <input type="submit" class="btn btn-primary" />
        </form>
        <!-- comment list -->
        <ul class="list-group list-group-flush" v-if="cardComments">
          <li class="list-group-item"
            v-for="(comment, i) in cardComments"
            :key="i"
          >
            {{ comment.name }} said {{ comment.content }}
          </li>
        </ul>
      </div>
    </div>
</template>

<script>
import LoadingBar from '../components/LoadingBar'

export default {
  name: 'CardThread',
  components: {
    LoadingBar
  },
  data () {
    return {
      name: '',
      content: ''
    }
  },
  computed: {
    cardDetail () {
      return this.$store.state.cardDetail
    },
    cardComments () {
      return this.$store.state.cardComments
    }
  },
  methods: {
    addComment () {
      this.$store.dispatch('addComment', {
        name: this.name,
        content: this.content,
        cardNumber: this.$route.params.card_number
      })
        .then(({ data }) => {
          this.$store.dispatch('fetchCardDetail', {
            card_number: this.$route.params.card_number
          })
          this.$store.dispatch('fetchCardComments', {
            card_number: this.$route.params.card_number
          })
        })
        .catch(err => {
          this.$store.commit('SET_NOTIF', {
            message: err.message,
            color: 'danger'
          })
          setTimeout(() => {
            this.$store.commit('SET_NOTIF', {})
          }, 2000)
        })
        .finally(_ => {
          this.name = ''
          this.content = ''
        })
    }
  },
  created () {
    this.$store.dispatch('fetchCardDetail', {
      card_number: this.$route.params.card_number
    })
    this.$store.dispatch('fetchCardComments', {
      card_number: this.$route.params.card_number
    })
  }
}
</script>
