import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination } from '@/components/Pagination';
import SpecificationModal from '@/components/admin/SpecificationModal';
import { ImageReorder } from '@/components/admin/ImageReorder';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Loader2, Star, X, Image, Video, Percent, DollarSign } from 'lucide-react';
import { Product } from '@/types/database';

const ITEMS_PER_PAGE = 10;
const MAX_MEDIA = 4;

const AdminItems = () => {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [specModalOpen, setSpecModalOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    discount_type: 'percentage' as 'percentage' | 'amount',
    discount_value: '',
    image: '',
    images: [] as string[],
    category: '',
    specifications: {} as Record<string, string>,
    is_featured: false,
    is_active: true,
    content: '',
  });

  useEffect(() => {
    fetchItems();
  }, [currentPage]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('is_rental', false);

      setTotalCount(count || 0);

      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_rental', false)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        original_price: formData.original_price || null,
        discount_type: formData.discount_value ? formData.discount_type : null,
        discount_value: formData.discount_value ? parseFloat(formData.discount_value) : null,
        image: formData.images[0] || formData.image,
        images: formData.images,
        category: formData.category,
        specifications: formData.specifications,
        content: formData.content,
        is_featured: formData.is_featured,
        is_active: formData.is_active,
        is_rental: false,
        updated_at: new Date().toISOString(),
      };

      if (editingItem) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert([productData]);
        if (error) throw error;
      }

      toast({ title: editingItem ? 'Item updated!' : 'Item created!' });
      setDialogOpen(false);
      resetForm();
      fetchItems();
    } catch (error) {
      console.error('Error:', error);
      toast({ title: 'Error saving item', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Item deleted!' });
      fetchItems();
    } catch (error) {
      console.error('Error:', error);
      toast({ title: 'Error deleting item', variant: 'destructive' });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      original_price: '',
      discount_type: 'percentage',
      discount_value: '',
      image: '',
      images: [],
      category: '',
      specifications: {},
      is_featured: false,
      is_active: true,
      content: '',
    });
    setEditingItem(null);
  };

  const openEditDialog = (item: Product) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      original_price: item.original_price?.toString() || '',
      discount_type: item.discount_type || 'percentage',
      discount_value: item.discount_value?.toString() || '',
      image: item.image || '',
      images: item.images || [],
      category: item.category || '',
      specifications: item.specifications || {},
      is_featured: item.is_featured,
      is_active: item.is_active,
      content: item.content || '',
    });
    setDialogOpen(true);
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const currentCount = formData.images.length;
    const remainingSlots = MAX_MEDIA - currentCount;
    
    if (remainingSlots <= 0) {
      toast({ title: `Maximum ${MAX_MEDIA} media files allowed`, variant: 'destructive' });
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    setUploadingMedia(true);

    try {
      const uploadedUrls: string[] = [];
      
      for (const file of filesToUpload) {
        const fileExt = file.name.split('.').pop();
        const isVideo = file.type.startsWith('video/');
        const fileName = `${isVideo ? 'video' : 'product'}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage.from('images').upload(fileName, file);
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('images').getPublicUrl(fileName);
        uploadedUrls.push(data.publicUrl);
      }

      setFormData(prev => ({ 
        ...prev, 
        images: [...prev.images, ...uploadedUrls],
        image: prev.images.length === 0 ? uploadedUrls[0] : prev.image
      }));
      toast({ title: `${uploadedUrls.length} file(s) uploaded!` });
    } catch (error) {
      console.error('Upload error:', error);
      toast({ title: 'Upload failed', variant: 'destructive' });
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleImageReorder = (newImages: string[]) => {
    setFormData(prev => ({
      ...prev,
      images: newImages,
      image: newImages[0] || ''
    }));
  };

  const removeMedia = (index: number) => {
    setFormData(prev => {
      const newImages = prev.images.filter((_, i) => i !== index);
      return {
        ...prev,
        images: newImages,
        image: newImages[0] || ''
      };
    });
  };

  const addSpecification = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: { ...prev.specifications, [key]: value }
    }));
  };

  const updateSpecification = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: { ...prev.specifications, [key]: value }
    }));
  };

  const removeSpecification = (key: string) => {
    setFormData(prev => {
      const newSpecs = { ...prev.specifications };
      delete newSpecs[key];
      return { ...prev, specifications: newSpecs };
    });
  };

  const isVideo = (url: string) => {
    return url.match(/\.(mp4|webm|ogg|mov)$/i);
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading && items.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Items</h1>
          <p className="text-muted-foreground mt-1">Manage your product catalog ({totalCount} items)</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> Add Item</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input id="name" value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" value={formData.category} onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Short Description</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))} rows={2} placeholder="Brief product description..." />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Detailed Content</Label>
                <Textarea 
                  id="content" 
                  value={formData.content} 
                  onChange={(e) => setFormData(p => ({ ...p, content: e.target.value }))} 
                  rows={5} 
                  placeholder="Detailed product information, features, usage instructions..."
                />
                <p className="text-xs text-muted-foreground">This will be displayed on the product detail page</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price * (e.g., ₹999 or $49.99)</Label>
                  <Input id="price" type="text" value={formData.price} onChange={(e) => setFormData(p => ({ ...p, price: e.target.value }))} required placeholder="₹999" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="original_price">Original Price (for strikethrough)</Label>
                  <Input id="original_price" type="text" value={formData.original_price} onChange={(e) => setFormData(p => ({ ...p, original_price: e.target.value }))} placeholder="₹1299" />
                </div>
              </div>

              {/* Discount Section */}
              <div className="space-y-3 p-4 rounded-lg border bg-muted/30">
                <Label className="text-sm font-semibold">Discount Badge (Optional)</Label>
                <p className="text-xs text-muted-foreground">Set either percentage OR flat amount discount to display on product</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Discount Type</Label>
                    <Select 
                      value={formData.discount_type} 
                      onValueChange={(v: 'percentage' | 'amount') => setFormData(p => ({ ...p, discount_type: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">
                          <div className="flex items-center gap-2">
                            <Percent className="w-4 h-4" /> Percentage (%)
                          </div>
                        </SelectItem>
                        <SelectItem value="amount">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4" /> Flat Amount (₹)
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discount_value">
                      Discount Value {formData.discount_type === 'percentage' ? '(%)' : '(₹)'}
                    </Label>
                    <Input 
                      id="discount_value" 
                      type="number" 
                      value={formData.discount_value} 
                      onChange={(e) => setFormData(p => ({ ...p, discount_value: e.target.value }))} 
                      placeholder={formData.discount_type === 'percentage' ? 'e.g., 20' : 'e.g., 100'} 
                    />
                  </div>
                </div>
              </div>

              {/* Media Upload Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Product Media (up to {MAX_MEDIA} images/videos)</Label>
                  <span className="text-sm text-muted-foreground">{formData.images.length}/{MAX_MEDIA}</span>
                </div>
                
                {formData.images.length < MAX_MEDIA && (
                  <div className="flex items-center gap-4">
                    <Input 
                      type="file" 
                      accept="image/*,video/*" 
                      multiple
                      onChange={handleMediaUpload}
                      disabled={uploadingMedia}
                      className="max-w-xs"
                    />
                    {uploadingMedia && <Loader2 className="w-4 h-4 animate-spin" />}
                  </div>
                )}

                <ImageReorder
                  images={formData.images}
                  onReorder={handleImageReorder}
                  onRemove={removeMedia}
                  maxMedia={MAX_MEDIA}
                />
              </div>

              {/* Specifications Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Specifications</Label>
                  <Button type="button" variant="outline" size="sm" onClick={() => setSpecModalOpen(true)}>
                    <Plus className="w-3 h-3 mr-1" /> Add
                  </Button>
                </div>
                
                {Object.entries(formData.specifications).length > 0 ? (
                  <div className="space-y-2">
                    {Object.entries(formData.specifications).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2">
                        <span className="w-32 text-sm font-medium truncate">{key}:</span>
                        <Input 
                          value={value} 
                          onChange={(e) => updateSpecification(key, e.target.value)}
                          placeholder={`Enter ${key}`}
                          className="flex-1"
                        />
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeSpecification(key)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No specifications added. Click "Add" to add product specs like Color, Size, etc.</p>
                )}
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch id="is_featured" checked={formData.is_featured} onCheckedChange={(c) => setFormData(p => ({ ...p, is_featured: c }))} />
                  <Label htmlFor="is_featured">Featured Item</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="is_active" checked={formData.is_active} onCheckedChange={(c) => setFormData(p => ({ ...p, is_active: c }))} />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingItem ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Specification Modal */}
      <SpecificationModal
        open={specModalOpen}
        onOpenChange={setSpecModalOpen}
        onAdd={addSpecification}
      />

      {/* Items Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Card key={item.id} className="card-hover overflow-hidden">
                <div className="aspect-square relative bg-secondary">
                  {item.images?.[0] || item.image ? (
                    <img src={item.images?.[0] || item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Image className="w-12 h-12" />
                    </div>
                  )}
                  {item.is_featured && (
                    <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs flex items-center gap-1">
                      <Star className="w-3 h-3" /> Featured
                    </div>
                  )}
                  {item.discount_value && (
                    <div className="absolute top-2 right-2 bg-discount text-discount-foreground px-2 py-1 rounded text-xs font-bold">
                      {item.discount_type === 'percentage' ? `${item.discount_value}% OFF` : `₹${item.discount_value} OFF`}
                    </div>
                  )}
                  {!item.is_active && (
                    <div className="absolute bottom-2 left-2 bg-muted text-muted-foreground px-2 py-1 rounded text-xs">Inactive</div>
                  )}
                  {item.images && item.images.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                      +{item.images.length - 1} more
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold truncate">{item.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-bold text-primary">{item.price}</span>
                    {item.original_price && (
                      <span className="text-sm text-muted-foreground line-through">{item.original_price}</span>
                    )}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditDialog(item)}>
                      <Pencil className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {items.length === 0 && (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No items yet. Click "Add Item" to create your first product.</p>
            </Card>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={totalCount}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </>
      )}
    </div>
  );
};

export default AdminItems;
