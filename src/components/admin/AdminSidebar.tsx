import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  ShoppingBag, 
  Package, 
  CreditCard, 
  MessageSquare, 
  Settings,
  LogOut,
  LayoutDashboard,
  FileText,
  Wallet
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/home', icon: Home, label: 'Home Page' },
  { to: '/admin/items', icon: ShoppingBag, label: 'Items' },
  { to: '/admin/rentals', icon: Package, label: 'Rentals' },
  { to: '/admin/payment', icon: CreditCard, label: 'Payment Methods' },
  { to: '/admin/payment-settings', icon: Wallet, label: 'Payment Settings' },
  { to: '/admin/terms', icon: FileText, label: 'Terms & Conditions' },
  { to: '/admin/contact', icon: MessageSquare, label: 'Contact' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

const AdminSidebar = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <aside className="w-64 min-h-screen bg-card border-r border-border flex flex-col sticky top-0 h-screen overflow-y-auto">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your store</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-button'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Sign Out */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          onClick={handleSignOut}
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
