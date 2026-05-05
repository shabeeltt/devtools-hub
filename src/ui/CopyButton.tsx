import { useState } from 'react';

type CopyButtonProps = {
    value: string;
    className?: string;
}

export default function CopyButton({ value, className }: CopyButtonProps) {
    const [isCopied, setIsCopied] = useState(false);

    function handleCopyToClipboard() {
        if (!value) {
            return;
        }

        navigator.clipboard.writeText(value);
        setIsCopied(true);

        setTimeout(() => { setIsCopied(false) }, 2000);
    }

    return (
        <button
            onClick={handleCopyToClipboard}
            disabled={isCopied}
            className={`${className} rounded bg-neutral-800 px-3 py-1 text-xs text-white hover:bg-neutral-700`}
        >
            {isCopied ? "Copied" : "Copy"}
        </button>
    )
}