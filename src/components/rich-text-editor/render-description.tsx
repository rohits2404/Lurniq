"use client";

import TextAlign from "@tiptap/extension-text-align";
import { generateHTML, JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import parse from "html-react-parser";
import { useEffect, useState } from "react";

export const RenderDescription = ({ json }: { json: JSONContent }) => {
    const [output, setOutput] = useState("");

    useEffect(() => {
        const generatedOutput = generateHTML(json, [
            StarterKit,
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
        ]);
        setOutput(generatedOutput);
    }, [json]);

    return (
        <div className="prose dark:prose-invert prose-li:marker:text-primary">
            {parse(output)}
        </div>
    );
};
