"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent } from "./ui/card";
import { Upload, Link, Image as ImageIcon, X, Check } from "lucide-react";

interface ImagePickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const predefinedImages = [
  "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=500&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&h=500&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&h=500&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&h=500&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=500&h=500&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=500&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1609592604820-7cfc30c3ae23?w=500&h=500&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=500&h=500&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1493020258366-be3ead1b3027?w=500&h=500&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=500&h=500&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&h=500&fit=crop&crop=center"
];

export function ImagePicker({ value, onChange, className }: ImagePickerProps) {
  const [urlInput, setUrlInput] = useState(value || "");
  const [dragActive, setDragActive] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setUploadPreview(result);
        onChange(result);
      };
      reader.readAsDataURL(imageFile);
    }
  }, [onChange]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setUploadPreview(result);
        onChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUploadPreview(null);
    }
  };

  const handlePredefinedSelect = (imageUrl: string) => {
    onChange(imageUrl);
    setUploadPreview(null);
    setUrlInput(imageUrl);
  };

  const clearImage = () => {
    onChange("");
    setUrlInput("");
    setUploadPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const currentImage = uploadPreview || value;

  return (
    <div className={className}>
      <Label htmlFor="image">Product Image</Label>
      
      {/* Current Image Preview */}
      {currentImage && (
        <div className="relative w-full h-48 mb-4 bg-muted rounded-lg overflow-hidden">
          <img 
            src={currentImage} 
            alt="Product preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={clearImage}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      <Tabs defaultValue="url" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="url">URL</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
        </TabsList>

        <TabsContent value="url" className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter image URL"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleUrlSubmit()}
            />
            <Button type="button" onClick={handleUrlSubmit} variant="outline">
              <Link className="w-4 h-4 mr-2" />
              Use URL
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? "border-primary bg-primary/5" 
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Upload className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">
              Drag and drop an image here, or click to browse
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Choose File
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="gallery" className="space-y-4">
          <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
            {predefinedImages.map((imageUrl, index) => (
              <Card 
                key={index} 
                className={`relative cursor-pointer transition-all hover:ring-2 hover:ring-primary ${
                  value === imageUrl ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handlePredefinedSelect(imageUrl)}
              >
                <CardContent className="p-0">
                  <div className="aspect-square overflow-hidden rounded-lg">
                    <img 
                      src={imageUrl} 
                      alt={`Option ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                  {value === imageUrl && (
                    <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-1">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}