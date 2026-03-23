import React from 'react'
import { useClerk, useUser } from '@clerk/react'
import { NavLink } from 'react-router-dom'
import {
  Eraser,
  FileText,
  Hash,
  House,
  Image,
  Scissors,
  SquarePen,
  Users,
  LogOut
} from 'lucide-react'

const navItems = [
  { to: '/ai', label: 'Dashboard', Icon: House },
  { to: '/ai/write-article', label: 'Write Article', Icon: SquarePen },
  { to: '/ai/blog-titles', label: 'Blog Title', Icon: Hash },
  { to: '/ai/generate-images', label: 'Generate Image', Icon: Image },
  { to: '/ai/remove-background', label: 'Remove Background', Icon: Eraser },
  { to: '/ai/remove-object', label: 'Remove Object', Icon: Scissors },
  { to: '/ai/review-resume', label: 'Review Resume', Icon: FileText },
  { to: '/ai/community', label: 'Community', Icon: Users }
]

const Sidebar = ({ sidebar, setSidebar }) => {
  const { user, isLoaded, isSignedIn } = useUser()
  const { signOut, openUserProfile } = useClerk()

  if (!isLoaded) return null

  return (
    <div
      className={`w-60 bg-white border-r border-gray-200 flex flex-col
      justify-between max-sm:absolute top-14 bottom-0
      ${sidebar ? 'translate-x-0' : 'max-sm:-translate-x-full'}
      transition-all duration-300 ease-in-out`}
    >
      {/* 🔹 TOP CONTENT */}
      <div>
        {/* 👤 USER HEADER (only when logged in) */}
        {isSignedIn && (
          <div className="my-7 w-full text-center">
            <img
              src={user?.imageUrl}
              alt="User"
              className="w-16 h-16 rounded-full mx-auto"
            />

            <h1 className="mt-2 font-semibold text-lg">
              {user?.fullName}
            </h1>
          </div>
        )}

        {/* 🔹 NAVIGATION */}
        <div className="w-full px-3 space-y-1">
          {/*
            ESLint is incorrectly reporting the destructured icon alias as unused
            even though it's rendered as a JSX component.
          */}
          {/* eslint-disable-next-line no-unused-vars */}
          {navItems.map(({ to, label, Icon: NavIcon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/ai"}   // exact match for Dashboard
              onClick={() => setSidebar(false)}
              className={({ isActive }) =>
                `px-3.5 py-2.5 flex items-center gap-3 rounded transition
                ${
                  isActive
                    ? 'bg-linear-to-r from-[#3C81F6] to-[#9234EA] text-white'
                    : 'hover:bg-gray-100'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <NavIcon
                    className={`w-4 h-4 ${
                      isActive ? 'text-white' : 'text-gray-600'
                    }`}
                  />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      {/* 🔹 BOTTOM USER PANEL */}
      {isSignedIn && (
        <div className="w-full border-t border-gray-200 p-4 px-5 flex items-center justify-between">
          
          {/* USER INFO */}
          <div
            onClick={openUserProfile}
            className="flex gap-2 items-center cursor-pointer"
          >
            <img
              src={user?.imageUrl}
              className="w-8 h-8 rounded-full"
              alt="User"
            />

            <div>
              <h1 className="text-sm font-medium">
                {user?.fullName}
              </h1>

              <p className="text-xs text-gray-500">
                Premium Plan
              </p>
            </div>
          </div>

          {/* 🚪 LOGOUT */}
          <LogOut
            onClick={signOut}
            className="w-5 text-gray-400 hover:text-gray-700 transition cursor-pointer"
          />
        </div>
      )}
    </div>
  )
}

export default Sidebar