import { Input } from "@/components/ui/input";
import { labels } from "@/lib/labels";

/** GET form that puts the search term into the URL (?q=...). No JS required. */
export function SearchBar({
  placeholder,
  defaultValue,
}: {
  placeholder?: string;
  defaultValue?: string;
}) {
  return (
    <form>
      <Input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder={placeholder ?? labels.actions.search}
        className="max-w-sm"
        aria-label={labels.actions.search}
      />
    </form>
  );
}
