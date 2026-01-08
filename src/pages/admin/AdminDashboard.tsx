import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, Package, MessageSquare, TrendingUp } from 'lucide-react';

const stats = [
  { title: 'Total Items', value: '24', icon: ShoppingBag, color: 'bg-primary/10 text-primary' },
  { title: 'Rentals', value: '12', icon: Package, color: 'bg-success/10 text-success' },
  { title: 'Contact Requests', value: '8', icon: MessageSquare, color: 'bg-accent/10 text-accent' },
  { title: 'This Month', value: '+15%', icon: TrendingUp, color: 'bg-whatsapp/10 text-whatsapp' },
];

const AdminDashboard = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's an overview of your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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
              <div className="text-2xl font-bold">{stat.value}</div>
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
          <a
            href="/admin/items"
            className="p-4 rounded-lg border border-border hover:bg-secondary transition-colors text-center"
          >
            <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-primary" />
            <p className="font-medium">Manage Items</p>
          </a>
          <a
            href="/admin/rentals"
            className="p-4 rounded-lg border border-border hover:bg-secondary transition-colors text-center"
          >
            <Package className="w-8 h-8 mx-auto mb-2 text-success" />
            <p className="font-medium">Manage Rentals</p>
          </a>
          <a
            href="/admin/settings"
            className="p-4 rounded-lg border border-border hover:bg-secondary transition-colors text-center"
          >
            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-accent" />
            <p className="font-medium">Site Settings</p>
          </a>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
