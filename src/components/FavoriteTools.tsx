import ToolCard from './tool/ToolCard.tsx';
import { useState, useEffect } from 'react';
import { tools, type Tool } from '../constants/tools';

export default function FavoriteTools() {
    const [favoriteTools, setFavoriteTools] = useState<Tool[]>([]);

    useEffect(() => {
        const localFavorites = localStorage.getItem('favorite_tools');
        if (localFavorites == null || localFavorites.length == 0) return;
        setFavoriteTools(tools.filter(tool => localFavorites.includes(tool.href)));
    }, []);

    function onFavoriteToggle(e: React.MouseEvent, tool: Tool){
        e.preventDefault();
        e.stopPropagation();

        setFavoriteTools(favoriteTools.includes(tool) ? favoriteTools.filter(t => t != tool) : [...favoriteTools, tool]);
    }

    return (
        <div>
            {(favoriteTools.length === 0) && (
                <div>
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-primary tracking-tight mb-2">
                            Available Tools
                        </h2>
                        <p className="text-secondary">
                            Essential utilities to boost your productivity.
                        </p>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {tools.map(tool => <ToolCard onFavoriteToggle={onFavoriteToggle} isFavorited={favoriteTools.includes(tool)} key={tool.name} tool={tool}></ToolCard>)}
                    </div>
                </div>
            )}
        </div>
    )
}