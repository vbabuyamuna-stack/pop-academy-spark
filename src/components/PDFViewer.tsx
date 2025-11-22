import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Printer, ExternalLink, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface PDFViewerProps {
  title: string;
  url: string;
  description?: string;
  type?: string;
}

export const PDFViewer = ({ title, url, description, type = 'pdf' }: PDFViewerProps) => {
  const [showViewer, setShowViewer] = useState(false);

  const handlePrint = () => {
    window.open(url, '_blank');
    setTimeout(() => {
      window.print();
    }, 1000);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Card className="group hover:shadow-lg transition-all">
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <FileText className="h-8 w-8 text-primary" />
            <Badge variant="secondary" className="capitalize">{type}</Badge>
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          {description && (
            <p className="text-sm text-muted-foreground mb-4">{description}</p>
          )}
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant="default"
              size="sm"
              className="gap-2 flex-1"
              onClick={() => setShowViewer(true)}
            >
              <Eye className="h-4 w-4" />
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              asChild
            >
              <a href={url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showViewer} onOpenChange={setShowViewer}>
        <DialogContent className="max-w-6xl h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{title}</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden rounded-lg border">
            <iframe
              src={url}
              className="w-full h-full"
              title={title}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};