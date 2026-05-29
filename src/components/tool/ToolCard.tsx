import { type Tool } from '../../constants/tools';

export default function ToolCard({ tool, isFavorited = false, onFavoriteToggle = () => { }}: { tool: Tool, isFavorited?: boolean, onFavoriteToggle?: (e: React.MouseEvent, tool: Tool) => void }) {
    return (
        <a
            href={tool.href}
            className="group relative overflow-hidden rounded-xl border border-border bg-surface p-6 transition-all hover:border-accent/50 hover:bg-elevated"
        >
            <button
                type="button"
                onClick={(e) => onFavoriteToggle(e, tool)}
                className={`absolute top-3 right-3 z-30 p-1.5 rounded-lg border transition-all duration-200
                    ${isFavorited 
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500/20' 
                        : 'bg-muted/10 border-transparent text-muted-foreground hover:bg-muted/20 hover:text-foreground'
                    }`}
                aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
            ></button>
            <div
                className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-accent-bg text-accent group-hover:bg-accent group-hover:text-white transition-colors"
                dangerouslySetInnerHTML={{ __html: tool.icon }}
            />

            <h3 className="text-lg font-semibold text-primary mb-2">{tool.name}</h3>

            <p className="text-sm text-secondary">{tool.description}</p>
        </a>
    )
}