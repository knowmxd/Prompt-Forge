# Prompt for your site agent

I'm attaching the wardrobe library as **two zip files**. Unzip both into the same folder; together they form one library:
- `wardrobe_library_v1.1_part1of2.zip`: `wardrobe_library.json` (schema + 213 items + 49 outfits), `AGENT_README.md`, `AGENT_PROMPT.md`, all 49 outfit shots in `shots/outfits/`, and the item shots for headwear, eyewear, jewelry, neckwear, tops, layer tops and outerwear in `shots/items/`
- `wardrobe_library_v1.1_part2of2.zip`: the rest of `shots/items/` (dresses, bottoms, belts, legwear, shoes, bags, accessories)

The 262 images are white-background product shots, and each one matches an entry's `image` path. Keep the folder layout so the paths resolve. Read `AGENT_README.md` before you start.

Build the wardrobe feature:

1. **Slot pickers.** Create one picker tab per entry in `slots[]`, showing that slot's items as cards with `name` + `image`. Use `style_tags` as filter chips.
2. **Prompt composition.** When the user selects items, build the `wardrobe` prompt text by joining each item's `prompt` with `"; "` in `composition.slot_order` (outerwear first, accessories last). Merge the items' `negative` lists without duplicates. A `dress_onepiece` replaces both `top` and `bottom`.
3. **Outfit cards.** Show the `outfits[]` entries as cards with `name` + `image`. Clicking one applies the outfit's `slots` to every picker slot. The default mode is `replace_all_slots` (unused slots are cleared). Also offer a `merge` option that only overwrites the slots the outfit fills. Then rebuild the prompt.
4. **User saves.** Let users save their own items and outfits, using the same schema. Set `user_created: true` and follow the id patterns in the README. Never overwrite built-in outfits.
5. **Stable ids.** Never rename or renumber existing ids. Outfits, `outfit_ids`, and saved user data all depend on them.
6. **Details.** `AGENT_README.md` has the field meanings, the composition rules, the `applyOutfit` reference code, and the save/delete rules.
7. **Schema changes.** Ask me before you add, remove, or rename any field, or change the structure of the JSON.
