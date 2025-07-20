import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Pencil, Trash } from "lucide-react";
import { useClient } from "@/contexts/ClientContext";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClientData } from "@/types";
import { fetchClients } from "@/apis/clients";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const countryMapping: { [key: string]: string } = {
  in: "India",
  us: "United States",
  uk: "United Kingdom",
};

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default function ClientsAll() {
  const { clients, deleteClient, updateClient, addClients } = useClient();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [_, setSelectedClient] = useState<ClientData | null>(null);
  const [formData, setFormData] = useState<ClientData | null>(null);

  useEffect(() => {
    const fetchAllClients = async () => {
      try {
        const clients = await fetchClients();
        addClients(clients);
      } catch (error) {
        console.error("Error fetching quotations: ", error);
      }
    };
    fetchAllClients();
  }, []);

  const handleEditClick = (client: ClientData) => {
    setSelectedClient(client);
    setFormData(client);
    setIsEditOpen(true);
  };

  const handleIndustryChange = (value: string) => {
    if (!formData) return;
    setFormData({ ...formData, industry: value });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTypeChange = (value: "Individual" | "Organization") => {
    if (!formData) return;
    setFormData({ ...formData, type: value });
  };

  const handleSave = () => {
    if (formData) {
      console.log("Updated client:", formData);
      setIsEditOpen(false);
      updateClient(formData?.id || "", formData);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Clients</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Logo</TableHead>
            <TableHead className="text-left">Name</TableHead>
            <TableHead className="text-left">Address</TableHead>
            <TableHead className="text-left">Industry</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.length > 0 ? (
            clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="text-left">
                  <div className="w-8 h-8 flex items-center justify-center bg-gray-800 text-white rounded-full">
                    {client.businessName.charAt(0)}
                  </div>
                </TableCell>
                <TableCell className="text-left w-56">
                  {client.businessName}
                </TableCell>
                <TableCell className="text-left w-72 truncate">
                  <div className="w-48 truncate" title={client.address}>
                    {client.address}
                  </div>
                </TableCell>
                <TableCell className="text-left w-24">
                  {client.industry
                    ? capitalizeFirstLetter(client.industry)
                    : "-"}
                </TableCell>
                <TableCell className="flex gap-2 justify-center">
                  {/* Edit Button */}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEditClick(client)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  {/* Delete Button */}
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => deleteClient(client?.id || "")}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                No Clients Available!!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Edit Client Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
          </DialogHeader>

          {/* Form Fields */}
          {formData && (
            <div className="space-y-4">
              {/* Business Name */}
              <div>
                <label className="block text-sm font-medium">
                  Business Name
                </label>
                <Input
                  name="businessName"
                  placeholder="Business Name"
                  value={formData.businessName}
                  onChange={handleChange}
                />
              </div>

              {/* Industry & Country */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="block text-sm font-medium">
                    Client Industry
                  </Label>
                  <Select
                    onValueChange={handleIndustryChange}
                    value={formData.industry || ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an Industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tech">Technology</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* <div>
                  <label className="block text-sm font-medium">Country</label>
                  <Input
                    name="country"
                    placeholder="Country"
                    value={countryMapping[formData.country]}
                    onChange={handleChange}
                  />
                </div> */}
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium">Address</label>
                <Input
                  name="address"
                  placeholder="Address"
                  value={formData.address || ""}
                  onChange={handleChange}
                />
              </div>

              {/* Type Selection */}
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  onValueChange={handleTypeChange}
                  value={formData.type || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Individual">Individual</SelectItem>
                    <SelectItem value="Organization">Organization</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* GSTIN & PAN Number (Only for Organization) */}
              {formData.type === "Organization" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium">GSTIN</label>
                    <Input
                      name="gstIn"
                      placeholder="GSTIN"
                      value={formData.gstIn || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      PAN Number
                    </label>
                    <Input
                      name="taxId"
                      placeholder="PAN Number"
                      value={formData.taxId || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
