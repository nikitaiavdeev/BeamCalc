<template>
  <v-card outlined>
    <v-card-title dense>Supports</v-card-title>
  
    <v-card-text>
      <v-data-table class="inputTable" :headers= "headers" :items="supports" disable-sort hide-default-footer>
        <template v-slot:item.action="{ item }">
          <v-icon small class="mr-2" @click="editBC(item)">edit</v-icon>
          <v-icon small @click="deleteBC(item)">delete</v-icon>
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
        @click="addBC">
        <v-icon>mdi-plus</v-icon>
    </v-btn>
  </v-card>
</template>

<script>

  import { mapState, mapMutations } from 'vuex'
  

  export default {
    computed:{
      ...mapState({
        supports: state => state.analysis.supports
      }),
      ...mapMutations(['updateLoadBCsSVG']),
    },

    data: () => ({
      headers: [
        { text: 'Support Type', value: 'type'},
        { text: 'Position (in)', value: 'locA' },
        { text: 'Spring Stiffness (lb/in or lb-in/rad)', value: 'stiff' },
        { text: 'Actions', value: 'action', sortable: false },
      ],
      editedItem: null,
      defaultItem: null,
      editedIndex: -1,
    }),

    methods: {
      addBC(){
        this.$store.commit('addBC');
      },

      editBC (item) {
        this.$store.commit('editBC', item);
      },

      deleteBC (item) {
        const index = this.supports.indexOf(item);
        if( confirm('Are you sure you want to delete this Support?') ){
            this.$store.state.analysis.solved = false;
            this.supports.splice(index, 1);
            this.updateLoadBCsSVG;
        }
      }
    },
  }
</script>