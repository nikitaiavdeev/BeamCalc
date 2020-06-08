<template>
  <v-card outlined>
    <v-card-title dense>Beam</v-card-title>
  
    <v-card-text>
      <v-data-table class="inputTable" :headers= "headers" :items="beams" disable-sort hide-default-footer>
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
  import { mapState, mapMutations } from 'vuex'

  export default {
    computed:{
      ...mapState({
        beams: state => state.analysis.beams,
      }),
      ...mapMutations(['updateBeamsSVG', 'updateLoadBCsSVG']),
    },

    data: () => ({
      headers: [
        { text: 'Length (in)', value: 'length'},
        { text: 'Elastic modulus (msi)', value: 'modulus' },
        { text: "Moment of inertia (in⁴)", value: 'inertia' },
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
        const index = this.beams.indexOf(item);
        if( confirm('Are you sure you want to delete this beam?') ){
          this.$store.state.analysis.solved = false;
          this.beams.splice(index, 1);
          this.updateBeamsSVG;
          this.updateLoadBCsSVG;
        }
      }
    },
  }
</script>