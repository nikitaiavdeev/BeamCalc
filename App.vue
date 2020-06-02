<template>
  <v-app id="inspire">
    <Snackbar />
    <Header />
    <v-content>
      <v-container fluid>
        <v-row dense>
          <v-col cols="12" sm="12" md="5">
            <v-row>
              <v-col>
                <BeamTable />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <SupportTable />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <LoadTable />
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12" sm="12" md="7">
            <v-row dense>
              <v-col>
                <BeamCanvas />
              </v-col>
            </v-row>

            <v-row v-if="solved" dense>
              <v-col>
                <FreeBodyCanvas />
              </v-col>
            </v-row>

            <v-row v-if="solved" dense>
              <v-col>
                <QMVCanvas />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-content>

    <Dialog />
  </v-app>
</template>

<script>
  import Snackbar from './components/Snackbar'
  import Header from './components/Header'
  import BeamCanvas from './components/BeamCanvas'
  import FreeBodyCanvas from './components/FreeBodyCanvas'
  import QMVCanvas from './components/QMVCanvas'
  import LoadTable from './components/LoadTable'
  import SupportTable from './components/SupportTable'
  import BeamTable from './components/BeamTable'
  import Dialog from './components/Dialog'

  import { mapState  } from 'vuex'

  export default {
    computed:{
      ...mapState({
        solved: state => state.analysis.solved
      }),
    },

    components: {
      Snackbar,
      Header,
      BeamTable,
      LoadTable,
      SupportTable,
      BeamCanvas,
      FreeBodyCanvas,
      QMVCanvas,
      Dialog
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