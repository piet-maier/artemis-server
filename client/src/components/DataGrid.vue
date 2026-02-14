<script lang="ts" setup>
import CheckBox from "@/components/CheckBox.vue";
import { useScrollToEnd } from "@/composables/useScrollToEnd";
import { useWindowEvent } from "@/composables/useWindowEvent";
import { useGridStore } from "@/stores/grid";
import type { Data } from "@/type";
import { magic } from "@/util/turnIndicator";
import { ChevronDown } from "lucide-vue-next";
import { computed, ref, watch } from "vue";

const prop = defineProps<Data>();

defineEmits<{ change: [name: string, number: number, cell: string] }>();

const menu = ref<HTMLDivElement | null>(null);

const open = ref(false);

const { data } = useGridStore();

const visibility = ref(
  localStorage.getItem("visibility")
    ? JSON.parse(localStorage.getItem("visibility")!)
    : prop.head,
);

watch(visibility, (visibility) => {
  localStorage.setItem("visibility", JSON.stringify(visibility));
});

const ordering = ref<string[]>(
  localStorage.getItem("ordering")
    ? JSON.parse(localStorage.getItem("ordering")!)
    : prop.head,
);

const computedHead = computed(() =>
  ordering.value.filter((name) => visibility.value.includes(name)),
);

useWindowEvent("click", (mouseEvent: MouseEvent) => {
  if (!menu.value?.contains(mouseEvent.target as HTMLElement)) {
    open.value = false;
  }
});

function onDrag(dataTransfer: DataTransfer, name: string) {
  dataTransfer.setData("text/plain", name);

  dataTransfer.effectAllowed = "move";
}

function onDrop(drag: string, drop: string) {
  if (drag !== drop) {
    ordering.value.splice(
      ordering.value.indexOf(drop),
      0,
      ordering.value.splice(ordering.value.indexOf(drag), 1)[0],
    );

    localStorage.setItem("ordering", JSON.stringify(ordering.value));
  }
}

const { containerRef, endRef } = useScrollToEnd();

const turnIndicator = computed(() =>
  magic(data, ordering.value, visibility.value),
);
</script>

<template>
  <div>
    <div class="mb-4 flex justify-end">
      <div ref="menu" class="relative">
        <button
          class="flex h-10 items-center justify-center gap-x-2 rounded-md border px-4 py-2 text-sm font-medium ring-zinc-300 ring-offset-2 ring-offset-zinc-950 transition-colors hover:bg-zinc-800 focus:ring-2 focus-visible:outline-hidden"
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
            class="absolute top-full right-0 z-10 mt-2 w-56 rounded-md border bg-zinc-950 p-1"
          >
            <CheckBox
              v-for="name in head"
              :key="name"
              v-model="visibility"
              :string="name"
              class="rounded-xs p-2 transition-colors hover:bg-zinc-800"
            />
          </fieldset>
        </Transition>
      </div>
    </div>

    <div
      ref="containerRef"
      class="max-h-90 overflow-auto focus-visible:outline-hidden"
    >
      <table class="w-full border-separate border-spacing-0 text-left text-sm">
        <thead>
          <tr>
            <th
              v-for="name in computedHead"
              :key="name"
              :class="[
                'sticky top-0 h-12 border-b px-4 py-0 font-medium whitespace-nowrap',
                name === computedHead[turnIndicator]
                  ? 'bg-green-800 text-zinc-50'
                  : 'bg-zinc-950 text-zinc-400',
              ]"
              draggable="true"
              @dragstart="onDrag($event.dataTransfer!, name)"
              @dragenter.prevent
              @dragover.prevent="$event.dataTransfer!.dropEffect = 'move'"
              @drop.prevent="
                onDrop($event.dataTransfer!.getData('text/plain'), name)
              "
            >
              {{ name }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr
            v-for="(record, number) in body"
            :key="number"
            class="transition-colors hover:bg-zinc-800/50"
          >
            <td
              v-for="name in computedHead"
              :key="name"
              :class="[{ 'border-t': number !== 0 }, 'p-0']"
            >
              <input
                :value="record[name]"
                class="min-w-full scroll-my-12 border-none bg-transparent p-4 text-sm tabular-nums focus:ring-0 focus-visible:outline-hidden"
                inputmode="numeric"
                type="text"
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
              class="sticky bottom-0 h-12 border-t bg-zinc-900 px-4 py-0 font-medium tabular-nums"
            >
              {{ foot[name] }}
            </th>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>
