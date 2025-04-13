
import React from 'react';
import { Track } from '@/types/schedule';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TrackFilterProps {
  tracks: Track[];
  trackVisibility: Record<string, boolean>;
  setTrackVisibility: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  setTracks: React.Dispatch<React.SetStateAction<Track[]>>;
}

const TrackFilter: React.FC<TrackFilterProps> = ({ 
  tracks, 
  trackVisibility, 
  setTrackVisibility,
  setTracks
}) => {
  const { toast } = useToast();

  const handleToggleTrackVisibility = async (trackId: string, visible: boolean) => {
    try {
      setTrackVisibility(prev => ({
        ...prev,
        [trackId]: visible
      }));
      
      const { error } = await supabase
        .from('tracks')
        .update({ visible })
        .eq('id', trackId);
        
      if (error) throw error;
      
      setTracks(prev => 
        prev.map(track => 
          track.id === trackId ? { ...track, visible } : track
        )
      );
    } catch (error) {
      console.error('Error updating track visibility:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update track visibility.",
      });
    }
  };
  
  const handleCopyTrackLink = (trackId: string, trackName: string) => {
    const url = `${window.location.origin}/track/${trackId}`;
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "Link copied",
        description: `Link to ${trackName} schedule has been copied to clipboard.`,
      });
    }).catch(err => {
      console.error('Error copying text: ', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy link.",
      });
    });
  };

  return (
    <ScrollArea className="h-[200px]">
      <div className="space-y-2">
        {tracks.map(track => (
          <div key={track.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id={`track-${track.id}`}
                checked={trackVisibility[track.id] !== false}
                onCheckedChange={(checked) => handleToggleTrackVisibility(track.id, checked)}
              />
              <Label htmlFor={`track-${track.id}`}>{track.name}</Label>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              title="Copy track link"
              onClick={() => handleCopyTrackLink(track.id, track.name)}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default TrackFilter;
