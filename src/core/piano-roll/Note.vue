<template>
  <div class="note bg-primary h-full" :style="{ 'background-color':  color }">
    <div 
      class="body"
      v-on="$listeners"
    ></div>

    <div 
      class="absolute text-sm text-default select-none pl-1"
      :style="textStyle"
    >
      {{ text }}
    </div>
    
  </div>
</template>

<script lang="ts">
import { allKeys } from '@/utils';
import { ScheduledNote } from '@/models';
import { computed, createComponent } from '@vue/composition-api';

export default createComponent({
  name: 'Note',
  props: {
    pxPerBeat: { type: Number, required: true },
    width: { type: Number, required: true },
    element: { type: Object as () => ScheduledNote, required: true },
    height: { type: Number, required: true },
    color: String,
  },
  setup(props) {
    const noteName = computed(() => {
      return allKeys[props.element.row.value].value;
    });

    const textStyle = computed(() => {
      return {
        lineHeight: `${props.height}px`,
      };
    });

    const threshold = computed(() => {
      // FIXME fix this somehow??
      // Should be based of root font size
      return 12;
    });

    const text = computed(() => {
      return props.width > threshold.value ? allKeys[props.element.row.value].value : undefined;
    });

    return {
      text,
      textStyle,
    };
  },
});
</script>

<style lang="sass" scoped>
.note
  position: relative

.drag, .body
  position: absolute

.body
  width: 100%
  height: 100%

.note
  border-radius: 4px
  overflow: hidden

.selected
  background-color: #ff9999
</style>
