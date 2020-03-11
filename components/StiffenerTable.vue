<template>
  <v-card outlined>
    <v-row dense>
      <v-col cols="2">
        <v-card-title dense>Stiffeners</v-card-title>
      </v-col>
      <v-col>
        <v-switch
          v-model="allFastSwitch"
          label="All fastener data is the same"
        ></v-switch>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>

    <v-card-text>
      <v-row dense v-if="allFastSwitch === true">
        <v-col>
          <v-select  
            :items="fastDB" 
            item-text="fastenerType"
            v-model="allFastener.fastenerType"
            label="Fastener type"
            @change="selectFastType(allFastener)">
          </v-select>
        </v-col>

        <v-col>
          <v-text-field
            v-model="allFastener.fastenerDia"
            :disabled="allFastener.fastenerType !== 'Manual'"
            label="Fastener Diameter"
            suffix="in">
          </v-text-field>
        </v-col>

        <v-col>
          <v-text-field
            v-model="allFastener.fastenerPitch"
            :disabled="allFastener.fastenerType !== 'Manual'"
            label="Fastener pitch"
            suffix="in">
          </v-text-field>
        </v-col>
      </v-row>

      <v-row v-if="allFastSwitch === true">
        <v-col>
          <v-text-field
            v-model="allFastener.fastenerLinear"
            :disabled="allFastener.fastenerType !== 'Manual'"
            label="Fastener Linear Flexibility"
            suffix="in/kip">
          </v-text-field>
        </v-col>

        <v-col>
          <v-text-field
            v-model="allFastener.fastenerLinear"
            :disabled="allFastener.fastenerType !== 'Manual'"
            label="Fastener Non-Linear Flexibility"
            suffix="in/kip">
          </v-text-field>
        </v-col>

        <v-col>
          <v-text-field
            v-model="allFastener.fastenerLinear"
            :disabled="allFastener.fastenerType !== 'Manual'"
            label="Fastener Bi-Slope Intersept"
            suffix="kips">
          </v-text-field>
        </v-col>
      </v-row>

      <v-data-table :headers= "getHeaders" :items="stiffeners" disable-sort hide-default-footer>
        <template v-slot:top>
          <v-dialog v-model="dialog" max-width="1000px">
            <template v-slot:activator="{ on }">
              <v-btn color="primary"
                fab
                small
                dark
                absolute
                top
                right
                v-on="on">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
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

                  
                  <v-row v-if="allFastSwitch !== true">
                    <v-col cols="12">
                      <span class="black--text">Fastener data</span>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select :items="fastDB" item-text="fastenerType" v-model="editedItem.fastenerType" label="Fastener type" @change="selectFastType(editedItem)"></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.fastenerDia" label="Fastener Diameter" suffix="in" :disabled="editedItem.fastenerType !== 'Manual'"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.fastenerPitch" label="Fastener Pitch" :disabled="editedItem.fastenerType !== 'Manual'" suffix="in"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.fastenerLinear" label="Fastener Linear Flexibility" :disabled="editedItem.fastenerType !== 'Manual'" suffix="in/kip"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.fastenerNonLinear" label="Fastener Non-Linear Flexibility" :disabled="editedItem.fastenerType !== 'Manual'" suffix="in/kip"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.fastenerBiSlope" label="Fastener Bi-Slope Intersept" :disabled="editedItem.fastenerType !== 'Manual'" suffix="kips"></v-text-field>
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
  import { mapState } from 'vuex'
  import { fastenersDB } from '../store/store.js'
  import mapStatesTwoWay from '../store/mapTwoWay'

  export default {
    computed:{
      formTitle () {
        return this.editedIndex === -1 ? 'New Stiffener' : 'Edit Stiffener'
      },
      getHeaders () {
        if ( this.allFastSwitch ) 
          return [...this.stiffenerHeaders, ...this.actionsHeaders]
        else
          return [...this.stiffenerHeaders, ...this.fasternersHeaders, ...this.actionsHeaders]
      },
      ...mapState(['stiffeners']),
      ...mapStatesTwoWay({
        allFastSwitch: state => state.allFastSwitch,
        allFastener: state => state.allFastener
      }, function (value) {
        this.$store.commit('updateCurrent', value)
      })
    },

    data: () => ({
      dialog: false,
      fastDB: fastenersDB,
      stiffenerHeaders: [
        { text: 'Distance to crack center (in)', value: 'dist2Crack'},
        { text: 'Is stiffener broken', value: 'isBroken' },
        { text: 'Cross-section area (in²)', value: 'area' },
        { text: "Young's modulus (msi)", value: 'modulus' },
        { text: 'OML to centroid (in)', value: 'oml' },
        { text: 'IML to centroid (in)', value: 'iml' },
        { text: 'Moment of inertia (in⁴)', value: 'inertia' },
      ],
      fasternersHeaders:[
        { text: 'Fastener Type', value: 'fastenerType' },
        { text: 'Fastener Dia (in)', value: 'fastenerDia' },
        { text: 'Fastener Pitch (in)', value: 'fastenerPitch' },
        { text: 'Fastener Linear Flexibility (in/kip)', value: 'fastenerLinear' },
        { text: 'Fastener Non-Linear Flexibility (in/kip)', value: 'fastenerNonLinear' },
        { text: 'Fastener Bi-Slope intersept (kips)', value: 'fastenerBiSlope' }
      ],
      actionsHeaders:[
        { text: 'Actions', value: 'action', sortable: false },
      ],
      editedItem: null,
      defaultItem: null,
      editedIndex: -1,
    }),

    created: function() {
      this.editedItem = this.$store.getters.getStiffener('default');
      this.defaultItem = this.$store.getters.getStiffener('default');
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
    },

    methods: {
      editItem (item) {
        this.editedIndex = this.stiffeners.indexOf(item);
        this.editedItem = this.$store.getters.getStiffener(this.editedIndex);
        this.dialog = true;
      },

      deleteItem (item) {
        const index = this.stiffeners.indexOf(item);
        confirm('Are you sure you want to delete this stiffener?') && this.stiffeners.splice(index, 1)
      },

      close () {
        this.dialog = false
        
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },

      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.stiffeners[this.editedIndex], this.editedItem)
        } else {
          this.stiffeners.push(this.editedItem)
        }
        this.close()
      },

      selectFastType(item) {
        const t = item.fastenerType;
        this.$store.commit('setFastener',{item, t});
      }
    },
  }
</script>