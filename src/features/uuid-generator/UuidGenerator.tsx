import { useState } from 'react'
import CopyButton from '../../ui/CopyButton';
import ToolActions from '../../components/tool/ToolActions';
import Button from '../../ui/Button';

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

            <ToolActions>
                <Button 
                    variant="primary" 
                    onClick={handleGenerate}
                >
                    Generate UUID
                </Button>

                {uuid && (
                    <Button 
                        variant="secondary" 
                        onClick={handleClear}
                    >
                        Clear
                    </Button>
                )}
            </ToolActions>
        </div>
    );  
}
