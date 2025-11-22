import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Clipboard } from 'lucide-react';
import { courses } from '@/data/courses';

export const DPPManager = () => {
  const [dpps, setDpps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDpp, setEditingDpp] = useState<any>(null);
  const [formData, setFormData] = useState({
    course_id: '',
    title: '',
    description: '',
    pdf_url: '',
    difficulty: 'medium',
    day_number: 1
  });

  useEffect(() => {
    loadDPPs();
  }, []);

  const loadDPPs = async () => {
    try {
      const { data, error } = await supabase
        .from('daily_practice_problems')
        .select('*')
        .order('day_number', { ascending: true });

      if (error) throw error;
      setDpps(data || []);
    } catch (error: any) {
      toast.error('Error loading DPPs: ' + error.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingDpp) {
        const { error } = await supabase
          .from('daily_practice_problems')
          .update(formData)
          .eq('id', editingDpp.id);

        if (error) throw error;
        toast.success('DPP updated!');
      } else {
        const { error } = await supabase
          .from('daily_practice_problems')
          .insert([formData]);

        if (error) throw error;
        toast.success('DPP added!');
      }

      resetForm();
      loadDPPs();
      setDialogOpen(false);
    } catch (error: any) {
      toast.error('Error saving DPP: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this DPP?')) return;

    try {
      const { error } = await supabase
        .from('daily_practice_problems')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('DPP deleted!');
      loadDPPs();
    } catch (error: any) {
      toast.error('Error deleting DPP: ' + error.message);
    }
  };

  const handleEdit = (dpp: any) => {
    setEditingDpp(dpp);
    setFormData({
      course_id: dpp.course_id,
      title: dpp.title,
      description: dpp.description || '',
      pdf_url: dpp.pdf_url,
      difficulty: dpp.difficulty || 'medium',
      day_number: dpp.day_number
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingDpp(null);
    setFormData({
      course_id: '',
      title: '',
      description: '',
      pdf_url: '',
      difficulty: 'medium',
      day_number: 1
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Daily Practice Problems (DPP)</h2>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add DPP
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingDpp ? 'Edit DPP' : 'Add New DPP'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Course</Label>
                <Select
                  value={formData.course_id}
                  onValueChange={(value) => setFormData({ ...formData, course_id: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>PDF URL</Label>
                <Input
                  value={formData.pdf_url}
                  onChange={(e) => setFormData({ ...formData, pdf_url: e.target.value })}
                  placeholder="https://..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Difficulty</Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Day Number</Label>
                  <Input
                    type="number"
                    value={formData.day_number}
                    onChange={(e) => setFormData({ ...formData, day_number: parseInt(e.target.value) })}
                    min={1}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Saving...' : editingDpp ? 'Update DPP' : 'Add DPP'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dpps.map((dpp) => (
          <Card key={dpp.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <Clipboard className="h-8 w-8 text-primary" />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(dpp)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(dpp.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardTitle className="text-lg">{dpp.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-2">
                <Badge variant="outline" className="capitalize">{dpp.difficulty}</Badge>
                <Badge variant="secondary">Day {dpp.day_number}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{dpp.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {dpps.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No DPPs yet. Add your first one!
        </div>
      )}
    </div>
  );
};