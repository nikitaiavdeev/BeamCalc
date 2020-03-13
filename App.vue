<template>
  <v-app id="inspire">
    <Snackbar />
    <NavigationDrawer />
    <Header />
    <v-content>
      <v-container>
        <v-row>
          <v-col cols="12">
            <BeamCanvas />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <LoadBCsTable />
          </v-col>
          <v-col>
            <BeamTable />
          </v-col>
        </v-row>
      </v-container>
    </v-content>

  </v-app>
</template>

<script>
  import Snackbar from './components/Snackbar'
  import NavigationDrawer from './components/NavigationDrawer'
  import Header from './components/Header'
  import BeamCanvas from './components/BeamCanvas'
  import LoadBCsTable from './components/LoadBCsTable'
  import BeamTable from './components/BeamTable'

  export default {
    components: {
      Snackbar,
      NavigationDrawer,
      Header,
      BeamCanvas,
      LoadBCsTable,
      BeamTable
    }
  }
</script>