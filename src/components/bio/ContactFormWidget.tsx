import { useState } from 'react';
import { Send, CheckCircle2, Loader2 } from 'lucide-react';
import { BioLink } from '@/lib/db';
import { toast } from 'sonner';

interface ContactFormWidgetProps {
    link: BioLink;
    theme: any;
    bioPageId?: string;
    glassEffect?: boolean;
}

export default function ContactFormWidget({ link, theme, bioPageId, glassEffect }: ContactFormWidgetProps) {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const buttonBgColor = theme?.buttonBgColor || '#f3f4f6';
    const buttonTextColor = theme?.buttonTextColor || '#1f2937';

    // We treat link.title as the form query/CTA
    const title = link.title || "Contact Us";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast.error("Email is required");
            return;
        }

        if (!bioPageId) {
            // Preview mode - simulate delay
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                setSuccess(true);
                toast.success("Form submitted (Preview Mode)");
            }, 1000);
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/bio/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bioPageId,
                    email,
                    name,
                    message
                })
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || 'Failed to submit');
            }

            setSuccess(true);
            toast.success("Message sent successfully!");
            // Reset form
            setEmail('');
            setName('');
            setMessage('');
        } catch (error) {
            console.error("Form error:", error);
            toast.error("Failed to send message. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div
                className={`w-full p-8 rounded-2xl flex flex-col items-center justify-center text-center gap-2 shadow-lg animate-fade-in ${glassEffect ? 'backdrop-blur-xl border border-white/20' : ''}`}
                style={{
                    backgroundColor: glassEffect ? 'rgba(255, 255, 255, 0.1)' : buttonBgColor,
                    color: glassEffect ? '#ffffff' : buttonTextColor
                }}
            >
                <CheckCircle2 className="w-8 h-8 opacity-80" />
                <h4 className="font-bold text-lg">Message Sent!</h4>
                <p className="text-sm opacity-80">Thanks for reaching out. We'll get back to you soon.</p>
                <button
                    onClick={() => setSuccess(false)}
                    className="mt-4 text-xs underline opacity-60 hover:opacity-100"
                >
                    Send another message
                </button>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className={`w-full p-6 rounded-2xl flex flex-col gap-3 shadow-lg ${glassEffect ? 'backdrop-blur-xl border border-white/20' : ''}`}
            style={{
                backgroundColor: glassEffect ? 'rgba(255, 255, 255, 0.1)' : buttonBgColor,
                color: glassEffect ? '#ffffff' : buttonTextColor
            }}
        >
            <h4 className="font-black text-sm">{title}</h4>

            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-4 py-2.5 text-xs rounded-xl border outline-none transition-all placeholder:opacity-50 bg-inherit/5 focus:bg-inherit/10`}
                style={{
                    borderColor: 'currentColor',
                    opacity: 0.9,
                    color: 'inherit'
                }}
            />

            <input
                type="email"
                placeholder="Email Address *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-2.5 text-xs rounded-xl border outline-none transition-all placeholder:opacity-50 bg-inherit/5 focus:bg-inherit/10`}
                style={{
                    borderColor: 'currentColor',
                    opacity: 0.9,
                    color: 'inherit'
                }}
                required
            />

            <textarea
                placeholder="Your Message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className={`w-full px-4 py-2.5 text-xs rounded-xl border outline-none resize-none transition-all placeholder:opacity-50 bg-inherit/5 focus:bg-inherit/10`}
                style={{
                    borderColor: 'currentColor',
                    opacity: 0.9,
                    color: 'inherit'
                }}
            />

            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl px-4 py-3 font-black text-xs hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:scale-100 mt-1"
                style={{
                    backgroundColor: glassEffect ? '#ffffff' : buttonTextColor,
                    color: glassEffect ? '#000000' : buttonBgColor
                }}
            >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Send className="w-3.5 h-3.5" /> Send Message</>}
            </button>
        </form>
    );
}
