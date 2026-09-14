import type { Crop, State, Tool } from "./game";
type Context = {
  registerTool: (
    tool: {
      name: string;
      description: string;
      inputSchema: object;
      annotations: { readOnlyHint: boolean };
      execute: (input: unknown) => unknown;
    },
    options: { signal: AbortSignal },
  ) => void | Promise<void>;
};
export function registerGameTools(
  getState: () => State,
  tendBeds: (beds: number[], tool: Tool, crop: Crop) => string[],
  nextDay: () => string,
) {
  const context = (document as Document & { modelContext?: Context })
    .modelContext;
  if (!context?.registerTool) return;
  const lifecycle = new AbortController();
  const registrations = [
    {
      name: "read_heartwood_farm",
      description:
        "Read the current day, garden beds, inventory, and relationship progress.",
      inputSchema: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true },
      execute: () => JSON.parse(JSON.stringify(getState())),
    },
    {
      name: "tend_heartwood_beds",
      description:
        "Use a tool on one or more garden beds, applying ordinary energy and inventory costs and updating the visible game.",
      inputSchema: {
        type: "object",
        properties: {
          beds: {
            type: "array",
            items: { type: "integer", minimum: 0, maximum: 11 },
            minItems: 1,
            maxItems: 12,
          },
          tool: {
            type: "string",
            enum: ["hand", "hoe", "seed", "water", "harvest"],
          },
          crop: { type: "string", enum: ["turnip", "strawberry", "sunflower"] },
        },
        required: ["beds", "tool", "crop"],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false },
      execute: (input: unknown) => {
        const v = input as { beds: number[]; tool: Tool; crop: Crop };
        if (
          !v ||
          !Array.isArray(v.beds) ||
          !v.beds.length ||
          v.beds.length > 12 ||
          !v.beds.every((x) => Number.isInteger(x) && x >= 0 && x < 12) ||
          !["hand", "hoe", "seed", "water", "harvest"].includes(v.tool) ||
          !["turnip", "strawberry", "sunflower"].includes(v.crop)
        )
          throw new Error("Choose 1–12 valid beds, a garden tool, and a crop.");
        return { results: tendBeds(v.beds, v.tool, v.crop) };
      },
    },
    {
      name: "sleep_in_heartwood",
      description:
        "Complete the day, grow watered crops, restore energy, and save the farm. Unwatered crops wait safely.",
      inputSchema: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false },
      execute: () => ({ message: nextDay(), day: getState().day }),
    },
  ];
  for (const t of registrations) {
    try {
      void Promise.resolve(
        context.registerTool(t, { signal: lifecycle.signal }),
      ).catch(() => {});
    } catch {}
  }
  window.addEventListener("pagehide", () => lifecycle.abort(), { once: true });
}
