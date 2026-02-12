
import { getWelcomeEmailHtml, getVerificationEmailHtml } from "@/lib/email-templates";

export default function EmailPreviewPage() {
    const welcomeHtml = getWelcomeEmailHtml("User", "#");
    const verifyHtml = getVerificationEmailHtml("123456");

    return (
        <div className="min-h-screen bg-gray-100 p-8 flex flex-col gap-8">
            <div>
                <div className="mb-4">
                    <h1 className="text-xl font-bold mb-2">Welcome Email Preview</h1>
                </div>
                <div className="border border-gray-300 rounded shadow-sm overflow-hidden bg-white">
                    <iframe
                        srcDoc={welcomeHtml}
                        title="Welcome Email Preview"
                        className="w-full h-[800px]"
                        style={{ border: 'none' }}
                    />
                </div>
            </div>

            <div>
                <div className="mb-4">
                    <h1 className="text-xl font-bold mb-2">Verification Email Preview</h1>
                </div>
                <div className="border border-gray-300 rounded shadow-sm overflow-hidden bg-white">
                    <iframe
                        srcDoc={verifyHtml}
                        title="Verification Email Preview"
                        className="w-full h-[800px]"
                        style={{ border: 'none' }}
                    />
                </div>
            </div>
        </div>
    );
}
