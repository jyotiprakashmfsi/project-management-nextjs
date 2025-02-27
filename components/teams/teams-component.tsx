"use client";
import { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import toast from 'react-hot-toast';
import { RiUserAddLine } from 'react-icons/ri';
import { BsThreeDotsVertical } from "react-icons/bs";
import { usersService } from '@/services/client-services/user/api';
import { projectUserApi } from '@/services/client-services/project-users/api';


interface TeamMember {
    id: number;
    fname: string;
    email: string;
    role: string;
    project_name: string;
    user_id: number;
    project_id: number;
}

interface AddMemberForm {
    user_id: number;
    role: string;
    projectId: number;
}

interface User {
    id: number;
    fname: string;
    email: string;
}

export default function TeamsComponent() {
    const { user } = useUser();
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState<number | null>(null);
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
    const [availableUsers, setAvailableUsers] = useState<User[]>([]);
    const [formData, setFormData] = useState<AddMemberForm>({
        user_id: 0,
        role: 'member',
        projectId: 0
    });
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);

    useEffect(() => {
        fetchTeamMembers();
    }, [user]);

    useEffect(() => {
        if (showAddMemberModal) {
            fetchAvailableUsers();
        }
    }, [showAddMemberModal]);

    const fetchAvailableUsers = async () => {
        try {
            const response = await usersService.getAllUsers();
            if (response && response.users) {
                console.log("API Users fetched:", response.users)
                const projectMembers = teamMembers.filter(member => member.project_id === selectedProject);
                const projectMemberIds = new Set(projectMembers.map(member => member.user_id));
                const filteredUsers = response.users.filter((u: any) => !projectMemberIds.has(u.id));
                setAvailableUsers(filteredUsers);
            } else {
                console.error('Unexpected response format:', response);
                setAvailableUsers([]);
            }
        } catch (error: any) {
            console.error('Error fetching users:', error);
            toast.error('Failed to fetch users');
            setAvailableUsers([]);
        }
    };

    const fetchTeamMembers = async () => {
        try {
            if (!user?.id) return;
            setLoading(true);
            const response = await projectUserApi.getTeamMembers(user.id);
            if (Array.isArray(response)) {
                setTeamMembers(response);
            } else if (response && response.data && Array.isArray(response.data)) {
                setTeamMembers(response.data);
            } else {
                console.error('Unexpected response format:', response);
                setTeamMembers([]);
            }
        } catch (error: any) {
            console.error('Error fetching team members:', error);
            toast.error(error.message || 'Failed to fetch team members');
            setTeamMembers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddMember = (projectId: number) => {
        setSelectedProject(projectId);
        setFormData(prev => ({ ...prev, projectId }));
        setShowAddMemberModal(true);
    };

    const handleEditMember = (member: TeamMember) => {
        setSelectedMember(member);
        setFormData({
            user_id: member.user_id,
            role: member.role,
            projectId: member.project_id
        });
        setShowEditModal(true);
    };

    const handleDeleteMember = async (member: TeamMember) => {
        if (!confirm('Are you sure you want to remove this member from the project?')) return;
        
        try {
            const response = await projectUserApi.removeUserFromProject(member.project_id, member.user_id);
            toast.success('Team member removed successfully');
            fetchTeamMembers();
        } catch (error: any) {
            console.error('Error removing team member:', error);
            toast.error(error.message || 'Failed to remove team member');
        }
    };

    const handleSubmitAddMember = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.user_id) {
            toast.error('Please select a user');
            return;
        }
        try {
            const response = await projectUserApi.addUserToProject({
                project_id: formData.projectId,
                user_id: formData.user_id,
                role: formData.role
            });
            if (response && response.status === 200) {
                toast.success('Team member added successfully');
                setShowAddMemberModal(false);
                fetchTeamMembers();
            } else {
                console.error('Unexpected response format:', response);
                toast.error('Failed to add team member');
            }
            setFormData({ user_id: 0, role: 'member', projectId: 0 });
        } catch (error: any) {
            console.error('Error adding team member:', error);
            toast.error(error.message || 'Failed to add team member');
        }
    };

    const handleSubmitEditMember = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedMember) return;
        
        try {
            const response = await projectUserApi.updateUserRole(
                selectedMember.id,
                formData.role
            );
            toast.success('Team member role updated successfully');
            setShowEditModal(false);
            fetchTeamMembers();
        } catch (error: any) {
            console.error('Error updating team member role:', error);
            toast.error(error.message || 'Failed to update team member role');
        }
    };

    const groupedMembers = teamMembers.reduce((acc, member) => {
        if (!acc[member.project_id]) {
            acc[member.project_id] = {
                project_name: member.project_name,
                members: []
            };
        }
        acc[member.project_id].members.push(member);
        return acc;
    }, {} as Record<number, { project_name: string; members: TeamMember[] }>);

    return (
        <div className="flex min-h-screen bg-gray-50 text-black">
            <div className="flex-1 p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">Team Members</h1>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {Object.entries(groupedMembers).map(([projectId, { project_name, members }]) => (
                            <div key={projectId} className="rounded-lg">
                                <div className="flex justify-between items-center p-6 border-b">
                                    <h2 className="text-xl font-semibold text-gray-900">{project_name}</h2>
                                    <button
                                        onClick={() => handleAddMember(Number(projectId))}
                                        className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                                    >
                                        <RiUserAddLine className="mr-2" />
                                        Add Member
                                    </button>
                                </div>
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {members.map((member) => (
                                            <tr key={member.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                      
                                                        <div className="">
                                                            <div className="text-sm font-medium text-gray-900">{member.fname}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{member.email}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {member.role}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="relative">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setOpenMenuId(openMenuId === member.id ? null : member.id);
                                                            }}
                                                            className="p-1 hover:bg-gray-100 rounded-full"
                                                        >
                                                            <BsThreeDotsVertical className="text-gray-500" />
                                                        </button>
                                                        {openMenuId === member.id && (
                                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                                                                <button
                                                                    onClick={() => handleEditMember(member)}
                                                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteMember(member)}
                                                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                )}

                {showAddMemberModal && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Team Member</h3>
                            <form onSubmit={handleSubmitAddMember}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Select User</label>
                                        <select
                                            value={formData.user_id}
                                            onChange={(e) => setFormData(prev => ({ ...prev, user_id: Number(e.target.value) }))}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        >
                                            <option value="">Select a user</option>
                                            {availableUsers.map(user => (
                                                <option key={user.id} value={user.id}>
                                                    {user.fname} ({user.email})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Role</label>
                                        <select
                                            value={formData.role}
                                            onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        >
                                            <option value="member">Member</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddMemberModal(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                                    >
                                        Add Member
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit Member Modal */}
                {showEditModal && selectedMember && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Team Member Role</h3>
                            <form onSubmit={handleSubmitEditMember}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Member</label>
                                        <div className="mt-1 text-sm text-gray-900">
                                            {selectedMember.fname} ({selectedMember.email})
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Role</label>
                                        <select
                                            value={formData.role}
                                            onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        >
                                            <option value="member">Member</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                                    >
                                        Update Role
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
