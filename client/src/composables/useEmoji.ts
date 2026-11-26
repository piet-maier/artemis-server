import { useGridStore } from "@/stores/grid";
import { usePlayerStore } from "@/stores/player";
import { storeToRefs } from "pinia";
import { computed } from "vue";

export function useEmoji() {
  const playerStore = usePlayerStore();
  const { playerNameByID } = playerStore;
  const { turnIndicatorId } = storeToRefs(playerStore);

  const { data } = useGridStore();

  const activePlayers = computed(() =>
    data.head
      .filter((id) => data.foot[id] !== null)
      .sort((a, b) => data.foot[b] - data.foot[a]),
  );

  const placement = computed(() =>
    activePlayers.value.indexOf(turnIndicatorId.value),
  );

  const emojiResult = computed(() => {
    switch (data.foot[turnIndicatorId.value]) {
      case 4:
        return "4️⃣";
      case 7:
        return "🍀";
      case 67:
        return " ⁶🤷‍♂️⁷";
      case 69:
        return "😏";
      case 420:
        return "🥦";
      case 666:
        return "😈";
      case 1337:
        return "🤓";
      case 10000:
        return "🎲";
    }
    switch (placement.value) {
      case 0: {
        switch (playerNameByID(turnIndicatorId.value)) {
          case "Fax":
            return "✈️";
          case "Tobienchen":
            return "🌚";
          case "Nikman":
            return "🧜🏿‍♀️";
          case "Pert":
            return "🕴🏻";
          case "Schmelzofen":
            return "🗿";
          case "Herni":
            return "🪤";
          case "Hoctor Dirsch":
            return "🦌";
          case "Rilo":
            return "🐳";
          case "Prophet":
            return "👙";
          case "Chirs":
            return "🥵";
          default:
            return "👑";
        }
      }
      case activePlayers.value.length - 1:
        return "📉";
      case activePlayers.value.length - 2:
        return "🐟";
      case 1:
        return "🧙‍♀️";
      case 2:
        return "🫃";
      case 3:
        return "🤕";
      case 4:
        return "😤";
      case 5:
        return "😭";
      default:
        return "";
    }
  });
  return emojiResult;
}
