
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { AudioConfig } from "@/lib/audio";

interface NotificationControlsProps {
  onConfigChange: (config: Partial<AudioConfig>) => void;
}

const NotificationControls = ({ onConfigChange }: NotificationControlsProps) => {
  const [volume, setVolume] = useState([0.8]);
  const [voiceType, setVoiceType] = useState("en-US");

  const handleVolumeChange = (value: number[]) => {
    setVolume(value);
    onConfigChange({ volume: value[0] });
  };

  const handleVoiceChange = (value: string) => {
    setVoiceType(value);
    onConfigChange({ voiceType: value });
  };

  return (
    <div className="space-y-6 p-4 glass rounded-lg">
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Volume</label>
        <Slider
          value={volume}
          onValueChange={handleVolumeChange}
          max={1}
          step={0.1}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Voice Type</label>
        <Select value={voiceType} onValueChange={handleVoiceChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select voice" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en-US">English (US)</SelectItem>
            <SelectItem value="en-GB">English (UK)</SelectItem>
            <SelectItem value="es-ES">Spanish</SelectItem>
            <SelectItem value="fr-FR">French</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default NotificationControls;
