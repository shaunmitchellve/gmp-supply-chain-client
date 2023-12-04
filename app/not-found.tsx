import React from 'react'
import Link from 'next/link'
import FieldImage from './ui/field-image';
import { inter } from '@/app/ui/fonts';

export default function NotFound() {
    const bg = "/img/404.jpg";
    return (
    <div className="relative">
        <FieldImage />
        <div className="min-h-screen sm:flex sm:flex-row mx-0 justify-center">
            <div className="flex-col flex self-center p-10 sm:max-w-5xl xl:max-w-2xl z-10">
                <h1 className="text-7xl font-bold text-red-600 p-4">Opps,</h1>
                <h2 className="text-white font-bold text-2xl">We can't seem to find the direction you are looking for.</h2>
                <Link href="/">
                    <button type="button"
                        className="mt-8 flex justify-center bg-red-600 hover:bg-red-800 text-gray-100 p-3 rounded-full tracking-wide font-semibold shadow-lg cursor-pointer transition eas-in durraction-500">
                            Head Home
                    </button>
                </Link>
            </div>
        </div>
    </div>
    )
}