<template>
  <v-card outlined>
    <v-card-title dense>Beam</v-card-title>
  
    <v-card-text>
      <v-data-table :headers= "headers" :items="beams.sections" disable-sort hide-default-footer>
        <template v-slot:item.action="{ item }">
          <v-icon small class="mr-2" @click="editBeam(item)">edit</v-icon>
          <v-icon small @click="deleteBeam(item)">delete</v-icon>
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
        @click="addBeam">
        <v-icon>mdi-plus</v-icon>
    </v-btn>
  </v-card>
</template>

<script>

  import { mapState, mapGetters, mapMutations } from 'vuex'
  

  export default {
    computed:{
      ...mapState(['beams']),
      ...mapGetters(['getBeam']),
      ...mapMutations(['updateBeamsSVG', 'updateLoadBCsSVG']),
    },

    data: () => ({
      headers: [
        { text: 'Length (in)', value: 'length'},
        { text: 'Start area (in²)', value: 'areaA' },
        { text: 'End area (in²)', value: 'areaB' },
        { text: "Start inertia (in⁴)", value: 'inerA' },
        { text: 'End inertia (in⁴)', value: 'inerB' },
        { text: 'Actions', value: 'action', sortable: false },
      ],
      editedItem: null,
      defaultItem: null,
      editedIndex: -1,
    }),

    methods: {
      addBeam(){
        this.$store.commit('addBeam');
      },

      editBeam (item) {
        this.$store.commit('editBeam', item);
      },

      deleteBeam (item) {
        const index = this.beams.sections.indexOf(item);
        if( confirm('Are you sure you want to delete this beam?') ){
          this.beams.sections.splice(index, 1);
          this.updateBeamsSVG;
          this.updateLoadBCsSVG;
        }
      }
    },
  }
</script>