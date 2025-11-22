import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, FileText } from 'lucide-react';
import { courses } from '@/data/courses';

export const LessonPlanManager = () => {
  const [lessonPlans, setLessonPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [formData, setFormData] = useState({
    course_id: '',
    title: '',
    description: '',
    pdf_url: '',
    week_number: 0,
    day_number: 0
  });

  useEffect(() => {
    loadLessonPlans();
  }, []);

  const loadLessonPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('lesson_plans')
        .select('*')
        .order('week_number', { ascending: true });

      if (error) throw error;
      setLessonPlans(data || []);
    } catch (error: any) {
      toast.error('Error loading lesson plans: ' + error.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingPlan) {
        const { error } = await supabase
          .from('lesson_plans')
          .update(formData)
          .eq('id', editingPlan.id);

        if (error) throw error;
        toast.success('Lesson plan updated!');
      } else {
        const { error } = await supabase
          .from('lesson_plans')
          .insert([formData]);

        if (error) throw error;
        toast.success('Lesson plan added!');
      }

      resetForm();
      loadLessonPlans();
      setDialogOpen(false);
    } catch (error: any) {
      toast.error('Error saving lesson plan: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lesson plan?')) return;

    try {
      const { error } = await supabase
        .from('lesson_plans')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Lesson plan deleted!');
      loadLessonPlans();
    } catch (error: any) {
      toast.error('Error deleting lesson plan: ' + error.message);
    }
  };

  const handleEdit = (plan: any) => {
    setEditingPlan(plan);
    setFormData({
      course_id: plan.course_id,
      title: plan.title,
      description: plan.description || '',
      pdf_url: plan.pdf_url,
      week_number: plan.week_number || 0,
      day_number: plan.day_number || 0
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingPlan(null);
    setFormData({
      course_id: '',
      title: '',
      description: '',
      pdf_url: '',
      week_number: 0,
      day_number: 0
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Lesson Plan Management</h2>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Lesson Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingPlan ? 'Edit Lesson Plan' : 'Add New Lesson Plan'}</DialogTitle>
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
                  <Label>Week Number</Label>
                  <Input
                    type="number"
                    value={formData.week_number}
                    onChange={(e) => setFormData({ ...formData, week_number: parseInt(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Day Number</Label>
                  <Input
                    type="number"
                    value={formData.day_number}
                    onChange={(e) => setFormData({ ...formData, day_number: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Saving...' : editingPlan ? 'Update Plan' : 'Add Plan'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lessonPlans.map((plan) => (
          <Card key={plan.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <FileText className="h-8 w-8 text-primary" />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(plan)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(plan.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardTitle className="text-lg">{plan.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">{plan.description}</p>
              <p className="text-xs text-muted-foreground">
                Week {plan.week_number}, Day {plan.day_number}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {lessonPlans.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No lesson plans yet. Add your first one!
        </div>
      )}
    </div>
  );
};