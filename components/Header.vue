<template>
  <v-app-bar
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
      <input v-show="false" ref="fileUpload" type="file" accept=".txt, .in" @change="openFile">

      <v-divider
        inset
        vertical
      ></v-divider>

      <v-btn text @click="showSnack">
        Save
      </v-btn>
    </v-toolbar-items>

    <v-spacer></v-spacer>
    <v-toolbar-title>CrackPan</v-toolbar-title>
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
      openFile(){
        let file = this.$refs.fileUpload.files[0];
        if(!file){
          return;
        } 
        
        let reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload =  evt => {
          console.log(evt.target.result);
        }
        reader.onerror = evt => {
          console.error(evt);
        }
      }
    }
  }
</script>