
import React, { useState, useEffect } from 'react';
import ScheduleGrid, { ViewDensity, Track } from '@/components/ScheduleGrid';
import { Session } from '@/data/scheduleData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster } from "@/components/ui/toaster";
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { 
  format, 
  addMonths, 
  subMonths, 
  eachDayOfInterval, 
  startOfMonth, 
  endOfMonth,
  startOfWeek, 
  endOfWeek,
  isSameDay, 
  isFriday,
  getMonth,
  getYear,
  setMonth,
  setYear,
  addWeeks
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Share2, Filter, SlidersHorizontal } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Index = () => {
  const [viewDensity, setViewDensity] = useState<ViewDensity>('month');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [days, setDays] = useState<any[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [trackVisibility, setTrackVisibility] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  
  const timeRangeOptions = [
    { value: 'week', label: 'Week' },
    { value: '2weeks', label: '2 Weeks' },
    { value: 'month', label: 'Month' },
    { value: '2months', label: '2 Months' },
    { value: 'custom', label: 'Custom Range' }
  ];
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: tracksData, error: tracksError } = await supabase
          .from('tracks')
          .select('*');

        if (tracksError) throw tracksError;

        const formattedTracks = tracksData.map((track: any) => ({
          id: track.id,
          name: track.name,
          groupId: track.group_id,
          visible: track.visible
        }));

        setTracks(formattedTracks);
        
        const visibilityState = tracksData.reduce((acc: Record<string, boolean>, track: any) => {
          acc[track.id] = track.visible;
          return acc;
        }, {});
        setTrackVisibility(visibilityState);

        // Get sessions and properly map the fields
        const { data: sessionsData, error: sessionsError } = await supabase
          .from('sessions')
          .select('*');

        if (sessionsError) throw sessionsError;

        const formattedSessions = sessionsData.map((session: any) => ({
          id: session.id,
          dayId: session.day_id,
          trackId: session.track_id,
          title: session.title,
          instructor: session.instructor,
          type: session.type,
          time: session.time,
          customStartTime: session.custom_start_time,
          customEndTime: session.custom_end_time,
          count: session.count || 0,
          total: session.total || 0
        }));

        setSessions(formattedSessions);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load schedule data.",
        });
        setLoading(false);
      }
    };

    generateDays(currentMonth);
    fetchData();
    
    // Set up real-time subscription
    const tracksChannel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'tracks' }, 
        () => {
          console.log('Tracks changed, refreshing data');
          fetchData();
          toast({
            title: "Tracks Updated",
            description: "Track data has been updated",
          });
        }
      )
      .subscribe();
      
    const sessionsChannel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'sessions' }, 
        () => {
          console.log('Sessions changed, refreshing data');
          fetchData();
          toast({
            title: "Sessions Updated",
            description: "Session data has been updated",
          });
        }
      )
      .subscribe();
      
    const groupsChannel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'track_groups' }, 
        () => {
          console.log('Groups changed, refreshing data');
          fetchData();
          toast({
            title: "Track Groups Updated",
            description: "Track group data has been updated",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(tracksChannel);
      supabase.removeChannel(sessionsChannel);
      supabase.removeChannel(groupsChannel);
    };
  }, [currentMonth, viewDensity]);

  const generateDays = (baseDate: Date) => {
    let start, end;
    
    switch (viewDensity) {
      case 'week':
        start = startOfWeek(baseDate, { weekStartsOn: 1 });
        end = endOfWeek(baseDate, { weekStartsOn: 1 });
        break;
      case '2weeks':
        start = startOfWeek(baseDate, { weekStartsOn: 1 });
        end = endOfWeek(addWeeks(baseDate, 1), { weekStartsOn: 1 });
        break;
      case 'month':
        start = startOfMonth(baseDate);
        end = endOfMonth(baseDate);
        break;
      case '2months':
        start = startOfMonth(baseDate);
        end = endOfMonth(addMonths(baseDate, 1));
        break;
      default:
        start = startOfMonth(baseDate);
        end = endOfMonth(baseDate);
    }
    
    const daysArray = eachDayOfInterval({ start, end });
    
    const formattedDays = daysArray.map(day => ({
      id: format(day, 'yyyy-MM-dd'),
      name: format(day, 'EEEE'),
      date: format(day, 'MMM d, yyyy'),
      fullDate: day,
      isFriday: isFriday(day)
    }));
    
    setDays(formattedDays);
  };

  const handlePreviousMonth = () => {
    if (viewDensity === 'week' || viewDensity === '2weeks') {
      setCurrentMonth(prev => addWeeks(prev, -1));
    } else {
      setCurrentMonth(prev => subMonths(prev, 1));
    }
  };

  const handleNextMonth = () => {
    if (viewDensity === 'week' || viewDensity === '2weeks') {
      setCurrentMonth(prev => addWeeks(prev, 1));
    } else {
      setCurrentMonth(prev => addMonths(prev, 1));
    }
  };

  const handleMonthChange = (month: number) => {
    setCurrentMonth(prev => setMonth(prev, month));
  };

  const handleYearChange = (year: number) => {
    setCurrentMonth(prev => setYear(prev, year));
  };

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

  const currentYear = getYear(new Date());
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);
  
  const getTimeRangeDisplay = () => {
    switch (viewDensity) {
      case 'week':
        return `Week of ${format(startOfWeek(currentMonth, { weekStartsOn: 1 }), 'MMM d, yyyy')}`;
      case '2weeks':
        return `2 Weeks from ${format(startOfWeek(currentMonth, { weekStartsOn: 1 }), 'MMM d')} to ${format(endOfWeek(addWeeks(currentMonth, 1), { weekStartsOn: 1 }), 'MMM d, yyyy')}`;
      case 'month':
        return format(currentMonth, 'MMMM yyyy');
      case '2months':
        return `${format(currentMonth, 'MMMM')} - ${format(addMonths(currentMonth, 1), 'MMMM yyyy')}`;
      default:
        return format(currentMonth, 'MMMM yyyy');
    }
  };
  
  const visibleTracks = tracks.filter(track => trackVisibility[track.id] !== false);

  return (
    <div className="min-h-screen p-4 md:p-6 max-w-[1600px] mx-auto">
      <header className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <h1 className="text-2xl md:text-3xl font-bold">Digital Arts and Design Academy Schedule</h1>
        </div>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handlePreviousMonth}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="min-w-[180px]">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {getTimeRangeDisplay()}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="p-3">
                      <div className="flex justify-between mb-3">
                        <Select 
                          value={String(getMonth(currentMonth))} 
                          onValueChange={(value) => handleMonthChange(Number(value))}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => (
                              <SelectItem key={i} value={String(i)}>
                                {format(new Date(2000, i, 1), 'MMMM')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Select 
                          value={String(getYear(currentMonth))} 
                          onValueChange={(value) => handleYearChange(Number(value))}
                        >
                          <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent>
                            {years.map(year => (
                              <SelectItem key={year} value={String(year)}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Calendar
                        mode="single"
                        selected={currentMonth}
                        onSelect={(date) => {
                          if (date) {
                            setCurrentMonth(date);
                            setIsDatePickerOpen(false);
                          }
                        }}
                        className="rounded-md border"
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleNextMonth}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                
                <Select value={viewDensity} onValueChange={(value) => setViewDensity(value as ViewDensity)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Select view" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeRangeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Separator orientation="vertical" className="h-8 hidden md:block" />
              
              <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters & Settings
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Track Visibility</h4>
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
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-medium mb-2">Group Settings</h4>
                      <Button variant="outline" size="sm" className="w-full">
                        Manage Track Groups
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>
      </header>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <ScheduleGrid 
          days={days} 
          tracks={visibleTracks} 
          sessions={sessions}
          viewDensity={viewDensity}
        />
      </div>
      
      <Toaster />
    </div>
  );
};

export default Index;
