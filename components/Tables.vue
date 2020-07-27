<template>
  <div>
    <!-- Beams -->
    <v-row>
      <v-col>
        <v-card outlined>
          <v-card-title dense>Beam</v-card-title>

          <v-card-text>
            <v-data-table class="inputTable" :headers="beamsHeaders" :items="beams" disable-sort hide-default-footer>
              <template v-slot:item.action="{ item }">
                <v-icon small class="mr-2" @click="editItem('beam', item)">edit</v-icon>
                <v-icon small @click="deleteItem('beam', item)">delete</v-icon>
              </template>
            </v-data-table>
          </v-card-text>

          <v-btn color="primary" fab small dark absolute top right @click="addItem('beam')">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
    <!-- Beams -->

    <!-- Supports -->
    <v-row>
      <v-col>
        <v-card outlined>
          <v-card-title dense>Supports</v-card-title>

          <v-card-text>
            <v-data-table class="inputTable" :headers="supportsHeaders" :items="supports" disable-sort hide-default-footer>
              <template v-slot:item.action="{ item }">
                <v-icon small class="mr-2" @click="editItem('support', item)">edit</v-icon>
                <v-icon small @click="deleteItem('support', item)">delete</v-icon>
              </template>
            </v-data-table>
          </v-card-text>

          <v-btn color="primary" fab small dark absolute top right @click="addItem('support')">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
    <!-- Supports -->

    <!-- Loads -->
    <v-row>
      <v-col>
        <v-card outlined>
          <v-card-title dense>Loads</v-card-title>

          <v-card-text>
            <v-data-table class="inputTable" :headers="loadsHeaders" :items="loads" disable-sort hide-default-footer>
              <template v-slot:item.action="{ item }">
                <v-icon small class="mr-2" @click="editItem('load', item)">edit</v-icon>
                <v-icon small @click="deleteItem('load', item)">delete</v-icon>
              </template>
            </v-data-table>
          </v-card-text>

          <v-btn color="primary" fab small dark absolute top right @click="addItem('load')">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
    <!-- Loads -->
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    computed:{
      ...mapState({
        beams: state => state.analysis.beams,
        supports: state => state.analysis.supports,
        loads: state => state.analysis.loads,
      })
    },

    data: () => ({
      beamsHeaders: [
        { text: 'Length (in)', value: 'length'},
        { text: 'Elastic modulus (msi)', value: 'modulus' },
        { text: "Moment of inertia (in⁴)", value: 'inertia' },
        { text: 'Actions', value: 'action', sortable: false },
      ],
      supportsHeaders: [
        { text: 'Support Type', value: 'type'},
        { text: 'Position (in)', value: 'locA' },
        { text: 'Spring Stiffness (lb/in or lb-in/rad)', value: 'stiff' },
        { text: 'Actions', value: 'action', sortable: false },
      ],
      loadsHeaders: [
        { text: 'Type', value: 'type'},
        { text: "Start Position (in)", value: 'locA' },
        { text: 'End Position (in)', value: 'locB' },
        { text: 'Start Magnitude (lb or lb-in)', value: 'valA' },
        { text: 'End Magnitude (lb or lb-in)', value: 'valB' },
        { text: 'Actions', value: 'action', sortable: false },
      ],
    }),

    methods: {
      addItem(name){
        switch(name){
          case 'beam':
            this.$store.commit('addBeam');
            break;
          case 'support':
            this.$store.commit('addBC');
            break;
          case 'load':
            this.$store.commit('addLoad');
            break;
        }
      },

      editItem(name, item){
        switch(name){
          case 'beam':
            this.$store.commit('editBeam', item);
            break;
          case 'support':
            this.$store.commit('editBC', item);
            break;
          case 'load':
            this.$store.commit('editLoad', item);
            break;
        }
      },

      deleteItem(name, item){
        let index;
        switch(name){
          case 'beam':
            index = this.beams.indexOf(item);
            if( confirm('Are you sure you want to delete this Beam?') ){
              let totalL = 0;
              
              this.$store.state.analysis.solved = false;
              this.beams.splice(index, 1);
              
              this.beams.forEach(b => {
                totalL += b.length === '' ? 0 : parseFloat(b.length);
              });
              this.$store.state.analysis.totalLength = totalL;
            }
            break;
          case 'support':
            index = this.supports.indexOf(item);
            if( confirm('Are you sure you want to delete this Support?') ){
                this.$store.state.analysis.solved = false;
                this.supports.splice(index, 1);
            }
            break;
          case 'load':
            index = this.loads.indexOf(item);
            if( confirm('Are you sure you want to delete this Load?') ){
              this.$store.state.analysis.solved = false;
              this.loads.splice(index, 1);
              this.updateLoadBCsSVG;
            }
            break;
        }
      },
    },
  }
</script>