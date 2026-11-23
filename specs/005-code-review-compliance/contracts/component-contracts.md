# Component & Utility Contracts

## 1. TableHead Component Contract

- **Module**: `src/components/table/tableHead.tsx`
- **Props**:
  ```typescript
  export interface TableHeadItem {
    key: TableHeadField;
    label: string;
  }

  interface Props {
    headerItems: TableHeadItem[];
  }
  ```
- **Accessibility**:
  - `aria-sort`: `"ascending" | "descending" | "none"`
  - `tabIndex`: `0`
  - `onKeyDown`: Triggers `handleSort(item.key)` on `Enter` or `Space`

## 2. SortContext Contract

- **Module**: `src/contexts/SortContext.tsx`
- **Interface**:
  ```typescript
  export type SortDirection = "asc" | "desc" | null;
  export type TableHeadField = "standard" | "code" | "id" | "od" | "cs";

  interface SortContextProps {
    sortBy: TableHeadField | null;
    sortDirection: SortDirection;
    setSortBy: (sortBy: TableHeadField | null) => void;
    setSortDirection: (sortDirection: SortDirection) => void;
    resetSort: () => void;
  }
  ```

## 3. Debounce Utility Contract

- **Module**: `src/utils/debounce.ts`
- **Signature**:
  ```typescript
  export interface DebouncedFunction<T extends (...args: unknown[]) => void> {
    (...args: Parameters<T>): void;
    cancel: () => void;
  }

  export function debounce<T extends (...args: unknown[]) => void>(
    fn: T,
    delay: number
  ): DebouncedFunction<T>;
  ```

## 4. Maintenance Scripts Contract

- **Modules**: `scripts/audit-codebase.mjs`, `scripts/check-i18n-parity.mjs`
- **Path Resolution Contract**:
  ```javascript
  import { fileURLToPath } from "node:url";
  import { dirname, resolve } from "node:path";

  const __dirname = dirname(fileURLToPath(import.meta.url));
  const REPO_ROOT = resolve(__dirname, "..");
  ```
- **Environment Support**: Node 18+, Node 20+, Node 22+.
