import { type Tool } from '../constants/tools';
import { useState, useEffect } from 'react';
import ToolCard from './tool/ToolCard';

export default function ToolManager({ tools }: { tools: Tool[] }) {
    const [favoriteTools, setFavoriteTools] = useState<Tool[]>([]);

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
                <p className="text-secondary">
                    Essential utilities to boost your productivity.
                </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {tools.map(tool => <ToolCard isFavorited={favoriteTools.some(t => t.href === tool.href)} key={tool.href} tool={tool} onFavoriteToggle={onFavoriteToggle}></ToolCard>)}
            </div>
        </div>
    )
}