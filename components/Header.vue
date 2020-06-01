<template>
  <v-app-bar
    clipped-left
    app
    color="indigo"
    dark
    dense
  >
    <v-toolbar-items>
      <v-btn text @click="resetState">
        New
      </v-btn>

      <v-divider
        inset
        vertical
      ></v-divider>

      <v-btn text @click="$refs.fileUpload.click()">
        Open
      </v-btn>
      <input v-show="false" ref="fileUpload" type="file" accept=".json" @change="openFile">

      <v-divider
        inset
        vertical
      ></v-divider>

      <v-btn text @click="saveFile">
        Save
      </v-btn>

      <v-divider
        inset
        vertical
      ></v-divider>

      <v-btn text @click="solveBeam">
        Calculate
      </v-btn>
    </v-toolbar-items>

    <v-spacer></v-spacer>
    <v-toolbar-title>FreeBeam</v-toolbar-title>
    <v-spacer></v-spacer>

    <span>{{ this.$store.state.appVersion }}</span>
  </v-app-bar>
</template>

<script>
  export default {   
    methods:{
      resetState() {
        this.$store.commit('resetState');
      },
      showSnack(){
        this.$store.commit('showMessage',{message: "error", color: "error", show: true});
      },
      saveFile(){
        this.$store.commit('saveFile');
      },
      openFile(){
        let file = this.$refs.fileUpload.files[0];
        if (!file) {
          return;
        }

        let reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = evt => {
          this.$store.commit('openFile', evt.target.result);
        }
        reader.onerror = evt => {
          console.error(evt);
        }
      
      },
      solveBeam(){
        this.$store.commit('solveBeam');
      }
    }
  }
</script>