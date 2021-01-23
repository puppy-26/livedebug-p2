<template>
  <a
    href="#"
    class="list-group-item list-group-item-action mb-1"
    @click.prevent="fetchDetail(card.card_number)"
  >
    <div class="d-flex w-100 justify-content-between">
      <div class="col-9">
        <h5 class="mb-1 text-left">lala</h5>
      </div>
      <div class="col-3">
        <small>{{ card.card_number }}</small>
      </div>
    </div>
    <p class="mb-1 col">{{ card.rarity }}</p>
  </a>
</template>

<script>
export default {
  name: 'SidebarListItem',
  props: {
    card: Object
  },
  methods: {
    fetchDetail (cardNumber) {
      this.$store.commit('fetchCardDetail', {
        card_number: cardNumber
      })
    }
  }
}
</script>

<style>
</style>
