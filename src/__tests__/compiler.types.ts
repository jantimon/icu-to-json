import type { MessageArguments } from "./__snapshots__/cli.test.messages.js";

// example t implementation:
const t = <TKey extends keyof MessageArguments>(key: TKey, args: MessageArguments[TKey]) => {
    // ... actuall implementation
    return "";
}

t("tags", { b: (children) => children, dynamic: "⭐️" });