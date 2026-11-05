<script lang="ts" setup>
import CheckBox from "@/components/CheckBox.vue";
import MotionNumber from "@/components/MotionNumber.vue";
import { useScrollToEnd } from "@/composables/useScrollToEnd";
import { useWindowEvent } from "@/composables/useWindowEvent";
import { useGridStore } from "@/stores/grid";
import { usePlayerStore } from "@/stores/player";
import type { Data } from "@/type";
import { turnIndicator } from "@/util/turnIndicator";
import { ChevronDown } from "@lucide/vue";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";

const prop = defineProps<Data>();

defineEmits<{ change: [player: number, number: number, cell: string] }>();

const player = usePlayerStore();

const { visibility, ordering } = storeToRefs(player);

const { playerNameByID, maybeInitializeStorage } = player;

maybeInitializeStorage(prop.head);

const menu = ref<HTMLDivElement | null>(null);

const open = ref(false);

const { data } = useGridStore();

const computedHead = computed(() =>
  ordering.value.filter((id) => visibility.value.includes(id)),
);

useWindowEvent("click", (mouseEvent: MouseEvent) => {
  if (!menu.value?.contains(mouseEvent.target as HTMLElement)) {
    open.value = false;
  }
});

function onDrag(dataTransfer: DataTransfer, id: number) {
  dataTransfer.setData("text/plain", id.toString());

  dataTransfer.effectAllowed = "move";
}

function onDrop(drag: number, drop: number) {
  if (drag !== drop) {
    ordering.value.splice(
      ordering.value.indexOf(drop),
      0,
      ordering.value.splice(ordering.value.indexOf(drag), 1)[0],
    );
  }
}

const { containerRef, endRef } = useScrollToEnd();

const turnIndicatorIndex = computed(() => {
  try {
    return turnIndicator(data, ordering.value, visibility.value);
  } catch {
    return -1;
  }
});

function onSpacePress({ target, repeat, shiftKey }: KeyboardEvent) {
  if (!(target instanceof HTMLInputElement) || repeat) {
    return;
  }

  const number = +target.value;

  if (!Number.isNaN(number)) {
    target.value = (number + (shiftKey ? -10 : 10)).toString();

    // The browser does not fire a change event for programmatic changes.
    target.dispatchEvent(new Event("change"));
  }
}
</script>

<template>
  <div>
    <div class="mb-4 flex justify-end">
      <div ref="menu" class="relative">
        <button
          class="flex h-10 items-center justify-center gap-x-2 rounded-md border px-4 py-2 text-sm font-medium focus-ring transition-colors hover:bg-background-default-hover"
          type="button"
          @click="open = !open"
        >
          Visibility
          <ChevronDown />
        </button>

        <Transition
          enter-active-class="transition duration-300 origin-top"
          enter-from-class="opacity-0 scale-95"
          leave-active-class="transition duration-300 origin-top"
          leave-to-class="opacity-0 scale-95"
        >
          <fieldset
            v-if="open"
            class="absolute top-full right-0 z-10 mt-2 w-56 rounded-md border bg-background-default p-1"
          >
            <CheckBox
              v-for="id in head"
              :key="id"
              v-model="visibility"
              class="rounded-xs p-2 transition-colors hover:bg-background-default-hover"
              :number="id"
              :string="playerNameByID(id)!"
            />
          </fieldset>
        </Transition>
      </div>
    </div>

    <div
      ref="containerRef"
      class="max-h-90 scrollbar-thin scrollbar-thumb-background-neutral scrollbar-track-background-default overflow-auto focus-visible:outline-hidden"
    >
      <table class="w-full border-separate border-spacing-0 text-left text-sm">
        <thead>
          <tr>
            <th
              v-for="id in computedHead"
              :key="id"
              :class="[
                'sticky top-0 h-12 border-b px-4 py-0 font-medium whitespace-nowrap transition-all duration-300 ease-in',
                turnIndicatorIndex !== -1 &&
                id === computedHead[turnIndicatorIndex]
                  ? 'rounded-t-md border border-border-attention bg-background-attention text-foreground-default'
                  : 'bg-background-default text-foreground-muted',
              ]"
              draggable="true"
              @dragenter.prevent
              @dragover.prevent="$event.dataTransfer!.dropEffect = 'move'"
              @dragstart="onDrag($event.dataTransfer!, id)"
              @drop.prevent="
                onDrop(+$event.dataTransfer!.getData('text/plain'), id)
              "
            >
              {{ playerNameByID(id) }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y" @keydown.prevent.space="onSpacePress">
          <tr
            v-for="(record, number) in body"
            :key="number"
            class="transition-colors hover:bg-background-default-hover"
          >
            <td
              v-for="name in computedHead"
              :key="name"
              :class="[{ 'border-t': number !== 0 }, 'p-0']"
            >
              <input
                class="min-w-full scroll-my-12 border-none bg-transparent p-4 text-sm tabular-nums focus:ring-0 focus-visible:outline-hidden"
                inputmode="numeric"
                type="text"
                :value="record[name]"
                @change="
                  $emit(
                    'change',
                    name,
                    number,
                    ($event.target as HTMLInputElement).value,
                  )
                "
              />
            </td>
          </tr>

          <tr ref="endRef" />
        </tbody>
        <tfoot>
          <tr v-if="body.length > 1">
            <th
              v-for="name in computedHead"
              :key="name"
              class="sticky bottom-0 h-12 border-t bg-background-neutral px-4 py-0 font-medium tabular-nums first:rounded-bl-md last:rounded-br-md"
            >
              <MotionNumber v-if="foot[name] !== null" :number="foot[name]" />
            </th>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>
