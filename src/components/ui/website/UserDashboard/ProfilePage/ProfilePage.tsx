"use client";

import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  CheckCircle,
  Building,
  Shield,
  Upload,
  Camera,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useEditProfileMutation } from "@/redux/slice/userApi";
import IdentityVerificationModal from "@/components/dashboard/Profile/IdentityVerificationModal";
import Image from "next/image";
import { getImageUrl } from "@/utils/baseUrl";

const ROLES = ["INVESTOR", "AGENT", "DEVELOPER", "SELLER"] as const;
type Role = (typeof ROLES)[number];

export default function ProfilePage({ profile }: any) {
  const [role, setRole] = useState<Role>("INVESTOR");
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [isVerified, setIsVerify] = useState(false);

  // Profile picture handling
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [editProfile, { isLoading: isSaving }] = useEditProfileMutation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    budget: "",
    buyingPower: "",
    agencyName: "",
    ffcNumber: "",
    companyName: "",
  });


  console.log("profile", profile);

  // Load initial profile data
  useEffect(() => {
    if (!profile) return;

    setRole(profile.role ?? "INVESTOR");

    setForm({
      name: profile.name || "",
      email: profile.email || "",
      phone: profile.phone || "",
      budget: profile.budget || "",
      buyingPower: profile.buyingPower || "",
      agencyName: profile.agencyName || "",
      ffcNumber: profile.ffcNumber || "",
      companyName: profile.companyName || "",
    });

    if (profile.image) {
      setPreviewUrl(profile.image);
    }
    setIsVerify(profile?.isKycVerified)
  }, [profile]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Basic client-side validation
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file (jpg, png, webp, etc.)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5 MB");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);
  };



  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    let data: any = {
      name: form.name,
      phone: form.phone,
    }

    // Conditional fields based on role
    if (role === "INVESTOR") {
      data.budget = form.budget.trim();
      data.buyingPower = form.buyingPower.trim();
    }

    if (role === "AGENT") {
      data.agencyName = form.agencyName.trim();
      data.ffcNumber = form.ffcNumber.trim();
    }

    if (role === "DEVELOPER") {
      data.companyName = form.companyName.trim();
    }

    const formData = new FormData();

    // Attach new image only if changed
    if (imageFile) {
      formData.append("image", imageFile);
    }
    formData.append("data", JSON.stringify(data))


    try {
      const res = await editProfile(formData).unwrap();

      if (res?.success) {
        toast.success(res.message || "Profile updated successfully");

        // If backend returns new image URL
        if (res.data?.image) {
          setPreviewUrl(res.data.image);
          setImageFile(null); // clear the local File reference
        }
      }
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.message ||
        "Could not update profile. Please try again.";
      toast.error(msg);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-serif text-white mb-2">
          Profile & Role
        </h1>
        <p className="text-gray-400">
          Update your personal information and account type
        </p>
      </div>

      <div className="space-y-6">
        {/* 1. Profile Photo */}
        <section className="bg-[#111] border border-primary/20 rounded-xl p-6">
          <h2 className="text-xl font-serif text-white mb-4">Profile Photo</h2>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-primary/30 bg-[#0a0a0a] flex items-center justify-center">
              {previewUrl ? (
                <Image
                  src={imageFile ? previewUrl : `${getImageUrl() + previewUrl}`}
                  height={150}
                  width={150}
                  alt="Profile preview"
                  className="w-full h-full object-cover rounded-full "
                />
              ) : (
                <User className="w-14 h-14 text-gray-500" />
              )}
              {imageFile &&
                <X
                  size={20}
                  onClick={() => { setImageFile(null); setPreviewUrl(profile?.image ?? ""); }}
                  className="absolute -top-5 right-0 text-red-600 cursor-pointer" />}
            </div>

            <div className="flex flex-col items-center sm:items-start gap-3">
              <div className="text-center sm:text-left">
                <p className="text-gray-300 font-medium">
                  {previewUrl ? "Current photo" : "No photo uploaded yet"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  JPG, PNG, WebP • Max 5 MB • Recommended 400×400
                </p>
              </div>

              <label
                htmlFor="profile-upload"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-lg cursor-pointer transition font-medium text-sm"
              >
                <Upload size={16} />
                Upload new photo
              </label>
              <input
                id="profile-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>
          </div>
        </section>

        {/* 2. Role Selection
        <section className="bg-[#111] border border-primary/20 rounded-xl p-6">
          <h2 className="text-xl font-serif text-white mb-4 ">Account Type <span className="capitalize! text-primary">({profile?.role})</span></h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
           {ROLES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`py-3 px-4 rounded-lg text-sm font-medium transition-all border ${role === r
                    ? "bg-primary text-black border-primary shadow-sm"
                    : "bg-[#1a1a1a] text-gray-400 border-transparent hover:border-primary/40"
                  }`}
              >
                {r}
              </button>
            ))}
          </div>
        </section> */}

        {/* 3. Verification Status */}
        <section
          className={`rounded-xl p-6 border flex flex-col sm:flex-row items-center justify-between gap-6 ${isVerified
            ? "bg-gradient-to-br from-green-950/30 to-[#111] border-green-700/30"
            : "bg-gradient-to-br from-amber-950/20 to-[#111] border-primary/30"
            }`}
        >
          <div className="">
            <h2 className="text-xl font-serif text-white mb-4 ">Account Type <span className="capitalize! text-primary">({profile?.role})</span></h2>

            <div className="flex items-center gap-4">

              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${isVerified ? "bg-green-600/20" : "bg-primary/10"
                  }`}
              >
                {isVerified ? (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                ) : (
                  <Shield className="w-6 h-6 text-primary" />
                )}
              </div>
              <div>
                <h3
                  className={`font-medium ${isVerified ? "text-green-300" : "text-primary"
                    }`}
                >
                  {isVerified ? "Verified" : "Identity Verification Required"}
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  {isVerified
                    ? "Your identity has been confirmed."
                    : "Complete verification to access full features."}
                </p>
              </div>
            </div>
          </div>


          {!isVerified && (
            <button
              onClick={() => setShowVerificationModal(true)}
              className="bg-primary hover:bg-amber-300 text-black px-6 py-2.5 rounded-lg font-medium transition w-full sm:w-auto"
            >
              Verify Identity
            </button>
          )}
        </section>

        {/* 4. Form */}
        <section className="bg-[#111] border border-primary/20 rounded-xl p-6">
          <h2 className="text-xl font-serif text-white mb-6">Details</h2>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Display Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleTextChange}
                    className="w-full bg-[#0a0a0a] border border-primary/20 rounded-lg pl-10 pr-4 py-3 text-white focus:border-primary outline-none transition"
                    placeholder="How others see you"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    value={form.email}
                    disabled
                    className="w-full bg-[#1a1a1a] border border-primary/10 rounded-lg pl-10 pr-4 py-3 text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Role-specific fields */}
            <div className="space-y-5">
              {role === "INVESTOR" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <input
                    name="budget"
                    value={form.budget}
                    onChange={handleTextChange}
                    placeholder="Budget range (e.g. R 1M - R 10M)"
                    className="w-full bg-[#0a0a0a] border border-primary/20 rounded-lg px-4 py-3 text-white focus:border-primary outline-none"
                  />
                  <input
                    name="buyingPower"
                    value={form.buyingPower}
                    onChange={handleTextChange}
                    placeholder="Source of funds (Cash / Finance / Both)"
                    className="w-full bg-[#0a0a0a] border border-primary/20 rounded-lg px-4 py-3 text-white focus:border-primary outline-none"
                  />
                </div>
              )}

              {role === "AGENT" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      name="agencyName"
                      value={form.agencyName}
                      onChange={handleTextChange}
                      placeholder="Agency name"
                      className="w-full bg-[#0a0a0a] border border-primary/20 rounded-lg pl-10 pr-4 py-3 text-white focus:border-primary outline-none"
                    />
                  </div>
                  <input
                    name="ffcNumber"
                    value={form.ffcNumber}
                    onChange={handleTextChange}
                    placeholder="FFC / Licence number"
                    className="w-full bg-[#0a0a0a] border border-primary/20 rounded-lg px-4 py-3 text-white focus:border-primary outline-none"
                  />
                </div>
              )}

              {role === "DEVELOPER" && (
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    name="companyName"
                    value={form.companyName}
                    onChange={handleTextChange}
                    placeholder="Company / developer name"
                    className="w-full bg-[#0a0a0a] border border-primary/20 rounded-lg pl-10 pr-4 py-3 text-white focus:border-primary outline-none"
                  />
                </div>
              )}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSaving}
                className={`w-full sm:w-auto px-8 py-3 rounded-lg font-semibold transition ${isSaving
                  ? "bg-primary/60 text-black/70 cursor-not-allowed"
                  : "bg-primary hover:bg-amber-300 text-black shadow-lg shadow-primary/20"
                  }`}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </section>
      </div>

      <IdentityVerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
      />
    </div>
  );
}