import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Phone, Mail, Trash2, MessageSquare } from 'lucide-react';
import { ContactSubmission } from '@/types/database';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';

const AdminContact = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: ContactSubmission['status']) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      toast({ title: 'Status updated!' });
      fetchSubmissions();
    } catch (error) {
      toast({ title: 'Error', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this submission?')) return;
    try {
      const { error } = await supabase.from('contact_submissions').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Deleted!' });
      fetchSubmissions();
    } catch (error) {
      toast({ title: 'Error', variant: 'destructive' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-primary';
      case 'contacted': return 'bg-warning';
      case 'completed': return 'bg-success';
      default: return 'bg-muted';
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Contact Submissions</h1>
        <p className="text-muted-foreground mt-1">Manage customer inquiries and custom orders</p>
      </div>

      <div className="space-y-4">
        {submissions.map((submission) => (
          <Card key={submission.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">{submission.name}</h3>
                    <Badge className={getStatusColor(submission.status)}>{submission.status}</Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Phone className="w-4 h-4" /> {submission.phone}
                    </span>
                    {submission.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="w-4 h-4" /> {submission.email}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" /> 
                      {new Date(submission.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Requirement:</p>
                    <p className="text-foreground">{submission.requirement}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Select
                    value={submission.status}
                    onValueChange={(value) => updateStatus(submission.id, value as ContactSubmission['status'])}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => window.open(`https://wa.me/${submission.phone.replace(/\D/g, '')}`, '_blank')}
                  >
                    <WhatsAppIcon className="w-4 h-4" /> Chat
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => handleDelete(submission.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {submissions.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No contact submissions yet.</p>
        </Card>
      )}
    </div>
  );
};

export default AdminContact;
