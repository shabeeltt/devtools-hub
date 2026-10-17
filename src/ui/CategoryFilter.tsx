import Button from "./Button";
import { type Category } from "../constants/tools";

interface CategoryFilterProps {
  categories: { name: Category | "All"; count: number }[];
  activeCategory: Category | "All";
  onSelect: (category: Category | "All") => void;
}

export default function CategoryFilter({
  categories,
  activeCategory,
  onSelect,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {categories.map((cat) => (
        <Button
          key={cat.name}
          variant={activeCategory === cat.name ? "primary" : "secondary"}
          onClick={() => onSelect(cat.name)}
        >
          {cat.name} <span className="opacity-75 text-sm ml-1">({cat.count})</span>
        </Button>
      ))}
    </div>
  );
}
