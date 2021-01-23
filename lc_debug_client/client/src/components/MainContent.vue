<template>
  <Fragment>
    <div class="d-flex col-lg-8" v-if="cardDetail">
      <div class="col-lg-6 mb-4 text-center">
        <img
          class="img-fluid"
          :src="cardDetail.img"
        />
      </div>
      <div class="col-lg-6 mb-4 pl-0">
        <table class="table">
          <tbody>
            <tr>
              <th scope="row">Name</th>
              <td>{{ cardDetail.name }}</td>
            </tr>
            <tr>
              <th scope="row">Price</th>
              <td>{{ cardDetail.price }} $</td>
            </tr>
            <tr>
              <th scope="row">Card Number</th>
              <td>{{ cardDetail.card_number }}</td>
            </tr>
            <tr>
              <th scope="row">Card Set</th>
              <td>{{ cardDetail.card_set }}</td>
            </tr>
            <tr>
              <th scope="row">Rarity</th>
              <td>{{ cardDetail.rarity }}</td>
            </tr>
          </tbody>
        </table>
        <div class="text-center">
          <button class="btn btn-success" @click="$router.push('/' + cardDetail.card_number)">Talk about this card!</button>
        </div>
      </div>
    </div>
    <div class="col-lg-8" v-else>
      <LoadingBar />
    </div>
  </Fragment>
</template>

<script>
import { Fragment } from 'vue-fragment'
import LoadingBar from './LoadingBar'

export default {
  name: 'MainContent',
  components: {
    Fragment,
    LoadingBar
  },
  computed: {
    cardDetail () {
      return this.$store.state.cardDetail
    }
  }
}
</script>

<style>
</style>
