'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import Stores from '@/components/dashboard/procurement/stores';
import { useRouter } from 'next/navigation';
import CreateOrder from '../create-order/components/createOrder';
import { VideoIcon, ExternalLink, PlayCircle, Bookmark, Globe } from 'lucide-react';
import { useModal } from '@/app/context/ModalContext';
import Modal from '@/components/uix/ModalLarge';
import { useAuth } from '@/lib/AuthContext';

export default function Procurement() {
  const { user } = useAuth();
  const router = useRouter();
  const { isModalOpen, openModal, closeModal } = useModal();

  const videoGuides = [
    { id: 'qpUBdhmVK7c', title: 'How to create Orders on SureImports' },
    { id: 'zxkPU0ZCTlM', title: 'Where and How to Buy Authentic Designer Items' },
    { id: 'nX5S-SIr_To', title: 'Import from 1688.com to the UK' }
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-slate-950">
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="bg-white dark:bg-slate-900 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <PlayCircle className="text-red-500 h-5 w-5" /> Tutorial Guides
            </h2>
          </div>
          <div className="max-h-[70vh] overflow-y-auto p-4 space-y-8">
            {videoGuides.map((video, index) => (
              <div key={video.id} className="space-y-3">
                <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">
                  ({index + 1}) {video.title}
                </h3>
                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 shadow-sm">
                  <iframe
                    className="absolute inset-0 h-full w-full"
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* Hero Section */}
      <div className="bg-slate-900 pb-24 pt-10 text-white md:pb-32 md:pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-4 rounded-full bg-blue-500/10 px-3 py-1 border border-blue-500/20">
              <Globe className="h-3 w-3 text-blue-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
                General Procurement
              </span>
            </div>
            
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
              {user?.userFirstname ? `Hi ${user.userFirstname}, ` : ''} 
              Shop from China.
            </h1>
            <p className="mt-4 text-base text-slate-400 leading-relaxed md:text-lg md:mt-6">
              Paste product links from any Chinese e-commerce site. We handle the purchase, quality inspection, and doorstep delivery.
            </p>
            
            {/* Action Area: Stacked on Mobile, Row on Desktop */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center md:mt-10">
              <div className="w-full sm:w-auto">
                <CreateOrder className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 h-12 rounded-xl transition-all font-bold shadow-lg shadow-blue-600/20" />
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  onClick={openModal}
                  variant="outline"
                  className="flex-1 sm:flex-none bg-slate-800/40 border-slate-700 hover:bg-slate-800 text-white h-12 px-5 rounded-xl"
                >
                  <VideoIcon className="mr-2 h-4 w-4 text-red-500" />
                  <span className="text-sm">Video Guide</span>
                </Button>
                
                <Button
                  onClick={() => router.push('/dashboard/procurement/view-orders/saved')}
                  variant="ghost"
                  className="flex-1 sm:flex-none text-slate-400 hover:text-white hover:bg-slate-800 h-12 px-5 rounded-xl"
                >
                  <Bookmark className="mr-2 h-4 w-4" />
                  <span className="text-sm">Saved</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto -mt-10 max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        {/* Store Selection Bar */}
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="hidden h-10 w-10 sm:flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800">
                <ExternalLink className="h-5 w-5 text-slate-500" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white sm:text-base">Trusted Stores</h2>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter sm:tracking-wider">Browse & Paste Links</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-1.5 dark:bg-slate-800">
               <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
               <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Live</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl">
          <Stores />
        </div>
      </main>
    </div>
  );
}