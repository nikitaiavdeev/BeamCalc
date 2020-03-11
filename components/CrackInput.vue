<template>
  <v-card outlined height="100%">
    <v-card-title dense>Crack</v-card-title>

    <v-card-text>
      <v-row>
        <v-col>
          <v-text-field
            v-model="nCrackOut"
            label="Number of crack lengths"
            type="number"
            @input="changeArrayLength"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row style="overflow-y: auto; height:260px" dense>
          <v-col>
              <v-card outlined height="100%">
                  <v-card-subtitle>Enter Half Crack Lengths (in)</v-card-subtitle>
                  <v-card-text>
                      <v-row v-for="(crack, i) in crackOut.slice(0, nCrackOut)" :key="i" dense>
                        <v-col cols="2" style="display: flex; align-items: center; justify-content: center; margin-top: -10px;" >
                            <v-label >{{i+1}}</v-label>
                        </v-col>
                        <v-col>
                            <v-text-field v-model="crackOut[i]" suffix="in" dense></v-text-field>
                        </v-col>
                      </v-row>
                  </v-card-text>
              </v-card>
          </v-col>
      </v-row>
      
    </v-card-text>
  </v-card>
</template>

<script>
  import mapStatesTwoWay from '../store/mapTwoWay'
  
  export default {
    computed:{
      ...mapStatesTwoWay({
        nCrackOut: state => state.nCrackOut,
        crackOut: state => state.crackOut,

      }, function (value) {
        this.$store.commit('updateCurrent', value)
      })
    },

    data: () => ({
    }),

    methods: {
        changeArrayLength (v){
            const delta = v - this.crackOut.length;
            for(let i = 0; i < delta; i ++){
                this.crackOut.push(0);
            }
        }
    }
  }
</script>