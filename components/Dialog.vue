<template>
  <v-dialog v-model="dialog.show" max-width="1000px">
    <v-card>
      <v-card-title>
        <span class="headline">{{ dialog.itemIndex > -1 ? 'Edit' : 'New' }} {{ dialog.type }}</span>
      </v-card-title>

      <v-container>
        <v-form v-model="isValid">
          <v-container v-if="dialog.type === 'Beam'">
            <v-row>
              <v-col cols="12" sm="4" md="4">
                <v-text-field v-model="dialog.item.length" label="Beam lenght" suffix="in" :rules="[ruleValN0]"
                  required></v-text-field>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-text-field v-model="dialog.item.modulus" label="Elastic modulus" suffix="msi" :rules="[ruleValN0]"
                  required></v-text-field>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-text-field v-model="dialog.item.inertia" label="Moment of inertia" suffix="in⁴" :rules="[ruleValN0]"
                  required></v-text-field>
              </v-col>
            </v-row>
          </v-container>

          <v-container v-if="dialog.type === 'Load'">
            <v-radio-group v-model="dialog.item.type" class="row" row>
              <v-radio class="col-md-3 mr-0" label="Force" value="Force"></v-radio>
              <v-radio class="col-md-3 mr-0" label="Moment" value="Moment"></v-radio>
              <v-radio class="col-md-3 mr-0" label="Distributed Force" value="Distributed Force"></v-radio>
              <v-radio class="col-md-3 mr-0" label="Distributed Moment" value="Distributed Moment"></v-radio>
            </v-radio-group>
            <v-row v-if="dialog.item.type === 'Force'">
              <v-col cols="12" sm="6" md="6">
                <v-text-field v-model="dialog.item.locA" label="Force location" suffix="in" :rules="[ruleLocA]"
                  required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field v-model="dialog.item.valA" label="Force value" suffix="lb" :rules="[ruleValN0]" required>
                </v-text-field>
              </v-col>
            </v-row>
            <v-row v-if="dialog.item.type === 'Moment'">
              <v-col cols="12" sm="6" md="6">
                <v-text-field v-model="dialog.item.locA" label="Moment location" suffix="in" :rules="[ruleLocA]"
                  required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field v-model="dialog.item.valA" label="Moment value" suffix="lb-in" :rules="[ruleValN0]"
                  required></v-text-field>
              </v-col>
            </v-row>
            <v-row v-if="dialog.item.type === 'Distributed Force'">
              <v-col cols="12" sm="6" md="3">
                <v-text-field v-model="dialog.item.locA" label="Start location" suffix="in" :rules="[ruleLocA]"
                  required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-text-field v-model="dialog.item.locB" label="End location" suffix="in" :rules="[ruleLocB]" required>
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-text-field v-model="dialog.item.valA" label="Start force value" suffix="lb" :rules="[ruleVal]"
                  required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-text-field v-model="dialog.item.valB" label="End force value" suffix="lb" :rules="[ruleVal]"
                  required></v-text-field>
              </v-col>
            </v-row>
            <v-row v-if="dialog.item.type === 'Distributed Moment'">
              <v-col cols="12" sm="6" md="3">
                <v-text-field v-model="dialog.item.locA" label="Start location" suffix="in" :rules="[ruleLocA]"
                  required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-text-field v-model="dialog.item.locB" label="End location" suffix="in" :rules="[ruleLocB]" required>
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-text-field v-model="dialog.item.valA" label="Start moment value" suffix="lb-in" :rules="[ruleVal]"
                  required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-text-field v-model="dialog.item.valB" label="End moment value" suffix="lb-in" :rules="[ruleVal]"
                  required></v-text-field>
              </v-col>
            </v-row>
          </v-container>

          <v-container v-if="dialog.type === 'Support'">
            <v-radio-group v-model="dialog.item.type" class="row" row>
              <v-radio class="col-md-2 mr-0" label="Fixed" value="Fixed"></v-radio>
              <v-radio class="col-md-2 mr-0" label="Support" value="Support"></v-radio>
              <v-radio class="col-md-2 mr-0" label="Slide" value="Slide"></v-radio>
              <v-radio class="col-md-3 mr-0" label="Linear Spring" value="Linear Spring"></v-radio>
              <v-radio class="col-md-3 mr-0" label="Torsion Spring" value="Torsion Spring"></v-radio>
            </v-radio-group>
            <v-row>
              <v-col>
                <v-text-field v-model="dialog.item.locA" label="Support location" suffix="in" :rules="[ruleLocA]"
                  required></v-text-field>
              </v-col>
              <v-col v-if="dialog.item.type === 'Linear Spring'">
                <v-text-field v-model="dialog.item.stiff" label="Spring stiffness" suffix="lb/in" :rules="[ruleValN0]"
                  required></v-text-field>
              </v-col>
              <v-col v-if="dialog.item.type === 'Torsion Spring'">
                <v-text-field v-model="dialog.item.stiff" label="Spring stiffness" suffix="lb-in/rad"
                  :rules="[ruleValN0]" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-slider v-model="slider" :tick-labels="ticksLabels" ticks tick-size="5" :step="(beamL / 20)"
                  :max="beamL" thumb-size="35" thumb-label="always" @input="setSupportLocation">
                  <template v-slot:thumb-label="{ value }">
                    {{ (value/beamL * 100).toFixed(0) }}%
                  </template>
                </v-slider>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-container>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
        <v-btn color="blue darken-1" text :disabled="!isValid" @click="save">
          {{ dialog.itemIndex > -1 ? 'Save' : 'Create' }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import { mapState } from 'vuex'
  import { formatNumer } from '../general/helpers.js'
  import { mapFields } from 'vuex-map-fields'


  export default {
    computed: {
      ...mapState({
        beams: state => state.analysis.beams,
      }),
      ...mapFields({
        dialog: 'dialog',
        beamL: 'analysis.totalLength',
        solved: 'analysis.solved'
      }),
    },

    data: () => ({
      isValid: false,
      slider: 0,
      ticksLabels: ['left', ...Array(9), 'middle', ...Array(9), 'right'],
    }),

    methods: {
      ruleLocA(v) {
        if (v === '') return 'Required';
        if (isNaN(v)) return 'Should be a number';
        if (parseFloat(v) < 0) return "Location shouldn't be less than zero";
        if (parseFloat(v) > this.beamL) return "Location shouldn't be greater than beam total length";
        if ((this.dialog.item.locB) && (parseFloat(v) > parseFloat( this.dialog.item.locB ))) return "Start location should be less than end location";
        return true
      },

      ruleLocB(v) {
        if (v === '') return 'Required';
        if (isNaN(v)) return 'Should be a number';
        if (parseFloat(v) < 0) return "Location shouldn't be less than zero";
        if (parseFloat(v) > this.beamL) return "Location shouldn't be greater than beam total length";
        if (parseFloat(v) < parseFloat( this.dialog.item.locA )) return "End location should be grater than start location";
        return true
      },

      ruleValN0(v) {
        if (parseFloat(v) === 0) return "Value shouldn't be equal to zero";
        if (v === '') return 'Required';
        if (isNaN(v)) return 'Should be a number';
        return true
      },

      ruleVal(v) {
        if (v === '') return 'Required';
        if (isNaN(v)) return 'Should be a number';
        return true
      },

      setSupportLocation() {
        Object.assign(this.dialog.item, {
          'locA': formatNumer(this.slider)
        });
      },

      close() {
        this.dialog.show = false;
      },

      save() {
        const
          parseProp = (item, prop) => {
            if (Object.prototype.hasOwnProperty.call(item, prop))
              item[prop] = parseFloat(item[prop]);
          },
          item = this.dialog.item;
        this.solved = false;

        parseProp(item, 'length');
        parseProp(item, 'modulus');
        parseProp(item, 'inerA');
        parseProp(item, 'inerB');
        parseProp(item, 'valA');
        parseProp(item, 'valB');
        parseProp(item, 'locA');
        parseProp(item, 'locB');
        parseProp(item, 'stiff');

        if ((this.dialog.type === 'Support') && (item.type !== 'Linear Spring') && (item.type !== 'Torsion Spring')) {
          Object.assign(item, {
            stiff: ''
          });
        }
        if ((this.dialog.type === 'Load') && (item.type !== 'Distributed Force') && (item.type !== 'Distributed Moment')) {
          Object.assign(item, {
            locB: '',
            valB: ''
          });
        }

        if (this.dialog.itemIndex > -1) {
          Object.assign(this.dialog.items[this.dialog.itemIndex], item);
        } else {
          this.dialog.items.push(item);
          if (this.dialog.type !== 'Beam')
            this.dialog.items.sort((a, b) => (a.locA > b.locA) ? 1 : -1);
        }

        if (this.dialog.type === 'Beam'){
          this.beamL = 0;
          this.beams.forEach(b => {
            this.beamL += parseFloat(b.length);
          });
        }

        this.close();
      },
    },
  }
  </script>