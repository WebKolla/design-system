import type { Decorator } from '@storybook/react-vite'

/**
 * A fixed 1440 stage.
 *
 * Storybook's canvas is roughly 1152 wide, below both of `Container`'s caps, so
 * a layout story measured in it proves the column is full-width and nothing
 * more. Anything asserting that the 1160 or 1280 cap binds, or that a bar is
 * full-bleed while its contents are not, has to be measured above the cap.
 *
 * Not exported from the package: this is test scaffolding. It lives in
 * `src/test` for that reason, which `tsconfig.lib.json` does not include.
 */
export const at1440: Decorator = (Story) => (
  <div style={{ width: 1440 }}>
    <Story />
  </div>
)
