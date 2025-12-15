"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { processBulkUpload } from "./actions";

export default function BulkUploadPage() {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [logs, setLogs] = useState<{ original: string, short: string, error?: string }[]>([]);
    const [bulkTag, setBulkTag] = useState<string | null>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        validateAndSetFile(droppedFile);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const validateAndSetFile = (selectedFile: File) => {
        const allowedTypes = [
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-excel"
        ];

        // Basic extension check as fallback
        const isExcel = selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls');

        if (!allowedTypes.includes(selectedFile.type) && !isExcel) {
            toast.error("Invalid file type. Please upload an Excel file (.xlsx or .xls)");
            return;
        }

        setFile(selectedFile);
        toast.success("File selected ready for upload");
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        setLogs([]);
        setBulkTag(null);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const result = await processBulkUpload(formData);

            if (result.success) {
                toast.success(`Successfully processed ${result.successCount} URLs`);
                if (result.failedCount > 0) {
                    toast.warning(`${result.failedCount} URLs failed to process`);
                }
                setLogs(result.logs);
                setBulkTag(result.tag);
            }
        } catch (error: any) {
            console.error("Upload failed", error);
            toast.error(error.message || "Failed to upload file");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Bulk Upload URLs</h1>
                        <p className="mt-2 text-gray-600">Upload an Excel file to generate short links in bulk.</p>
                    </div>
                    <Link
                        href="/dashboard"
                        className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Dashboard
                    </Link>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-8">
                        {/* Instructions */}
                        <div className="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-100">
                            <h3 className="text-lg font-semibold text-blue-900 mb-2">Instructions</h3>
                            <ul className="list-disc list-inside text-blue-800 space-y-1 text-sm">
                                <li>Prepare an Excel file (.xlsx or .xls).</li>
                                <li>Put your long URLs in the <strong>first column (Column A)</strong>.</li>
                                <li>The system will automatically generate short links for each valid URL.</li>
                                <li>You will receive an email summary upon completion.</li>
                            </ul>
                        </div>

                        {/* Upload Area */}
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`
                                relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200
                                ${isDragging
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                                }
                            `}
                        >
                            <input
                                type="file"
                                accept=".xlsx,.xls"
                                onChange={handleFileSelect}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                disabled={isUploading}
                            />

                            <div className="flex flex-col items-center justify-center">
                                <div className={`w-16 h-16 mb-4 rounded-full flex items-center justify-center ${file ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                    {file ? (
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                    )}
                                </div>

                                {file ? (
                                    <>
                                        <p className="text-lg font-medium text-gray-900">{file.name}</p>
                                        <p className="text-sm text-gray-500 mt-1">{(file.size / 1024).toFixed(2)} KB</p>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setFile(null);
                                                setLogs([]);
                                            }}
                                            className="mt-4 text-sm text-red-600 hover:text-red-700 font-medium z-10 relative"
                                        >
                                            Remove file
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-lg font-medium text-gray-900">Drop your Excel file here</p>
                                        <p className="text-sm text-gray-500 mt-1">or click to browse</p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={handleUpload}
                                disabled={!file || isUploading}
                                className={`
                                    px-8 py-3 rounded-lg font-semibold text-white shadow-lg transition-all duration-200 flex items-center
                                    ${!file || isUploading
                                        ? "bg-gray-300 cursor-not-allowed"
                                        : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:-translate-y-0.5"
                                    }
                                `}
                            >
                                {isUploading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <span>Start Upload</span>
                                        <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Logs Section */}
                {logs.length > 0 && (
                    <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-5 duration-500 fade-in">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                            <div className="flex items-center space-x-4">
                                <h3 className="text-lg font-bold text-gray-900">Processing Logs</h3>
                                {bulkTag && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        Batch ID: {bulkTag}
                                    </span>
                                )}
                            </div>
                            <div className="text-sm text-gray-500">
                                Total: {logs.length} | Success: <span className="text-green-600 font-bold">{logs.filter(l => !l.error).length}</span> | Failed: <span className="text-red-600 font-bold">{logs.filter(l => l.error).length}</span>
                            </div>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Original URL</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {logs.map((log, idx) => (
                                        <tr key={idx} className={log.error ? "bg-red-50" : "hover:bg-gray-50"}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate" title={log.original}>
                                                {log.original}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {log.error ? (
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                        Failed
                                                    </span>
                                                ) : (
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                        Success
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {log.error ? (
                                                    <span className="text-red-600">{log.error}</span>
                                                ) : (
                                                    <a href={log.short} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline">
                                                        {log.short}
                                                    </a>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
