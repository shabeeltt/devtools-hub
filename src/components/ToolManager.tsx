import { type Tool, type Category, CATEGORIES } from '../constants/tools';
import { useState, useEffect, useMemo } from 'react';
import ToolCard from './tool/ToolCard';
import CategoryFilter from '../ui/CategoryFilter';

export default function ToolManager({ tools }: { tools: Tool[] }) {
    const [favoriteTools, setFavoriteTools] = useState<Tool[]>([]);
    const [activeCategory, setActiveCategory] = useState<Category | "All">("All");

    function setFavorites(array: Tool[]){
        localStorage.setItem('favorite_tools', JSON.stringify(array.map(m => m.href)));
        setFavoriteTools(array);
    }

    function onFavoriteToggle(e: React.MouseEvent, tool: Tool){
        e.preventDefault();
        e.stopPropagation();

        if(favoriteTools.length === 0){
            setFavorites([tool]);
        } else {
            setFavorites(favoriteTools.some(t => t.href === tool.href) ? favoriteTools.filter(t => t.href != tool.href) : [...favoriteTools, tool]);
        }
    }

    useEffect(() => {
        const localFavorites = localStorage.getItem('favorite_tools');
        if(localFavorites == null) return setFavorites([]);
        const parsedFavorites = JSON.parse(localFavorites as string) as string[];
        const validatedFavorites = (parsedFavorites)
            .map(m => tools.find(t => t.href === m) ?? null)
            .filter(f => f != null);
        if(validatedFavorites.length === parsedFavorites.length) return setFavoriteTools(validatedFavorites);
        setFavorites(validatedFavorites);
    }, []);

    useEffect(() => {
        const syncCategoryFromUrl = () => {
            const params = new URLSearchParams(window.location.search);
            const categoryParam = params.get("category");
            if (categoryParam) {
                const matchedCategory = CATEGORIES.find(c => c.toLowerCase() === categoryParam.toLowerCase());
                if (matchedCategory) {
                    setActiveCategory(matchedCategory);
                } else {
                    setActiveCategory("All");
                }
            } else {
                setActiveCategory("All");
            }
        };

        syncCategoryFromUrl();
        window.addEventListener("popstate", syncCategoryFromUrl);
        return () => window.removeEventListener("popstate", syncCategoryFromUrl);
    }, []);

    const handleCategorySelect = (category: Category | "All") => {
        setActiveCategory(category);
        const url = new URL(window.location.href);
        if (category === "All") {
            url.searchParams.delete("category");
        } else {
            url.searchParams.set("category", category.toLowerCase());
        }
        window.history.pushState(null, "", url.toString());
    };

    const categoriesWithCounts = useMemo(() => {
        const counts: Record<string, number> = { All: tools.length };
        CATEGORIES.forEach(c => counts[c] = 0);
        tools.forEach(t => {
            if (t.category && counts[t.category] !== undefined) {
                counts[t.category]++;
            }
        });
        
        const result = [{ name: "All" as const, count: counts["All"] }];
        CATEGORIES.forEach(c => {
            result.push({ name: c, count: counts[c] });
        });
        return result;
    }, [tools]);

    const displayTools = useMemo(() => {
        if (activeCategory === "All") return tools;
        return tools.filter(t => t.category === activeCategory);
    }, [tools, activeCategory]);

    return (
        <div>
            {(favoriteTools.length !== 0) && (
                <div className="mb-12">
                    <div>
                        <div className="mb-12">
                            <h2 className="text-3xl font-bold text-primary tracking-tight mb-2">
                                Favorite Tools
                            </h2>
                            <p className="text-secondary">
                                Click on the star icon to toggle favority of the tools.
                            </p>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {favoriteTools.map(tool => <ToolCard onFavoriteToggle={onFavoriteToggle} isFavorited={true} key={tool.href} tool={tool}></ToolCard>)}
                        </div>
                    </div>
                </div>
            )}
            <div className="mb-12">
                <h2 className="text-3xl font-bold text-primary tracking-tight mb-2">
                    Available Tools
                </h2>
                <p className="text-secondary mb-6">
                    Essential utilities to boost your productivity.
                </p>
                <CategoryFilter 
                    categories={categoriesWithCounts} 
                    activeCategory={activeCategory} 
                    onSelect={handleCategorySelect} 
                />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {displayTools.map(tool => <ToolCard isFavorited={favoriteTools.some(t => t.href === tool.href)} key={tool.href} tool={tool} onFavoriteToggle={onFavoriteToggle}></ToolCard>)}
            </div>
        </div>
    )
}