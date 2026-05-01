import { useState } from 'react'

export default function UuidGenerator() {
    const [uuid, setUuid] = useState("");
    const [copied, setCopied] = useState(false);

    function handleGenerate() {
        const newUuid = crypto.randomUUID(); 
        setUuid(newUuid);
    } 

    function handleCopy() {
        if (!uuid) return;

        navigator.clipboard.writeText(uuid);
        setCopied(true);

        setTimeout(() => setCopied(false), 2000);
    }

    function handleClear() {
        setUuid("");
        setCopied(false);
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="relative">
                <textarea
                    readOnly
                    value={uuid}
                    placeholder="Generated UUID will appear here"
                    rows={1}
                    className="custom-scrollbar w-full rounded-xl border border-neutral-800 bg-neutral-900 p-4 font-mono text-sm text-white outline-none"
                />
                {uuid && (
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="absolute right-4 top-4 rounded bg-neutral-800 px-3 py-1 text-xs text-white hover:bg-neutral-700"
                    >
                        {copied ? "Copied" : "Copy"}
                    </button>
                )}
            </div>

            <div className="flex justify-center gap-4">
                <button 
                    className="rounded-full px-6 py-2 text-white bg-blue-600 hover:bg-blue-500"
                    onClick={handleGenerate}
                >
                    Generate UUID
                </button>

                {uuid && (
                    <button 
                        className="rounded-full bg-neutral-600 px-6 py-2 text-white hover:bg-neutral-700"
                        onClick={handleClear}
                    >
                        Clear
                    </button>
                )}
            </div>
        </div>
    );  
}
