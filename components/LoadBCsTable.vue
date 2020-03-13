<template>
  <v-card outlined>
    <v-card-title dense>Loads and BCs</v-card-title>

    <v-card-text>
      <v-data-table :headers= "headers" :items="loadBCs.items" disable-sort hide-default-footer>
        <template v-slot:top>
          <v-dialog v-model="dialog" max-width="1000px">
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row v-if = "dialogType === 'Beam'">
                    <v-col cols="12">
                      <v-select :items="['Yes','No']" v-model="editedItem.isBroken" label="Is stiffener broken?"></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.dist2Crack" label="Distance to crack center" suffix="in"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.modulus" label="Young's modulus" suffix="msi"></v-text-field>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12">
                      <span class="black--text">Stiffener Geometry</span>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.area" label="Cross-section area" suffix="in²"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.inertia" label="Moment of inertia" suffix="in⁴"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.oml" label="OML to stiffener centroid" suffix="in"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.iml" label="IML to stiffener centroid" suffix="in"></v-text-field>
                    </v-col>
                  </v-row>

                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="save">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
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
  import mapStatesTwoWay from '../store/mapTwoWay'
  import { mapState } from 'vuex'

  export default {
    computed:{
      formTitle () {
        return (this.editedIndex === -1 ? 'New ' : 'Edit ') + this.dialogType;
      },
      ...mapState(['loadBCs']),
      ...mapStatesTwoWay({
          dialog: state => state.dialog,
          dialogType: state => state.dialogType
        }, function (value) {
            this.$store.commit('updateCurrent', value)
        }),
    },

    data: () => ({
      headers: [
        { text: 'Type', value: 'type'},
        { text: "Start Position (in)", value: 'start' },
        { text: 'End Position (in)', value: 'end' },
        { text: 'Start Magnitude (lb or lb-in)', value: 'startMag' },
        { text: 'End Magnitude (lb or lb-in)', value: 'endMag' },
        { text: 'Actions', value: 'action', sortable: false },
      ],
      editedItem: null,
      defaultItem: null,
      editedIndex: -1,
    }),

    created: function() {
      this.editedItem = this.$store.getters.getLoadBC('default');
      this.defaultItem = this.$store.getters.getLoadBC('default');
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
    },

    methods: {
      editItem (item) {
        this.editedIndex = this.items.indexOf(item);
        this.editedItem = this.$store.getters.getStiffener(this.editedIndex);
        this.dialog = true;
      },

      deleteItem (item) {
        const index = this.items.indexOf(item);
        confirm('Are you sure you want to delete this stiffener?') && this.items.splice(index, 1)
      },

      close () {
        this.dialog = false;
        
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },

      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.items[this.editedIndex], this.editedItem)
        } else {
          this.items.push(this.editedItem)
        }
        this.close();
      },

      selectFastType(item) {
        const t = item.fastenerType;
        this.$store.commit('setFastener',{item, t});
      }
    },
  }
</script>