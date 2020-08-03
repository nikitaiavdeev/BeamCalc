<template>
  <v-app id="inspire">
    <Snackbar />
    <Header />
    <v-main>
      <v-container fluid>
        <v-row dense>
          <v-col>
            <v-text-field v-model="title" label="Title">

            </v-text-field>
          </v-col>
        </v-row>
        
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
                <BeamCanvas title = "FreeBody" />
              </v-col>
            </v-row>

            <v-row v-if="solved" dense>
              <v-col>
                  <v-card outlined>
                    <v-card-title>
                      <v-card-title>QMV Graphs</v-card-title>

                      <v-menu bottom offset-x :close-on-content-click=false>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn icon v-on="on" v-bind="attrs">
                            <v-icon>mdi-dots-vertical</v-icon>
                          </v-btn>
                        </template>

                        <v-list dense>
                          <v-list-item>
                            <v-switch v-model="showAxis" label="Axis"></v-switch>
                          </v-list-item>
                          <v-list-item>
                            <v-switch v-model="showLoads" label="Loads"></v-switch>                                
                          </v-list-item>
                          <v-list-item>
                            <v-switch v-model="showBCs" label="BCs"></v-switch>
                          </v-list-item>
                          <v-list-item>
                            <v-switch v-model="showMaxMin" label="Max/Min"></v-switch>
                          </v-list-item>
                        </v-list>
                      </v-menu>

                      <v-spacer></v-spacer>

                      <SVGSigns />
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
  import SVGSigns from './components/SVGSigns'
  import Tables from './components/Tables'
  import Dialog from './components/Dialog'
  import { mapFields } from 'vuex-map-fields'
  import { mapState  } from 'vuex'
  import './scss/svg.scss'

  export default {
    computed:{
      ...mapState({
        solved: state => state.analysis.solved,
        hideTables: state => state.hideTables
      }),
      ...mapFields({
        title: 'analysis.title',
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
      SVGSigns,
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
  }
</script>