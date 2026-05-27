'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { toast } from 'sonner';
import { 
  User, Mail, Phone, Globe, CalendarDays, Tag, 
  Camera, ShieldCheck, MapPin, Loader2, Check
} from 'lucide-react';

import Loader from '@/components/uix/Loader';
import ImageBox from '@/components/uix/ImageBox';
import RadText from '@/components/uix/xForm/RadText';
import RadTextArea from '@/components/uix/xForm/RadTextArea';
import RadSelectGender from '@/components/uix/xForm/RadSelectGender';
import RadSelectOption from '@/components/uix/xForm/RadSelectOption';
import RadDateSelector from '@/components/uix/xForm/RadDateSelector';
import countries from '@/lib/data/countries';

export default function ProfileUpdateForm() {
  const { user } = useAuth();
  
  const [userData, setUserData] = useState<any>(null);
  const [pidUser, setPidUser] = useState(user?.pidUser);
  const [isLoading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    email: '',
    fullName: '',
    gender: '',
    dob: '',
    phone: '',
    country: '',
    address: '',
    imagex: ''
  });

  const fetchUser = async (id: string) => {
    try {
      const res = await fetch(`/api/user/${id}`);
      if (!res.ok) throw new Error('Failed to fetch user');
      const data = await res.json();
      setUserData(data);
      setForm({
        email: data.userEmail || '',
        fullName: data.userFirstname || '',
        gender: data.gender || '',
        dob: data.dob || '',
        phone: data.phone || '',
        country: data.country || '',
        address: data.address || '',
        imagex: data.userImage || ''
      });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (pidUser) fetchUser(pidUser); }, [pidUser]);

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData();
    if (file) formData.append('file', file);
    formData.append('pidUser', pidUser || '');
    Object.entries(form).forEach(([key, value]) => formData.append(key, value as string));

    try {
      const res = await fetch('/api/profile-update', { method: 'POST', body: formData });
      const data = await res.json();

      if (data.responsex.status === 'SUCCESS') {
        if (pidUser) {
          await fetchUser(pidUser);
        }
        toast.success('Profile updated successfully');
      } else {
        toast.warning(data.responsex.message);
      }
    } catch (error) {
      toast.error('Update failed. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!userData || isLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-slate-950">
      
      {/* Restored Deep Slate Hero Pattern */}
      <div className="bg-slate-900 pb-32 pt-12 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-blue-500/20">
                  Account Settings
                </span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">My Profile</h1>
              <p className="mt-2 text-slate-400">Manage your identity, contact details, and account security.</p>
            </div>
            
            <div className="hidden sm:flex items-center gap-3 rounded-2xl bg-white/5 p-4 backdrop-blur-md border border-white/10 shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-white">Verified Account</p>
                <p className="text-xs text-slate-400">Protected by AES-256</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto -mt-16 max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
        <form onSubmit={submitForm} className="flex flex-col gap-8 lg:flex-row lg:items-start">
          
          {/* LEFT COLUMN: Identity Anchor */}
          <div className="w-full shrink-0 space-y-6 lg:sticky lg:top-8 lg:w-80">
            
            {/* Image & Identity Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-col items-center text-center">
                
                {/* The Precision Image Picker */}
                <div className="relative mb-6">
                  <div className="h-36 w-36 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-md ring-1 ring-slate-200 dark:border-slate-800 dark:bg-slate-800 dark:ring-slate-700">
                    <div className="h-full w-full object-cover">
                      <ImageBox 
                        onImageChange={(f: File) => setFile(f)} 
                        imagex={form.imagex}
                        avatarMode
                      />
                    </div>
                  </div>
                  
                  <div className="absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-blue-600 text-white shadow-sm transition-transform hover:scale-105 hover:bg-blue-500 dark:border-slate-900">
                    <Camera className="h-4 w-4" />
                  </div>
                </div>

                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {form.fullName || "Your Name"}
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {form.email}
                </p>
                <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                  Tap your photo to upload. Max image size 2.5MB.
                </p>

                <div className="mt-6 w-full rounded-xl bg-slate-50 p-4 text-left dark:bg-slate-800/50">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Account ID</p>
                  <p className="mt-1 font-mono text-xs font-medium text-slate-700 dark:text-slate-300">
                    {pidUser || "Pending"}
                  </p>
                </div>
              </div>
            </div>

            {/* Helper Text Card */}
            <div className="rounded-2xl border border-transparent bg-blue-50 p-5 dark:border-blue-900/30 dark:bg-blue-900/10">
              <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-200">Why accurate details matter</h3>
              <p className="mt-2 text-xs leading-relaxed text-blue-700 dark:text-blue-300/80">
                Your shipping address and contact information are used directly for customs clearance and final delivery logistics.
              </p>
            </div>

          </div>

          {/* RIGHT COLUMN: Data Entry Form */}
          <div className="flex-1 space-y-6">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              
              {/* Section 1: Basic Information */}
              <div className="border-b border-slate-100 p-6 sm:p-8 dark:border-slate-800">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                    <User className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Personal Information</h3>
                </div>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <RadText 
                    label="Full Legal Name" 
                    id="fullname"
                    name="fullname"
                    value={form.fullName} 
                    onChange={(e: any) => setForm({...form, fullName: e.target.value})} 
                  />
                  <RadText 
                    label="Email Address" 
                    id="email"
                    name="email"
                    value={form.email} 
                    disable={true} 
                  />
                  <RadSelectGender 
                    label="Gender Identity" 
                    id="gender"
                    name="gender"
                    value={form.gender} 
                    onChange={(e: any) => setForm({...form, gender: e.target.value})} 
                  />
                  <RadDateSelector 
                    label="Date of Birth" 
                    id="dob"
                    name="dob"
                    value={form.dob} 
                    onChange={(e: any) => setForm({...form, dob: e.target.value})} 
                  />
                </div>
              </div>

              {/* Section 2: Contact & Location */}
              <div className="p-6 sm:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                    <MapPin className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Contact & Delivery</h3>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <RadText 
                    label="Primary Phone Number" 
                    id="phone"
                    name="phone"
                    value={form.phone} 
                    onChange={(e: any) => setForm({...form, phone: e.target.value})} 
                  />
                  <RadSelectOption 
                    label="Country of Residence" 
                    id="country"
                    name="country"
                    xrecords={countries} 
                    value={form.country} 
                    onChange={(e: any) => setForm({...form, country: e.target.value})} 
                  />
                  <div className="sm:col-span-2">
                    <RadTextArea 
                      label="Detailed Street Address" 
                      id="address"
                      name="address"
                      value={form.address} 
                      placeholder="E.g., 2 Oremeji Street, Agodo, Egbe, Lagos"
                      onChange={(e: any) => setForm({...form, address: e.target.value})} 
                    />
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-5 sm:px-8 dark:border-slate-800 dark:bg-slate-900/50">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Last updated:{' '}
                    {userData.updatedAt
                      ? new Date(userData.updatedAt).toLocaleString()
                      : 'Never'}
                  </p>
                  
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 text-sm font-semibold text-white transition-all hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 dark:focus:ring-offset-slate-900"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        Save Profile
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          </div>

        </form>
      </main>
    </div>
  );
}
