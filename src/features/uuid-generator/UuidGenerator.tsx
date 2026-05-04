import { useState } from 'react'
import CopyButton from '../../components/tool/CopyButton';

export default function UuidGenerator() {
    const [uuid, setUuid] = useState("");


    function handleGenerate() {
        const newUuid = crypto.randomUUID(); 
        setUuid(newUuid);
    } 

    function handleClear() {
        setUuid("");
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="relative">
                <input
                    readOnly
                    value={uuid}
                    placeholder="Generated UUID will appear here"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-4 font-mono text-sm text-white outline-none"
                />
                {uuid && (
                    <CopyButton
                        value={uuid}
                        className="absolute right-4 top-4"
                    />
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
