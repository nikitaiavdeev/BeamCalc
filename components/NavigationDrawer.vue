<template>
    <v-navigation-drawer
        clipped
        absolute
        app
        expand-on-hover
        permanent
    >
        <v-list
            nav
            dense
        >
            <v-list-item link>
                <v-list-item-icon>
                    <v-img src="../icons/beam.svg"></v-img>
                </v-list-item-icon>
                <v-list-item-title>Add Beam</v-list-item-title>
            </v-list-item>
            <v-list-item link>
                <v-list-item-icon>
                    <v-img src="../icons/support.svg"></v-img>
                </v-list-item-icon>
                <v-list-item-title>Add Support</v-list-item-title>
            </v-list-item>
            <v-list-item link>
                <v-list-item-icon>
                    <v-img src="../icons/load.svg"></v-img>
                </v-list-item-icon>
                <v-list-item-title>Add Load</v-list-item-title>
            </v-list-item>
            <v-list-item link>
                <v-list-item-icon>
                    <v-img src="../icons/moment.svg"></v-img>
                </v-list-item-icon>
                <v-list-item-title>Add Moment</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
  export default {
    methods:{
      
    }
  }
</script>