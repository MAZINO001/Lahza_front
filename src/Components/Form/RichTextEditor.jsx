import React, { useRef, useState } from "react";
import { Bold, Italic, Underline } from "lucide-react";

function RichTextEditor({
    label,
    placeholder = "Write your content...",
    value,
    onChange,
    error,
    className,
    ...props
}) {
    const editorRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);

    const execCommand = (command) => {
        document.execCommand(command, false, null);
        editorRef.current?.focus();
    };

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        document.execCommand('insertText', false, text);
    };

    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {label}
                </label>
            )}
            <div className="border rounded-md overflow-hidden bg-white">
                <div className="flex gap-1 p-2 border-b bg-gray-50">
                    <button
                        type="button"
                        aria-label="Bold"
                        onClick={() => execCommand('bold')}
                        className="p-2 hover:bg-gray-200 rounded transition-colors"
                        title="Bold (Ctrl+B)"
                    >
                        <Bold size={16} />
                    </button>
                    <button
                        type="button"
                        aria-label="Italic"
                        onClick={() => execCommand('italic')}
                        className="p-2 hover:bg-gray-200 rounded transition-colors"
                        title="Italic (Ctrl+I)"
                    >
                        <Italic size={16} />
                    </button>
                    <button
                        type="button"
                        aria-label="Underline"
                        onClick={() => execCommand('underline')}
                        className="p-2 hover:bg-gray-200 rounded transition-colors"
                        title="Underline (Ctrl+U)"
                    >
                        <Underline size={16} />
                    </button>
                </div>
                <div
                    ref={editorRef}
                    contentEditable
                    onInput={handleInput}
                    onPaste={handlePaste}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="min-h-[120px] p-3 outline-none text-sm"
                    suppressContentEditableWarning
                    style={{
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word'
                    }}
                    dangerouslySetInnerHTML={{ __html: value }}
                />
            </div>
            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}

export default RichTextEditor;