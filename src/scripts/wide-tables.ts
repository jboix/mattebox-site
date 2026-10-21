/**
 * Keyboard scrolling for wide tables. A doc's table scrolls inside its own box when it is wider
 * than the page, and a box that scrolls needs keyboard focus, or a keyboard cannot reach what is
 * past its edge (WCAG 2.2 SC 2.1.1). A table that fits takes no focus, so Tab skips it.
 */

/**
 * Makes each table focusable while it is wider than its box, and again on every resize.
 *
 * @param tables - The `table` elements.
 */
export function focusWideTables(tables: Iterable<HTMLTableElement>): void {
  const observer = new ResizeObserver((entries) => {
    for (const { target } of entries) {
      const table = target as HTMLTableElement;
      if (table.scrollWidth > table.clientWidth) table.tabIndex = 0;
      else table.removeAttribute('tabindex');
    }
  });
  for (const table of tables) observer.observe(table);
}
