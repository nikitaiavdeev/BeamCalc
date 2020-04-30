<template>
    <v-dialog v-model="dialog.show" max-width="1000px">
        <v-card>
            <v-card-title>
                <span class="headline">{{ dialog.itemIndex > -1 ? 'Edit' : 'New' }} {{ dialog.type }}</span>
            </v-card-title>

            <v-card-text>
                <v-container v-if="dialog.type === 'Beam'">
                    <v-row>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field v-model="dialog.item.length" label="Beam lenght" suffix="in"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field v-model="dialog.item.areaA" label="Beam left area" suffix="in²"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field v-model="dialog.item.areaB" label="Beam right area" suffix="in²"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field v-model="dialog.item.inerA" label="Beam left moment of inertia" suffix="in⁴"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field v-model="dialog.item.inerB" label="Beam right moment of inertia" suffix="in⁴"></v-text-field>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="save">{{ dialog.itemIndex > -1 ? 'Save' : 'Create' }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
  import mapStatesTwoWay from '../store/mapTwoWay'
  import { mapMutations  } from 'vuex'

  export default {
    computed:{
      ...mapMutations(['updateBeamsSVG', 'updateLoadBCsSVG']),
      ...mapStatesTwoWay({
          dialog: state => state.dialog,
        }, function (value) {
            this.$store.commit('updateCurrent', value)
        }),
    },

    methods: {
      close () {
        this.dialog.show = false;
      },

      save () {
        if (this.dialog.itemIndex > -1) {
          Object.assign(this.dialog.items[this.dialog.itemIndex], this.dialog.item);
        } else {
          this.dialog.items.push(this.dialog.item);
        }
        this.updateBeamsSVG;
        this.updateLoadBCsSVG;
        this.close();
      },
    },
  }
</script>