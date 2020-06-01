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
                                <v-text-field v-model="dialog.item.length" label="Beam lenght" suffix="in" :rules="[ruleValN0]" required></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="4" md="4">
                                <v-text-field v-model="dialog.item.modulus" label="Elastic modulus" suffix="msi" :rules="[ruleValN0]" required></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="4" md="4">
                                <v-text-field v-model="dialog.item.inertia" label="Moment of inertia" suffix="in⁴" :rules="[ruleValN0]" required></v-text-field>
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
                            <v-text-field v-model="dialog.item.locA" label="Force location" suffix="in" :rules="[ruleLocA]" required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field v-model="dialog.item.valA" label="Force value" suffix="lb" :rules="[ruleValN0]" required></v-text-field>
                        </v-col>
                        </v-row>
                        <v-row v-if="dialog.item.type === 'Moment'">
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field v-model="dialog.item.locA" label="Moment location" suffix="in" :rules="[ruleLocA]" required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field v-model="dialog.item.valA" label="Moment value" suffix="lb-in" :rules="[ruleValN0]" required></v-text-field>
                        </v-col>
                        </v-row>
                        <v-row v-if="dialog.item.type === 'Distributed Force'">
                        <v-col cols="12" sm="6" md="3">
                            <v-text-field v-model="dialog.item.locA" label="Start location" suffix="in" :rules="[ruleLocA]" required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                            <v-text-field v-model="dialog.item.locB" label="End location" suffix="in" :rules="[ruleLocB]" required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                            <v-text-field v-model="dialog.item.valA" label="Start force value" suffix="lb" :rules="[ruleVal]" required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                            <v-text-field v-model="dialog.item.valB" label="End force value" suffix="lb" :rules="[ruleVal]" required></v-text-field>
                        </v-col>
                        </v-row>
                        <v-row v-if="dialog.item.type === 'Distributed Moment'">
                        <v-col cols="12" sm="6" md="3">
                            <v-text-field v-model="dialog.item.locA" label="Start location" suffix="in" :rules="[ruleLocA]" required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                            <v-text-field v-model="dialog.item.locB" label="End location" suffix="in" :rules="[ruleLocB]" required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                            <v-text-field v-model="dialog.item.valA" label="Start moment value" suffix="lb-in" :rules="[ruleVal]" required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                            <v-text-field v-model="dialog.item.valB" label="End moment value" suffix="lb-in" :rules="[ruleVal]" required></v-text-field>
                        </v-col>
                        </v-row>
                    </v-container>

                    <v-container v-if="dialog.type === 'Support'">
                        <v-radio-group v-model="dialog.item.type" class="row" row>
                            <v-radio class="col-md-4 mr-0" label="Fixed" value="Fixed"></v-radio>
                            <v-radio class="col-md-4 mr-0" label="Support" value="Support"></v-radio>
                            <v-radio class="col-md-4 mr-0" label="Slide" value="Slide"></v-radio>
                        </v-radio-group>
                        <v-row>
                            <v-col cols="12" sm="12" md="12">
                                <v-text-field v-model="dialog.item.locA" label="Support location" suffix="in" :rules="[ruleLocA]" required></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-slider 
                                    :tick-labels="ticksLabels"
                                    ticks
                                    tick-size="5" 
                                    :step="(totalLength / 20)"
                                    :max="totalLength"
                                    thumb-size="35"
                                    thumb-label="always"
                                    @mouseup="setSupportLocation">
                                    <template v-slot:thumb-label="{ value }">
                                        {{ (value/totalLength * 100).toFixed(0) }}%
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
                <v-btn color="blue darken-1" text :disabled="!isValid" @click="save">{{ dialog.itemIndex > -1 ? 'Save' : 'Create' }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import mapStatesTwoWay from '../store/mapTwoWay'
    import { mapMutations } from 'vuex'
    import {formatNumer} from '../general/helpers.js'

    export default {
        computed: {
            ...mapMutations(['updateBeamsSVG', 'updateLoadBCsSVG']),
            ...mapStatesTwoWay({
                dialog: state => state.dialog,
                totalLength: state => state.beams.totalLength
            }, function (value) {
                this.$store.commit('updateCurrent', value)
            }),
        },

        data: () => ({
            isValid: false,
            ticksLabels: ['left', ...Array(9), 'middle', ...Array(9), 'right'],
        }),

        methods: {
            ruleLocA(v) {
                if ((!v) && (v != 0)) return 'Required';
                if (isNaN(v)) return 'Should be a number';
                if (v < 0) return "Location shouldn't be less than zero";
                if (v > this.totalLength) return "Location shouldn't be greater than beam total length";
                if ((this.dialog.item.locB) && (v > this.dialog.item.locB)) return "Start location should be less than end location";
                return true
            },

            ruleLocB(v) {
                if ((!v) && (v != 0)) return 'Required';
                if (isNaN(v)) return 'Should be a number';
                if (v < 0) return "Location shouldn't be less than zero";
                if (v > this.totalLength) return "Location shouldn't be greater than beam total length";
                if (v < this.dialog.item.locA) return "End location should be grater than start location";
                return true
            },

            ruleValN0(v) {
                if (v === 0) return "Value shouldn't be equal to zero";
                if ((!v) && (v != 0)) return 'Required';
                if (isNaN(v)) return 'Should be a number';
                return true
            },

            ruleVal(v) {
                if ((!v) && (v != 0)) return 'Required';
                if (isNaN(v)) return 'Should be a number';
                return true
            },

            setSupportLocation(e) {
                console.log(e);
                Object.assign(this.dialog.item, {
                    'locA': formatNumer(e)
                });
            },

            close() {
                this.dialog.show = false;
            },

            save() {
                const 
                    parseProp = (item, prop) => {
                        if (Object.prototype.hasOwnProperty.call(item, prop)) {
                            item[prop] = parseFloat(item[prop]);
                        }
                    };
                const item = this.dialog.item;
                this.$store.state.solved = false;

                parseProp(item, 'length');
                parseProp(item, 'modulus');
                parseProp(item, 'inerA');
                parseProp(item, 'inerB');
                parseProp(item, 'valA');
                parseProp(item, 'valB');
                parseProp(item, 'locA');
                parseProp(item, 'locB');

                if (this.dialog.itemIndex > -1) {
                    Object.assign(this.dialog.items[this.dialog.itemIndex], item);
                } else {
                    this.dialog.items.push(item);
                    this.dialog.items.sort((a, b) => (a.locA > b.locA) ? 1 : -1);
                }
                this.updateBeamsSVG;
                this.updateLoadBCsSVG;
                this.close();
            },
        },
    }
</script>