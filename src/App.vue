<script>
  import { useRouter } from 'vue-router';

  export default {
    name: 'App',
    watch: {
      group () {
        this.drawer = false
      },
    },
    data: () => ({ drawer: false, group: null }),

    setup() {
      const router = useRouter();
      const menuItems = router.options.routes.filter(route => route.name);

      return { menuItems };
    },
  };
</script>

<template>
  <v-app>
    <v-app-bar color="primary" prominent app>
      <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="text-start">Dave</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      :location="$vuetify.display.mobile ? 'bottom' : undefined"
      temporary
      :scrim="false"
      app>
      <v-list>
        <v-list-item
          v-for="route in menuItems"
          :key="route.path"
          :to="route.path"
          router
        >
          <v-list-item-title>{{ route.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main style="padding-top: 30px;">
      <v-container>
        <router-view />
      </v-container>
    </v-main>
    <v-footer app>
      <div style="display: flex; align-items: center;">
        <p>
          Source: &nbsp;
        </p>
        <a href="https://github.com/meinac/dave" target="_blank"><img src="/public/github-mark.svg" alt="Example Icon" width="25px" height="25px" /></a>
      </div>
    </v-footer>
  </v-app>
</template>

<style>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
#app {
  width: 100%;
}
</style>
