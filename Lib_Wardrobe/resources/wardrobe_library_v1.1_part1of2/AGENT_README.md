# Wardrobe Library v1.1: guide for the site-building agent

**File:** `wardrobe_library.json` (UTF-8 JSON, validated with Python `json.load`).
**Contents:** 213 items, 49 outfit presets and 14 slots, built from 46 reference images: 45 were used and 1 was skipped.

## Top-level keys
- `library`, `version`, `created`, `description`: metadata.
- `schema`: one-line meaning of every item field.
- `composition`: the slot order and the merge rule (also below).
- `slots[]`: `{slot, description, subcategories[], item_count}`. Use these as the picker tabs on the site.
- `style_tag_vocabulary`: `{tag: definition}`. This is the controlled list. Every `style_tags` value comes from it. Use these as filter chips.
- `items[]`: wardrobe pieces. These are the cards.
- `outfits[]`: full-look presets (see **Outfits** below). `outfit_schema` describes their fields.
- `outfit_feature`: the spec for applying and saving outfits (apply modes, slot order, user-saved outfits).
- `skipped[]`: images that were not used, with the reason.

## Item fields
- `id`: stable key, `slot_subcategory_descriptor_color_NN`
- `name`: card title
- `slot` / `subcategory`: picker grouping
- `style_tags`, `colors`, `materials`, `patterns`: filters and search
- `fit_silhouette`, `details`, `styling_notes`: card detail text, plus extra context if you want longer prompts
- `prompt`: **the text to inject.** A standalone phrase written for the generator.
- `prompt_brand_free`: present only when `prompt` names a brand. Use it when the generator refuses brands or the user turns brands off.
- `negative`: optional negative-prompt terms
- `source_images`: which reference images the item came from
- `render_style_seen`: `illustration`, `photo` or `both`
- `outfit_ids`: the outfits this item belongs to
- `image`: its white-background product shot, `shots/items/<item_id>.jpg`

## Composing a prompt from picked items
1. Collect the picked item ids.
2. Sort them by `composition.slot_order`:
   `outerwear > layer_top > top > dress_onepiece > bottom > belt_waist > legwear > shoes > headwear > eyewear > neckwear > jewelry > bag > accessory`
   (outerwear first, accessories last).
3. A `dress_onepiece` replaces the top and the bottom. Warn the user, or drop the clashing pick, when both are chosen.
4. Join each item's `prompt` with `"; "` and put the result in a `wardrobe` field:
```json
{
  "subject": "...",
  "wardrobe": "very oversized navy nylon windbreaker ...; crisp white knife-pleated tennis mini skirt ...; thick white ribbed slouch socks ...; glossy black patent leather loafers ...",
  "negative": ["...merged, deduplicated item negatives..."],
  "style": "...", "lighting": "...", "camera": "..."
}
```
5. Merge every picked item's `negative` into one deduplicated list.
6. To get a full look in one tap, use `outfits[].prompt`. It is already composed in the order above (see **Outfits**).

## Adding new items (user-saved pieces)
- Use the same schema. Pick `slot` from `slots[].slot`. Reuse an existing `subcategory` where one fits, or add a new one to that slot's `subcategories`.
- **id:** `slot_subcategory_descriptor_color_01`, all lowercase snake_case. Increment the `_NN` suffix for variants.
- **style_tags:** use only vocabulary keys. To add a tag, add it to `style_tag_vocabulary` with a one-line definition.
- **prompt rules:**
  - 15–40 words of concrete visual language, in this order: color and shade, material and texture, cut and length, fit and volume, closures, trims, print described visually, wear or distressing, and how the piece sits on the body.
  - No brand names unless the logo is the point. In that case, also fill `prompt_brand_free`.
  - Never describe the wearer's body or identity.
- Set `source_images` to wherever the image came from, such as an upload id or a URL, and set `render_style_seen`.
- Update `slots[].item_count` and validate with `json.load` before saving.

## Outfits (new in v1.1)
An outfit is a saved template that fills **every** wardrobe slot in one click.

**Fields** (`outfit_schema` in the JSON has the full list):
- `id`, `name` (card title, e.g. "Cream Sherpa & Stripes"), `style_tags`
- `slots`: an object with **all 14 slot names** as keys. Each value is an array of item ids. An empty array means the outfit leaves that slot empty, which lets the apply step clear it.
- `item_ids`: the same ids as one flat list, in slot order
- `prompt`: the combined wardrobe prompt, already in slot order. `prompt_brand_free` is included when any item names a brand.
- `negative`: merged item negatives
- `source_images`, `image` (`shots/outfits/<outfit_id>.jpg`, a white-background flat-lay of the whole look), `user_created` (`false` for the 49 built-ins)

Each item also lists `outfit_ids`, so an item card can show "appears in" links.

**Applying an outfit** (`outfit_feature`):
- `replace_all_slots` (**default**): for every slot in `slot_order`, set `picker[slot] = outfit.slots[slot]`. Unused slots become empty, so the result is exactly the outfit.
- `merge`: only overwrite slots the outfit fills and keep the user's other picks. A `dress_onepiece` clears `top` and `bottom`, and a `top` or `bottom` clears `dress_onepiece`.
- After applying, rebuild the prompt from the picker using the composition rule. For an unedited outfit this gives exactly `outfit.prompt`.

```js
function applyOutfit(picker, outfit, mode = "replace_all_slots") {
  for (const slot of lib.outfit_feature.slot_order) {
    const ids = outfit.slots[slot] || [];
    if (mode === "replace_all_slots" || ids.length) picker[slot] = [...ids];
  }
  if (mode === "merge") {
    if (outfit.slots.dress_onepiece.length) { picker.top = []; picker.bottom = []; }
    else if (outfit.slots.top.length || outfit.slots.bottom.length) picker.dress_onepiece = [];
  }
  return picker;
}
```

**Saving the user's own outfit:** take a snapshot of the picker using the same schema.
- `id`: `outfit_user_<slug>_NN`
- `name`: set by the user
- `slots`: all 14 keys
- `item_ids`, `prompt` and `negative`: recomputed from the picked items
- `style_tags`: taken from the items
- `image`: `null` until a shot exists
- `user_created`: `true`

Append the new outfit to `outfits[]` and add its id to each member item's `outfit_ids`. Re-saving a user outfit overwrites it by id. Built-in outfits are never overwritten; save a copy instead. Deleting an outfit removes it and its id from `items[].outfit_ids`.

A slot can hold more than one item, for example layered necklaces in `jewelry`, or a belt plus a chain belt. Keep the array order.

**Images:** paths are relative to the library folder:
- `shots/outfits/` holds the 49 outfit flat-lays
- `shots/items/` holds one shot per item

All are JPGs on a white background, up to 720px on the long side: outfit shots are 3:4 and item shots are square.
