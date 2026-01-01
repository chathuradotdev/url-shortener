"use client";

import { useState } from "react";
import { updateStorageConfig } from "./settings-actions";

interface StorageConfig {
    enabled: boolean;
    provider: string;
    localPath: string;
    bucket: string;
    region: string;
    accessKey: string;
    secretKey: string;
    endpoint: string;
    connectionString: string;
}

export function StorageSettings({ initialConfig }: { initialConfig: StorageConfig }) {
    const [enabled, setEnabled] = useState(initialConfig.enabled);
    const [provider, setProvider] = useState(initialConfig.provider);

    return (
        <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Storage Configuration</h3>

            <form action={updateStorageConfig} className="space-y-6">

                <div className="flex items-center justify-between py-4 border-b border-gray-100">
                    <div>
                        <h4 className="text-sm font-medium text-gray-900">Enable File Backup</h4>
                        <p className="text-sm text-gray-500">
                            Automatically backup uploaded excel files to configured storage.
                        </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            name="storage_enabled"
                            className="sr-only peer"
                            checked={enabled}
                            onChange={(e) => setEnabled(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>

                <div className={`${enabled ? 'opacity-100' : 'opacity-50 pointer-events-none grayscale'} transition-all duration-300 space-y-6`}>
                    <div>
                        <label htmlFor="storage_provider" className="block text-sm font-medium text-gray-700 mb-2">
                            Storage Provider
                        </label>
                        <div className="flex space-x-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="storage_provider"
                                    value="local"
                                    checked={provider === 'local'}
                                    onChange={(e) => setProvider(e.target.value)}
                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                />
                                <span className="ml-2 text-sm text-gray-700">Local Filesystem</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="storage_provider"
                                    value="s3"
                                    checked={provider === 's3'}
                                    onChange={(e) => setProvider(e.target.value)}
                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                />
                                <span className="ml-2 text-sm text-gray-700">AWS S3 / Compatible</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="storage_provider"
                                    value="azure"
                                    checked={provider === 'azure'}
                                    onChange={(e) => setProvider(e.target.value)}
                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                />
                                <span className="ml-2 text-sm text-gray-700">Azure Blob Storage</span>
                            </label>
                        </div>
                    </div>

                    {provider === 'local' && (
                        <div>
                            <label htmlFor="storage_path" className="block text-sm font-medium text-gray-700">
                                Local Storage Path
                            </label>
                            <p className="mt-1 text-sm text-gray-500 mb-2">
                                Absolute path where files will be stored (e.g., C:\uploads).
                            </p>
                            <input
                                type="text"
                                name="storage_path"
                                id="storage_path"
                                defaultValue={initialConfig.localPath}
                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                placeholder="C:\uploads"
                            />
                        </div>
                    )}

                    {provider === 's3' && (
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                                <label htmlFor="storage_bucket" className="block text-sm font-medium text-gray-700">
                                    Bucket Name
                                </label>
                                <input
                                    type="text"
                                    name="storage_bucket"
                                    id="storage_bucket"
                                    defaultValue={initialConfig.bucket}
                                    className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                />
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="storage_region" className="block text-sm font-medium text-gray-700">
                                    Region
                                </label>
                                <input
                                    type="text"
                                    name="storage_region"
                                    id="storage_region"
                                    defaultValue={initialConfig.region}
                                    className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                />
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="storage_access_key" className="block text-sm font-medium text-gray-700">
                                    Access Key ID
                                </label>
                                <input
                                    type="password"
                                    name="storage_access_key"
                                    id="storage_access_key"
                                    defaultValue={initialConfig.accessKey}
                                    className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                />
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="storage_secret_key" className="block text-sm font-medium text-gray-700">
                                    Secret Access Key
                                </label>
                                <input
                                    type="password"
                                    name="storage_secret_key"
                                    id="storage_secret_key"
                                    defaultValue={initialConfig.secretKey}
                                    className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                />
                            </div>

                            <div className="sm:col-span-6">
                                <label htmlFor="storage_endpoint" className="block text-sm font-medium text-gray-700">
                                    Endpoint (Optional)
                                </label>
                                <p className="mt-1 text-sm text-gray-500 mb-1">
                                    For MinIO or non-AWS S3 compatible services.
                                </p>
                                <input
                                    type="text"
                                    name="storage_endpoint"
                                    id="storage_endpoint"
                                    defaultValue={initialConfig.endpoint}
                                    className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                />
                            </div>
                        </div>
                    )}

                    {provider === 'azure' && (
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="storage_connection_string" className="block text-sm font-medium text-gray-700">
                                    Connection String
                                </label>
                                <input
                                    type="password"
                                    name="storage_connection_string"
                                    id="storage_connection_string"
                                    defaultValue={initialConfig.connectionString}
                                    className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                />
                            </div>

                            <div>
                                <label htmlFor="storage_bucket" className="block text-sm font-medium text-gray-700">
                                    Container Name
                                </label>
                                <input
                                    type="text"
                                    name="storage_bucket" // Reusing bucket field key for Container
                                    id="storage_bucket"
                                    defaultValue={initialConfig.bucket}
                                    className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Save Storage Configuration
                    </button>
                </div>
            </form>
        </div>
    );
}
