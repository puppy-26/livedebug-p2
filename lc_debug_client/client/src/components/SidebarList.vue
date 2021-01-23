<template>
  <Fragment>
    <div class="list-group" v-if="cardList.length">
      <SidebarListItem
        v-for="card in cardList"
        @card="card"
        :key="card.card_number"
      />
    </div>
    <div class="list-group" v-else>
      <LoadingBar />
    </div>
  </Fragment>
</template>

<script>
import SidebarListItem from './SidebarListItem'
import { Fragment } from 'vue-fragment'
import LoadingBar from './LoadingBar'

export default {
  name: 'SidebarList',
  components: {
    SidebarListItem,
    LoadingBar,
    Fragment
  },
  computed: {
    cardList () {
      return this.$store.state.cardList
    }
  }
}
</script>

<style>
</style>
