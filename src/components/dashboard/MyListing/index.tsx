'use client'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import MyRequest from './MyRequest'
import MyStockListing from './MyStockListing'
import { Button } from '@mui/material'
import NewRequestModal from './MyRequest/NewRequestModal'
import CreateNewStrockModal from './MyStockListing/CreateNewStrockModal'

const MyListingPage = () => {
    const [activeTab, setActiveTab] = useState<'requests' | 'stock'>('requests');
    const [openAddRequest, setOpenAddRequest] = useState(false);
    const [openAddStock, setOpenAddStock] = useState(false);
    const pathname = usePathname();
    return (
        <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-10 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-serif text-primary mb-2">My Listings</h1>
                    <p className="text-gray-400">Manage your requests and property listings.</p>
                </div>

                {activeTab === "requests" ? <Button onClick={()=>setOpenAddRequest(true)} variant='contained' className='bg-primary! text-black!' size='large'>Create New Request</Button>
                : <Button onClick={()=>setOpenAddStock(true)} variant='contained' className='bg-primary! text-black!' size='large'>Create New Stock Listing</Button>}
            </div>

            {/* Tabs */}
            <div className="border-b border-primary/20 mb-8">
                <div className="flex gap-8">
                    <button
                        onClick={() => setActiveTab('requests')}
                        className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'requests'
                            ? 'text-primary'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        My Requests
                        {activeTab === 'requests' && (
                            <div
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                            />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('stock')}
                        className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'stock'
                            ? 'text-primary'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        My Stock Listings
                        {activeTab === 'stock' && (
                            <div
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                            />
                        )}
                    </button>
                </div>
            </div>
            {activeTab === "requests" ? <MyRequest /> : <MyStockListing />}
            <NewRequestModal open={openAddRequest} onClose={()=>setOpenAddRequest(false)}/>
            <CreateNewStrockModal open={openAddStock} onClose={()=> setOpenAddStock(false)}/>
        </div>

    )
}

export default MyListingPage