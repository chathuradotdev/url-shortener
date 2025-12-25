import { BioPage, BioLink } from "@/lib/db";
import BioRenderer from "./BioRenderer";

interface BioPreviewProps {
    bioPage: Partial<BioPage>;
    links: BioLink[];
}

export default function BioPreview({ bioPage, links }: BioPreviewProps) {
    return (
        <div className="mx-auto w-[320px] h-[640px] bg-gray-900 rounded-[3rem] p-4 shadow-2xl relative border-8 border-gray-800 box-content">
            {/* Phone Notch/Header */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-6 w-32 bg-gray-800 rounded-b-2xl z-10"></div>

            {/* Screen Content */}
            <div className="w-full h-full bg-white overflow-hidden rounded-[2.2rem]">
                <BioRenderer bioPage={bioPage} links={links} />
            </div>
        </div>
    );
}
