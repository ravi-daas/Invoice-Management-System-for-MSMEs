import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClientData } from "@/types";

interface EditBilledByProps {
  toggleEditBilledBy: () => void;
  businesses: ClientData[];
  setBusinesses: React.Dispatch<React.SetStateAction<ClientData[]>>;
}

export default function EditBilledBy({
  toggleEditBilledBy,
  businesses,
  setBusinesses,
}: EditBilledByProps) {
  const [selectedBusiness, setSelectedBusiness] = useState(businesses[0]);
  const [isAddressValid, setIsAddressValid] = useState(true);

  const handleSave = () => {
    if (selectedBusiness.address && !selectedBusiness?.address.trim()) {
      setIsAddressValid(false);
      return;
    }

    setBusinesses((prevBusinesses) =>
      prevBusinesses.map((business, index) =>
        index === 0 ? { ...business, ...selectedBusiness } : business
      )
    );

    toggleEditBilledBy();
  };

  return (
    <Dialog open>
      <DialogContent className="max-w-2xl min-h-[400px] border border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle>Business Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Vendor's Business Name *</Label>
            <Input
              value={selectedBusiness.businessName}
              onChange={(e) =>
                setSelectedBusiness({
                  ...selectedBusiness,
                  businessName: e.target.value,
                })
              }
            />
          </div>
          <div className="flex gap-2">
            <div className="w-full">
              <Label>Select Address *</Label>
              <Input
                value={selectedBusiness.address}
                onChange={(e) => {
                  setSelectedBusiness({
                    ...selectedBusiness,
                    address: e.target.value,
                  });
                  setIsAddressValid(!!e.target.value.trim()); // Validate address field
                }}
                className={!isAddressValid ? "border-red-500" : ""}
              />
              {!isAddressValid && (
                <p className="text-red-500 text-sm">Address is required.</p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-1/2">
              <Label>Business GSTIN (Optional)</Label>
              <Input
                value={selectedBusiness.gstIn}
                onChange={(e) =>
                  setSelectedBusiness({
                    ...selectedBusiness,
                    gstIn: e.target.value,
                  })
                }
                placeholder="GSTIN"
              />
            </div>
            <div className="w-1/2">
              <Label>Business PAN Number (Optional)</Label>
              <Input
                value={selectedBusiness.taxId}
                onChange={(e) =>
                  setSelectedBusiness({
                    ...selectedBusiness,
                    taxId: e.target.value,
                  })
                }
                placeholder="PAN Number"
              />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSave}
              disabled={!selectedBusiness?.address?.trim()}
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
