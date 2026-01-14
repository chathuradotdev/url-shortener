"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Download, Printer, FileImage } from "lucide-react";

interface QrCodeDisplayProps {
    url: string;
    altText?: string;
    options?: {
        width?: number;
        margin?: number;
        color?: {
            dark?: string;
            light?: string;
        };
    };
    variant?: 'default' | 'minimal' | 'mobile-sheet';
}

export default function QrCodeDisplay({ url, altText = "QR Code", options, variant = 'default' }: QrCodeDisplayProps) {
    const [qrDataUrl, setQrDataUrl] = useState<string>("");

    const qrOptions = {
        width: options?.width || 400,
        margin: options?.margin ?? 2,
        color: {
            dark: options?.color?.dark || "#000000",
            light: options?.color?.light || "#ffffff",
        }
    };

    useEffect(() => {
        let isMounted = true;
        if (url) {
            QRCode.toDataURL(url, qrOptions, (err, dataUrl) => {
                if (isMounted && !err) {
                    setQrDataUrl(dataUrl);
                }
            });
        }
        return () => { isMounted = false; };
    }, [url, options?.width, options?.margin, options?.color?.dark, options?.color?.light]);

    const handleDownloadPng = () => {
        if (!qrDataUrl) return;
        const link = document.createElement("a");
        link.href = qrDataUrl;
        link.download = "qrcode.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownloadSvg = async () => {
        if (!url) return;
        try {
            const svgString = await QRCode.toString(url, { ...qrOptions, type: "svg" });
            const blob = new Blob([svgString], { type: "image/svg+xml" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "qrcode.svg";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (e) {
            console.error("Failed to generate SVG QR code", e);
        }
    };

    const handlePrint = () => {
        if (!qrDataUrl) return;

        const printWindow = window.open("", "_blank");
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Print QR Code</title>
                        <style>
                            body {
                                display: flex;
                                flex-direction: column;
                                justify-content: center;
                                align-items: center;
                                height: 100vh;
                                margin: 0;
                                font-family: sans-serif;
                            }
                            img {
                                max-width: 80%;
                                height: auto;
                            }
                            p {
                                margin-top: 20px;
                                text-align: center;
                                font-size: 1.2rem;
                            }
                        </style>
                    </head>
                    <body>
                        <img src="${qrDataUrl}" alt="${altText}" />
                        <p>${url}</p>
                        <script>
                            window.onload = function() {
                                window.print();
                                window.onafterprint = function() {
                                    window.close();
                                }
                            }
                        </script>
                    </body>
                </html>
            `);
            printWindow.document.close();
        }
    };

    if (!qrDataUrl) return null;

    if (variant === 'mobile-sheet') {
        return (
            <div className="flex flex-col items-center gap-6 w-full">
                <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm relative">
                    {/* Add visual corners or clean generic card look */}
                    <div className="absolute inset-0 rounded-3xl border border-gray-100/50 pointer-events-none"></div>
                    <img src={qrDataUrl} alt={altText} className="w-full h-auto max-w-[180px] rounded-lg mix-blend-multiply" />
                </div>

                <div className="flex flex-col gap-3 w-full max-w-[220px]">
                    <button
                        onClick={handleDownloadPng}
                        className="flex items-center justify-center w-full px-4 py-3 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                    >
                        <Download className="w-4 h-4 mr-2 text-gray-500" />
                        Download PNG
                    </button>
                    <button
                        onClick={handleDownloadSvg}
                        className="flex items-center justify-center w-full px-4 py-3 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                    >
                        <FileImage className="w-4 h-4 mr-2 text-gray-500" />
                        Download SVG
                    </button>
                    <button
                        onClick={handlePrint}
                        className="flex items-center justify-center w-full px-4 py-3 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                    >
                        <Printer className="w-4 h-4 mr-2 text-gray-500" />
                        Print Code
                    </button>
                </div>
            </div>
        );
    }

    // Default View
    return (
        <div className="flex flex-col items-center gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <img src={qrDataUrl} alt={altText} className="w-48 h-48 sm:w-64 sm:h-64 rounded-lg" />
            </div>

            <div className="flex flex-wrap justify-center gap-2 w-full">
                <button
                    onClick={handleDownloadPng}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
                    title="Download PNG"
                >
                    <Download className="w-4 h-4 mr-2" />
                    PNG
                </button>
                <button
                    onClick={handleDownloadSvg}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
                    title="Download SVG"
                >
                    <FileImage className="w-4 h-4 mr-2" />
                    SVG
                </button>
                <button
                    onClick={handlePrint}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
                    title="Print QR Code"
                >
                    <Printer className="w-4 h-4 mr-2" />
                    Print
                </button>
            </div>
        </div>
    );
}
