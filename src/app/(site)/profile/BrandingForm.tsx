"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Upload, Image as ImageIcon, Type, Globe } from "lucide-react";
import { toast } from "sonner";

interface BrandingFormProps {
    user: any;
}

export default function BrandingForm({ user }: BrandingFormProps) {
    const router = useRouter();
    const [brandingType, setBrandingType] = useState<'default' | 'text' | 'image'>(
        user.company_branding_type || 'default'
    );
    const [brandingText, setBrandingText] = useState(user.company_branding_text || "");
    const [brandingImage, setBrandingImage] = useState(user.company_branding_image || "");
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
        if (!validTypes.includes(file.type)) {
            toast.error("Only image files (JPEG, PNG, GIF, WEBP, SVG) are allowed");
            return;
        }

        // Validate file size (2MB for branding)
        if (file.size > 2 * 1024 * 1024) {
            toast.error("File size exceeds 2MB limit");
            return;
        }

        setIsUploading(true);
        const loadingToast = toast.loading("Uploading branding image...");

        try {
            const formData = new FormData();
            formData.append("file", file);
            if (brandingImage) {
                formData.append("previousUrl", brandingImage);
            }

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Upload failed");
            }

            setBrandingImage(data.url);
            toast.success("Image uploaded successfully!");
        } catch (error: any) {
            toast.error(error.message || "Failed to upload image");
        } finally {
            setIsUploading(false);
            toast.dismiss(loadingToast);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch("/api/profile/update-branding", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    company_branding_type: brandingType,
                    company_branding_text: brandingType === 'text' ? brandingText : null,
                    company_branding_image: brandingType === 'image' ? brandingImage : null,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to update branding");
            }

            toast.success("Branding updated successfully!");
            router.refresh();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            <div className="space-y-4">
                <Label className="text-base font-semibold">Bio Page Footer Branding</Label>
                <p className="text-sm text-muted-foreground">
                    Customize the footer branding that appears on your bio pages. Choose between default "Made with liinks.co", custom text, or your company logo.
                </p>

                {/* Branding Type Selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <button
                        type="button"
                        onClick={() => setBrandingType('default')}
                        className={`p-4 border-2 rounded-lg transition-all hover:border-blue-500 ${brandingType === 'default'
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                                : 'border-gray-200 dark:border-gray-700'
                            }`}
                    >
                        <div className="flex flex-col items-center gap-2">
                            <Globe className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                            <span className="font-medium text-sm">Default</span>
                            <span className="text-xs text-muted-foreground text-center">
                                Made with liinks.co
                            </span>
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() => setBrandingType('text')}
                        className={`p-4 border-2 rounded-lg transition-all hover:border-blue-500 ${brandingType === 'text'
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                                : 'border-gray-200 dark:border-gray-700'
                            }`}
                    >
                        <div className="flex flex-col items-center gap-2">
                            <Type className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                            <span className="font-medium text-sm">Custom Text</span>
                            <span className="text-xs text-muted-foreground text-center">
                                Your company name
                            </span>
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() => setBrandingType('image')}
                        className={`p-4 border-2 rounded-lg transition-all hover:border-blue-500 ${brandingType === 'image'
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                                : 'border-gray-200 dark:border-gray-700'
                            }`}
                    >
                        <div className="flex flex-col items-center gap-2">
                            <ImageIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                            <span className="font-medium text-sm">Company Logo</span>
                            <span className="text-xs text-muted-foreground text-center">
                                Upload your logo
                            </span>
                        </div>
                    </button>
                </div>

                {/* Custom Text Input */}
                {brandingType === 'text' && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        <Label htmlFor="brandingText">Company Name or Text</Label>
                        <Input
                            id="brandingText"
                            value={brandingText}
                            onChange={(e) => setBrandingText(e.target.value)}
                            placeholder="e.g., Made with ❤️ by Your Company"
                            maxLength={50}
                        />
                        <p className="text-xs text-muted-foreground">
                            Maximum 50 characters. This will appear in the footer of your bio pages.
                        </p>
                    </div>
                )}

                {/* Image Upload */}
                {brandingType === 'image' && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        <Label htmlFor="brandingImage">Company Logo</Label>

                        {brandingImage ? (
                            <div className="space-y-3">
                                <div className="relative w-full max-w-xs p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
                                    <img
                                        src={brandingImage}
                                        alt="Company branding"
                                        className="max-h-16 mx-auto object-contain"
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => document.getElementById('brandingImageInput')?.click()}
                                    disabled={isUploading}
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    Replace Image
                                </Button>
                            </div>
                        ) : (
                            <div
                                onClick={() => document.getElementById('brandingImageInput')?.click()}
                                className="cursor-pointer w-full max-w-xs p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-blue-500 transition-colors bg-gray-50 dark:bg-gray-900"
                            >
                                <div className="flex flex-col items-center gap-2 text-center">
                                    <Upload className="w-8 h-8 text-gray-400" />
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Click to upload logo
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        PNG, JPG, GIF, WEBP, SVG up to 2MB
                                    </p>
                                </div>
                            </div>
                        )}

                        <input
                            id="brandingImageInput"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={isUploading}
                        />

                        <p className="text-xs text-muted-foreground">
                            Recommended: Transparent PNG with your logo. Max height will be 40px in the footer.
                        </p>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button type="submit" disabled={isLoading || isUploading}>
                    {isLoading ? "Saving..." : "Save Branding Settings"}
                </Button>
                {(brandingType !== user.company_branding_type ||
                    brandingText !== user.company_branding_text ||
                    brandingImage !== user.company_branding_image) && (
                        <span className="text-sm text-amber-600 dark:text-amber-500">
                            You have unsaved changes
                        </span>
                    )}
            </div>
        </form>
    );
}
