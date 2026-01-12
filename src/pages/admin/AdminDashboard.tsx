import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, Package, MessageSquare, TrendingUp, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Link } from 'react-router-dom';

interface DashboardStats {
  totalItems: number;
  totalRentals: number;
  totalContacts: number;
  thisMonthItems: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalItems: 0,
    totalRentals: 0,
    totalContacts: 0,
    thisMonthItems: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch total items count
      const { count: itemsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('is_rental', false);

      // Fetch total rentals count
      const { count: rentalsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('is_rental', true);

      // Fetch contact submissions count
      const { count: contactsCount } = await supabase
        .from('contact_submissions')
        .select('*', { count: 'exact', head: true });

      // Fetch items added this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count: thisMonthCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfMonth.toISOString());

      setStats({
        totalItems: itemsCount || 0,
        totalRentals: rentalsCount || 0,
        totalContacts: contactsCount || 0,
        thisMonthItems: thisMonthCount || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsDisplay = [
    { title: 'Total Items', value: stats.totalItems, icon: ShoppingBag, color: 'bg-primary/10 text-primary' },
    { title: 'Rentals', value: stats.totalRentals, icon: Package, color: 'bg-success/10 text-success' },
    { title: 'Contact Requests', value: stats.totalContacts, icon: MessageSquare, color: 'bg-accent/10 text-accent' },
    { title: 'Added This Month', value: stats.thisMonthItems, icon: TrendingUp, color: 'bg-whatsapp/10 text-whatsapp' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's an overview of your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsDisplay.map((stat, index) => (
          <Card key={stat.title} className="card-hover" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : (
                <div className="text-2xl font-bold">{stat.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/items"
            className="p-4 rounded-lg border border-border hover:bg-secondary transition-colors text-center"
          >
            <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-primary" />
            <p className="font-medium">Manage Items</p>
          </Link>
          <Link
            to="/admin/rentals"
            className="p-4 rounded-lg border border-border hover:bg-secondary transition-colors text-center"
          >
            <Package className="w-8 h-8 mx-auto mb-2 text-success" />
            <p className="font-medium">Manage Rentals</p>
          </Link>
          <Link
            to="/admin/settings"
            className="p-4 rounded-lg border border-border hover:bg-secondary transition-colors text-center"
          >
            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-accent" />
            <p className="font-medium">Site Settings</p>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
