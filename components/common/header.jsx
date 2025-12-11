'use client';

import { Bell, User, LogOut, Settings, Menu } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useConfirmDialog } from '@/components/common';
import { getUserInitials } from '@/lib/utils';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

export function Header({ onMenuClick }) {
  const { data: session } = useSession();
  const { ConfirmDialog, showConfirm } = useConfirmDialog();
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    const confirmed = await showConfirm({
      title: "Sign Out",
      message: "Are you sure you want to sign out from your account?",
      variant: "warning",
      confirmText: "Yes, Sign Out",
      cancelText: "Cancel",
    });

    if (confirmed) {
      await signOut({ callbackUrl: "/" });
    }
  };

  return (
    <>
      <header className={`sticky top-0 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 ${isProfileMenuOpen ? 'z-20' : 'z-40'}`}>
        <div className="flex h-16 items-center justify-between px-4 lg:px-6">
          {/* Left side - Mobile menu button */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onMenuClick();
              }}
              className="lg:hidden p-2 hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6 text-gray-700" />
            </Button>
          </div>

          {/* Right side - notifications and profile */}
          <div className="flex items-center gap-4 ml-auto">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNotificationDialog(true)}
              className="relative h-9 w-9 rounded-full p-0 hover:bg-gray-100 cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5 text-gray-600" />
              {/* Notification badge - you can make this dynamic */}
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                3
              </Badge>
            </Button>

            {/* Profile Dropdown */}
            <DropdownMenu open={isProfileMenuOpen} onOpenChange={setIsProfileMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full p-0 hover:bg-gray-100"
                  aria-label="User menu"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={session?.user?.image || ''}
                      alt={session?.user?.name || 'User'}
                    />
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                      {getUserInitials(session?.user?.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 z-[80]" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session?.user?.name || 'User'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session?.user?.email || 'user@example.com'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Profile Menu Backdrop */}
      {isProfileMenuOpen && (
        <div
          className="fixed inset-0 z-[75] bg-black/20 backdrop-blur-sm"
          onClick={() => setIsProfileMenuOpen(false)}
        />
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog />

      {/* Notification Coming Soon Dialog */}
      <Dialog open={showNotificationDialog} onOpenChange={setShowNotificationDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Bell className="w-6 h-6 text-blue-500" />
              </div>
              Notifications - Coming Soon
            </DialogTitle>
          </DialogHeader>

          <DialogDescription asChild>
            <div className="text-sm text-gray-700 space-y-3">
              <p>
                Stay updated with important financial notifications, reminders, and alerts.
                Get notified about budget limits, upcoming bills, transaction approvals, and more.
              </p>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="font-medium text-blue-900 mb-1">Features:</p>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• Budget alerts and spending notifications</li>
                  <li>• Bill payment reminders</li>
                  <li>• Transaction confirmations</li>
                  <li>• Financial goal milestones</li>
                  <li>• Security alerts</li>
                </ul>
              </div>
              <p className="text-gray-600">
                We're working on bringing you a comprehensive notification system. Stay tuned!
              </p>
            </div>
          </DialogDescription>

          <DialogFooter>
            <Button onClick={() => setShowNotificationDialog(false)} className="w-full sm:w-auto">
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}