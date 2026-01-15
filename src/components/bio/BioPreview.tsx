import { BioPage, BioLink } from "@/lib/db";
import BioRenderer from "./BioRenderer";

interface BioPreviewProps {
    bioPage: Partial<BioPage>;
    links: BioLink[];
    allPages?: BioPage[];
}

export default function BioPreview({ bioPage, links, allPages = [] }: BioPreviewProps) {
    return (
        <div className="mx-auto w-[300px] h-[600px] bg-white rounded-[2.5rem] relative border-[12px] border-slate-800 shadow-2xl box-border overflow-hidden ring-1 ring-black/5">
            {/* Screen Content */}
            <div className="w-full h-full bg-white overflow-hidden rounded-[1.8rem]">
                <BioRenderer bioPage={bioPage} links={links} variant="preview" allPages={allPages} />
            </div>

            {/* Subtle inner reflection/glare */}
            <div className="absolute top-0 left-0 w-full h-full rounded-[1.8rem] pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.05)]"></div>
        </div>
    );
}
