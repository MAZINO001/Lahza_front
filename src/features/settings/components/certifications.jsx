"use client";

import React from "react";
import { useCertifications, useCreateCertification, useUpdateCertification, useDeleteCertification } from "../hooks/useSettingsQuery";

export default function CertificationsSection() {
    const { data: certifications, isLoading, error } = useCertifications();
    const createCertification = useCreateCertification();
    const updateCertification = useUpdateCertification();
    const deleteCertification = useDeleteCertification();

    if (isLoading) {
        return <div>Loading certifications...</div>;
    }

    if (error) {
        return <div>Error loading certifications</div>;
    }

    const handleCreate = () => {
        // Example: Create a new certification
        createCertification.mutate({
            name: "New Certification",
            description: "Description here",
            issued_date: "2024-01-01",
            expiry_date: "2025-01-01"
        });
    };

    const handleUpdate = (id) => {
        // Example: Update a certification
        updateCertification.mutate({
            id: id,
            data: {
                name: "Updated Certification",
                description: "Updated description"
            }
        });
    };

    const handleDelete = (id) => {
        // Example: Delete a certification
        deleteCertification.mutate(id);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Certifications</h2>
                <button
                    onClick={handleCreate}
                    disabled={createCertification.isPending}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {createCertification.isPending ? "Creating..." : "Add Certification"}
                </button>
            </div>

            <div className="grid gap-4">
                {certifications?.map((cert) => (
                    <div key={cert.id} className="border rounded-lg p-4">
                        <h3 className="font-semibold">{cert.name}</h3>
                        <p className="text-gray-600">{cert.description}</p>
                        <div className="mt-4 flex gap-2">
                            <button
                                onClick={() => handleUpdate(cert.id)}
                                disabled={updateCertification.isPending}
                                className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50"
                            >
                                {updateCertification.isPending ? "Updating..." : "Edit"}
                            </button>
                            <button
                                onClick={() => handleDelete(cert.id)}
                                disabled={deleteCertification.isPending}
                                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                            >
                                {deleteCertification.isPending ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                ))}

                {certifications?.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No certifications found. Add your first certification above.
                    </div>
                )}
            </div>
        </div>
    );
}
