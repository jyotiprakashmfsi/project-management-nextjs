"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { usersService } from "@/services/client-services/user/api";
import { useRouter } from "next/compat/router";
import { UserUpdateData } from "@/types/user";


export default function SettingsComponent() {
  const { user, token, logout } = useUser();
  const navigate = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<UserUpdateData>({
    fname: "",
    email: "",
    contact: "",
    dob: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id || !token) return;
      
      try {
        const response = await usersService.getUserById(user.id, token);
        if (response.user) {
          setFormData({
            fname: response.user[0].fname || "",
            email: response.user[0].email || "",
            contact: response.user[0].contact?.toString() || "",
            dob: response.user[0].dob || "",
          });
        }
      } catch (error) {
        toast.error("Error fetching user data");
      }
    };

    fetchUserData();
  }, [user, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !token) return;

    setSaving(true);
    try {
      const updateData = {
        ...formData,
        contact: formData.contact,
      };

      const response = await usersService.updateUser(updateData, user.id, token);
      if (response.error) {
        throw new Error(response.error);
      }
    } catch (error) {
      toast.error("Error updating user:", error)
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user?.id || !token || !window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    try {
      await usersService.deleteUser(user.id, token);
      logout();
      navigate?.push("/");
    } catch (error) {
      toast.error("Error deleting account:", error);
    }
  };
  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Account Settings</h1>
        <p className="text-neutral-600 mt-1">Manage your account information and preferences</p>
      </div>

      <div className="">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="fname" className="block text-sm font-medium text-neutral-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="fname"
                name="fname"
                value={formData.fname}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-neutral-900"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-neutral-900"
                required
              />
            </div>

            <div>
              <label htmlFor="contact" className="block text-sm font-medium text-neutral-700 mb-1">
                Contact Number
              </label>
              <input
                type="tel"
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-neutral-900"
              />
            </div>

            <div>
              <label htmlFor="dob" className="block text-sm font-medium text-neutral-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-neutral-900"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={handleDeleteAccount}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 focus:outline-none"
            >
              Delete Account
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};