<template>
  <v-app id="inspire">
    <Snackbar />
    <Header />
    <v-main>
      <v-container fluid>
        <v-row dense>
          <v-col v-if="!hideTables" cols="12" sm="12" md="5">
            <Tables />
          </v-col>

          <v-col cols="12" sm="12" :md="hideTables ? 12 : 7">
            <v-row>
              <v-col>
                <BeamCanvas title = "Beam" />
              </v-col>
            </v-row>

            <v-row v-if="solved" dense>
              <v-col>
                <BeamCanvas title = "Free Body" />
              </v-col>
            </v-row>

            <v-row v-if="solved" dense>
              <v-col>
                  <v-card outlined>
                    <v-card-title>
                      <v-row>
                        <v-col>
                          <v-card-title dense>QMV Diagrams</v-card-title>
                        </v-col>
                        <v-col>
                          <v-switch v-model="showAxis" label="Axis"></v-switch>
                        </v-col>
                        <v-col>
                          <v-switch v-model="showLoads" label="Loads"></v-switch>
                        </v-col>
                        <v-col>
                          <v-switch v-model="showBCs" label="BCs"></v-switch>
                        </v-col>
                        <v-col>
                          <v-switch v-model="showMaxMin" label="Max/Min"></v-switch>
                        </v-col>
                      </v-row>
                    </v-card-title>
                  
                    <v-card-text>

                      <QMVCanvas graphID = "qCanvas" />
                      <QMVCanvas graphID = "mCanvas" />
                      <QMVCanvas graphID = "vCanvas" />
                    </v-card-text>
                  </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <Dialog />
  </v-app>
</template>

<script>
  import Snackbar from './components/Snackbar'
  import Header from './components/Header'
  import BeamCanvas from './components/BeamCanvas'
  import QMVCanvas from './components/QMVCanvas'
  import Tables from './components/Tables'
  import Dialog from './components/Dialog'
  import { mapFields } from 'vuex-map-fields'
  import { mapState  } from 'vuex'

  export default {
    computed:{
      ...mapState({
        solved: state => state.analysis.solved,
        hideTables: state => state.hideTables
      }),
      ...mapFields({
        showAxis: 'analysis.solution.showAxis',
        showLoads: 'analysis.solution.showLoads',
        showBCs: 'analysis.solution.showBCs',
        showMaxMin: 'analysis.solution.showMaxMin',
      })
    },

    components: {
      Snackbar,
      Header,
      Tables,
      BeamCanvas,
      QMVCanvas,
      Dialog
    },

    mounted: function() {
      this.$nextTick(() => {
        window.addEventListener('resize', this.onResize);
        window.dispatchEvent(new Event('resize'));
      })
    },

    methods: {
      onResize() {
        this.$store.commit('onResize');
      }
    },
    
    beforeDestroy: function() { 
      window.removeEventListener('resize', this.onResize); 
    },

    metaInfo: {
    title: 'Online free beam calculator',
    titleTemplate: '%s',
    htmlAttrs: {
      reptilian: 'Online free beam calculator'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'description', content: 'Online free beam calculator. Easily model shear, moment, and deflection, with unlimited supports, interactive diagrams, and instant results.' },
      { name: 'title', content: 'Online free beam calculator' }
    ]
  },
  }
</script>