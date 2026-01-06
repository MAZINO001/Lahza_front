import { ArrowLeft, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useParams } from "react-router-dom";

export default function UserManagementView() {
    const { id } = useParams();
    const navigate = useNavigate();

    const defaultPermissions = [
        { id: "create_content", label: "Create Content" },
        { id: "edit_content", label: "Edit Content" },
        { id: "delete_content", label: "Delete Content" },
        { id: "manage_users", label: "Manage Users" },
        { id: "manage_roles", label: "Manage Roles" },
        { id: "view_analytics", label: "View Analytics" },
        { id: "manage_settings", label: "Manage Settings" },
        { id: "export_data", label: "Export Data" },
        { id: "view_reports", label: "View Reports" },
        { id: "approve_content", label: "Approve Content" },
    ];

    // Mock user data - in real app this would come from API
    const userData = {
        name: "John Doe",
        email: "john@example.com",
        role: "Admin",
        status: "Active",
        joinDate: "2024-01-15",
        permissions: {
            create_content: true,
            edit_content: true,
            delete_content: false,
            manage_users: true,
            manage_roles: true,
            view_analytics: true,
            manage_settings: false,
            export_data: true,
            view_reports: true,
            approve_content: false,
        },
    };

    const handleEdit = () => {
        navigate(`/admin/settings/users_management/edit/${id}`);
    };

    return (
        <div>
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => navigate("/admin/settings/users_management")}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <Button onClick={handleEdit} className="gap-2">
                        <Edit className="w-4 h-4" />
                        Edit User
                    </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* User Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>User Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <p className="text-sm text-gray-700 p-2 bg-gray-50 rounded">{userData.name}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <p className="text-sm text-gray-700 p-2 bg-gray-50 rounded">{userData.email}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Role</label>
                                <p className="text-sm text-gray-700 p-2 bg-gray-50 rounded">{userData.role}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Status</label>
                                <p className="text-sm text-gray-700 p-2 bg-gray-50 rounded">{userData.status}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Join Date</label>
                                <p className="text-sm text-gray-700 p-2 bg-gray-50 rounded">{userData.joinDate}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Permissions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Permissions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {defaultPermissions.map((perm) => (
                                    <div key={perm.id} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
                                        <Checkbox
                                            checked={userData.permissions[perm.id]}
                                            disabled
                                        />
                                        <span className="text-sm flex-1">{perm.label}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
