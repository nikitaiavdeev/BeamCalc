<template>
  <v-app id="inspire">
    <v-content>
      <v-container>
        <v-row>
          <v-col>
            <PanelInput />
          </v-col>
        </v-row>
      </v-container>
    </v-content>

    <v-footer color="indigo" app>
      <span class="white--text">&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
  import PanelInput from './components/PanelInput'

  export default {
    components: {
      PanelInput,
    }
  }
</script>