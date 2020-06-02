<template>
  <v-card outlined>
    <v-card-title dense>Loads</v-card-title>
    
    <v-card-text>
      <v-data-table class="inputTable" :headers= "headers" :items="loads" disable-sort hide-default-footer>
        <template v-slot:item.action="{ item }">
          <v-icon small class="mr-2" @click="editLoad(item)">edit</v-icon>
          <v-icon small @click="deleteLoad(item)">delete</v-icon>
        </template>
      </v-data-table>
    </v-card-text>

    <v-btn color="primary"
        fab
        small
        dark
        absolute
        top
        right
        @click="addLoad">
        <v-icon>mdi-plus</v-icon>
    </v-btn>
  </v-card>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    computed:{
      ...mapState({
        loads: state => state.analysis.loads
      }),
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
    }),

    methods: {
      addLoad(){
        this.$store.commit('addLoad');
      },

      editLoad (item) {
        this.$store.commit('editLoad', item);
      },

      deleteLoad (item) {
        const index = this.supports.indexOf(item);
        if( confirm('Are you sure you want to delete this Support?') ){
          this.$store.state.analysis.solved = false;
          this.supportss.splice(index, 1);
          this.updateLoadBCsSVG;
        }
      }
    },
  }
</script>