import Vue from 'vue';
import SampleViewer from '@/dawg/extensions/core/sample-viewer/SampleViewer.vue';
import { Action } from '@/dawg/extensions/core/sample-viewer/types';
import { ui } from '@/base/ui';
import { manager } from '@/base/manager';
import { ref } from '@vue/composition-api';
import { Sample } from '@/core';

export const sampleViewer = manager.activate({
  id: 'dawg.sample-viewer',
  activate() {
    const actions: Action[] = [];
    const openedSample = ref<Sample | null>(null);

    const component = Vue.extend({
      components: { SampleViewer },
      template: `
      <sample-viewer
        :sample="openedSample.value"
        :actions="actions"
      ></sample-viewer>
      `,
      data: () => ({
        actions,
        openedSample,
      }),
    });

    ui.panels.push({
      name: 'Sample',
      component,
    });

    return {
      addAction(action: Action) {
        actions.push(action);
        return {
          dispose() {
            const i = actions.indexOf(action);
            if (i < 0) {
              return;
            }

            actions.splice(i, 1);
          },
        };
      },
      openedSample,
    };
  },
});