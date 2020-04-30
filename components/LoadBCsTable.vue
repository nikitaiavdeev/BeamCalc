<template>
  <v-card outlined>
    <v-card-title dense>Loads and BCs</v-card-title>
    <v-card-text>
      <v-data-table :headers= "headers" :items="loadBCs.items" disable-sort hide-default-footer>
        <template v-slot:item.action="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="editItem(item)"
          >
            edit
          </v-icon>
          <v-icon
            small
            @click="deleteItem(item)"
          >
            delete
          </v-icon>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    computed:{
      ...mapState(['loadBCs']),
    },

    data: () => ({
      headers: [
        { text: 'Type', value: 'type'},
        { text: "Start Position (in)", value: 'locA' },
        { text: 'End Position (in)', value: 'locB' },
        { text: 'Start Magnitude (lb or lb-in)', value: 'valA' },
        { text: 'End Magnitude (lb or lb-in)', value: 'valB' },
        { text: 'Actions', value: 'action', sortable: false },
      ]
    })
  }
</script>