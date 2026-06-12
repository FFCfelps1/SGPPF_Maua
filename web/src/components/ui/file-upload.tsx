"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { RiFilePdfLine, RiUploadCloud2Line, RiDeleteBinLine, RiLoader4Line } from "@remixicon/react";
import { toast } from "sonner";

export function FileUpload({
  label,
  value,
  onUpload,
  onRemove,
  bucket = "documents",
  folder = "general",
}: {
  label: string;
  value?: string | null;
  onUpload: (url: string) => void;
  onRemove: () => void;
  bucket?: string;
  folder?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Apenas arquivos PDF são permitidos");
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error("O arquivo deve ter no máximo 10MB");
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      onUpload(publicUrl);
      toast.success("Arquivo enviado com sucesso!");
    } catch (error: any) {
      console.error("Error uploading file:", error);
      toast.error("Erro ao enviar arquivo: " + (error.message || "Tente novamente"));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>
      
      {value ? (
        <div className="flex items-center justify-between rounded-md border bg-muted/30 p-2 text-sm">
          <a 
            href={value} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-primary hover:underline font-medium"
          >
            <RiFilePdfLine className="size-4" />
            Visualizar Documento PDF
          </a>
          <Button 
            variant="ghost" 
            size="icon-xs" 
            className="text-destructive hover:bg-destructive/10"
            onClick={onRemove}
          >
            <RiDeleteBinLine className="size-4" />
          </Button>
        </div>
      ) : (
        <div className="relative group">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            disabled={uploading}
            className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
          />
          <div className="flex h-20 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/5 transition-colors group-hover:bg-muted/10">
            {uploading ? (
              <RiLoader4Line className="size-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <RiUploadCloud2Line className="size-6 text-muted-foreground mb-1" />
                <p className="text-xs text-muted-foreground font-medium">
                  Clique ou arraste para anexar o PDF (Máx. 10MB)
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
