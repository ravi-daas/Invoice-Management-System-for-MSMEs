import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface GSTPopupProps {
  toggleOpenGST: () => void;
  gstType: string;
  setGstType: (gstType: string) => void;
}

export default function GSTPopup({
  toggleOpenGST,
  gstType,
  setGstType,
}: GSTPopupProps) {
  const [selectedGstType, setSelectedGstType] = useState(gstType);

  const handleSaveChanges = () => {
    setGstType(selectedGstType || "");
    toggleOpenGST();
  };

  return (
    <Dialog open>
      {/* Button to open the popup */}
      <DialogTrigger asChild>
        <Button variant="outline" className="w-96">
          Add GST
        </Button>
      </DialogTrigger>

      {/* Popup Content */}
      <DialogContent className="max-w-2xl p-6 border border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle>Configure Tax</DialogTitle>
        </DialogHeader>

        {/* Tax Type */}
        <div className="space-y-2">
          <Label>Select Tax Type *</Label>
          <Select
            defaultValue={gstType ? "gst" : "none"}
            onValueChange={(value) =>
              setSelectedGstType(value === "none" ? "" : selectedGstType)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="GST (India)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="gst">GST (India)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* GST Type */}
        <div className="space-y-2">
          <Label>GST Type *</Label>
          <RadioGroup
            defaultValue={gstType}
            name="gstType"
            onValueChange={(value) => setSelectedGstType(value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="IGST" id="igst" />
              <Label htmlFor="igst">IGST</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="CGST_SGST" id="cgst_sgst" />
              <Label htmlFor="cgst_sgst">CGST & SGST</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4 mt-4">
          <Button variant="outline" onClick={toggleOpenGST}>
            Cancel
          </Button>
          <Button onClick={handleSaveChanges} className="bg-[#67338a] text-white">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
