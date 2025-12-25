"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

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
}

export default function QrCodeDisplay({ url, altText = "QR Code", options }: QrCodeDisplayProps) {
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
        if (url) {
            QRCode.toDataURL(url, qrOptions, (err, dataUrl) => {
                if (!err) {
                    setQrDataUrl(dataUrl);
                }
            });
        }
    }, [url, options]);

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
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    PNG
                </button>
                <button
                    onClick={handleDownloadSvg}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
                    title="Download SVG"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    SVG
                </button>
                <button
                    onClick={handlePrint}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
                    title="Print QR Code"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print
                </button>
            </div>
        </div>
    );
}
