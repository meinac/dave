import { createApp } from 'vue';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
  components,
  directives,
});

export default class ComponentRenderer {
  constructor(vueComponent) {
    this.vueComponent = vueComponent;
  }

  render(props) {
    const container = document.createElement('div');
    const app = createApp(this.vueComponent, props);

    app.use(vuetify);
    app.mount(container);

    const renderedHTML = container.innerHTML;

    app.unmount();

    return renderedHTML;
  }
}
