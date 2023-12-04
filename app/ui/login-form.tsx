'use client'

import MountainImage from '@/app/ui/mountain-truck-image';
import { useFormState, useFormStatus } from 'react-dom';
import Button from '@/app/ui/button';
import { authenticate } from '@/app/lib/actions';
import {
    ExclamationCircleIcon,
  } from '@heroicons/react/24/solid';

export default function LoginForm() {
    const [state, dispatch] = useFormState(authenticate, undefined);

    return (
        <form action={dispatch}>
        <div className="relative">
            <MountainImage />
            <div className="min-h-screen sm:flex sm:flex-row mx-0 justify-center">
                {/* Side Welcome Message - will disappear on smalls break points */}
                <div className="flex-col flex self-center p-10 sm:max-w-5xl xl:max-w-2xl z-10">
                    <div className="self-start hidden lg:flex flex-col text-white">
                        <h1 className="mb-3 font-bold text-5xl">
                            Welcome to Cymbol Shops <span className="text-red-600">Track-It</span>
                        </h1>
                        <p className="pr-3">
                            Track-It provides Cymbol Shops with real-time visibility into into our supply chain.
                        </p>
                    </div>
                </div>
                {/* Side Welcome Message - End */}
                {/* Login Form */}
                <div className="flex justify-center self-center z-10">
                    <div className="p-8 xl:p-12 bg-white mx-auto rounded-2xl">
                        <div className="mb-4">
                            <h3 className="font-semibold text-2xl text-gray-800">Sign In </h3>
                            <p className="text-gray-500">Please sign in to your account.</p>
                        </div>
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 tracking-wide">Email</label>
                                <input
                                    className="w-full text-base px-4 py-2 border border-gray-300 focus:outline-none rounded-2xl focus:border-red-600 bg-white text-gray-700"
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Enter your email address"
                                    required
                                    />
                            </div>
                            <div className="space-y-2">
                                <label className="mb-5 text-sm font-medium text-gray-700 tracking-wide">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    className="w-full content-center text-base bg-white px-4 py-2 border border-gray-300 rounded-2xl flex-1 focus:outline-none focus:border-red-600 text-gray-700"
                                    placeholder="Enter your password"
                                    required
                                    minLength={6}
                                />
                            </div>
                            <div>
                                <LoginButton />
                                <div className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true">
                                    {state === 'CredentialsSignin' && (
                                        <>
                                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                                        <p className="text-sm text-red-500">Invalid credentials</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="pt-5 text-center text-gray-400 text-xs">
                            <span>
                            Copyright © 2023 Cymbol Shops
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </form>
    )
}

function LoginButton() {
    const { pending } = useFormStatus();
  
    return (
      <Button type="submit" aria-disabled={pending}>
        Log in
      </Button>
    );
  }
  