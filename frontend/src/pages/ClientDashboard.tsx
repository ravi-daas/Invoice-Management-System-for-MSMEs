import { useClient } from "@/contexts/ClientContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { v4 as uuidv4 } from "uuid";
import { ClientData } from "@/types";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { fetchGSTDetails, getGSTCaptcha } from "@/apis/gst";

export const clientSchema = z.object({
  id: z.string().optional(),
  type: z.enum(["Individual", "Organization"]),
  businessName: z.string().min(1, "Business Name is required"),
  industry: z.string().optional(),
  address: z.string().min(1, "Address is required").optional(),
  logo: z.string().optional(),
  taxId: z.string().optional(),
  gstIn: z.string().optional(),
});
export default function ClientCreate() {
  const { addClient } = useClient();
  const [showGSTModal, setShowGSTModal] = useState(false);
  const [captcha, setCaptcha] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [GSTIN, setGSTIN] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [gstDetails, setGstDetails] = useState<any>(null);

  const handleFetchCaptcha = async () => {
    try {
      const response = await getGSTCaptcha();
      setSessionId(response.sessionId);
      setCaptcha(response.image);
    } catch (error) {
      console.error("Error fetching captcha", error);
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ClientData>({
    resolver: zodResolver(clientSchema),
  });

  const selectedType = watch("type");

  const onSubmit = (data: ClientData) => {
    if (data.type === "Organization") {
      if (!data.gstIn || !data.taxId) {
        alert("Error: GSTIN and Tax ID are required for Organizations!");
        return;
      }
    }

    if (!data.industry) {
      alert("Error: Industry is required!");
    }

    data.logo = "";

    addClient({ id: uuidv4(), ...data });
    alert("Client data submitted successfully!");
    reset();
    console.log("Client data submitted:", data);
  };

  function getPANFromGSTIN(gstin: string) {
    if (!gstin || gstin.length !== 15) {
      throw new Error("Invalid GSTIN format");
    }
    return gstin.substring(2, 12);
  }

  const handleOpenGSTModal = () => {
    setShowGSTModal(true);
  };

  const handleCloseGSTModal = () => {
    setShowGSTModal(false);
  };

  const handleFetchGSTDetails = async () => {
    if (!sessionId || !GSTIN || !captchaInput) {
      alert("Please enter all details");
      return;
    }

    try {
      const response = await fetchGSTDetails({
        sessionId,
        GSTIN,
        captcha: captchaInput,
      });
      console.log(response);

      if (response.errorCode) {
        alert("Wrong GSTIN or Captcha");
        return;
      }

      setGstDetails(response);
      setValue("businessName", response.lgnm);
      setValue("taxId", getPANFromGSTIN(response.gstin));
      setValue("gstIn", response.gstin);
      setValue("address", response.pradr.adr);
      setCaptchaInput("");
      setGSTIN("");
      setShowGSTModal(false);
    } catch (error) {
      console.error("Error fetching GST details", error);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-center text-[#67338a]">
        Client Management
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Business Name</Label>
                <Input
                  placeholder="Enter business name"
                  {...register("businessName")}
                />
                {errors.businessName && (
                  <p className="text-red-500 text-sm">
                    {errors.businessName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Client Industry</Label>
                <Select
                  onValueChange={(value) => setValue("industry", value)}
                  value={watch("industry") || ""}
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
              <div className="space-y-2">
                <Label>Address</Label>
                <Input
                  placeholder="Enter city/town name"
                  {...register("address")}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                onValueChange={(value) =>
                  setValue("type", value as "Individual" | "Organization")
                }
                value={watch("type") || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Organization">Organization</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-red-500 text-sm">{errors.type.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Show Tax Information only if type is 'Organization' */}
        {selectedType === "Organization" && (
          <Card>
            <CardHeader>
              <CardTitle>Tax Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Business GSTIN</Label>
                  <Input
                    placeholder="Business GSTIN"
                    {...register("gstIn")}
                    onClick={handleOpenGSTModal}
                    value={gstDetails?.gstin}
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label>Business PAN Number</Label>
                  <Input
                    placeholder="Business PAN Number"
                    {...register("taxId")}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Button
          type="submit"
          className="w-full bg-[#67338a] hover:bg-[#2f4bff]"
        >
          Submit
        </Button>
      </form>
      {showGSTModal && (
        <Dialog open={showGSTModal} onOpenChange={setShowGSTModal}>
          <DialogContent className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2">
            <div className="bg-white dark:bg-black dark:border w-full max-w-lg rounded-lg shadow-xl p-6">
              <h2 className="text-lg font-semibold">Fetch GST Details</h2>
              <Label>GST Number *</Label>
              <Input
                value={GSTIN}
                onChange={(e) => setGSTIN(e.target.value)}
                placeholder="Enter GST Number"
              />

              <Button
                type="button"
                onClick={handleFetchCaptcha}
                className="mt-2 w-full"
              >
                Get Captcha
              </Button>

              {captcha && (
                <img src={captcha} alt="Captcha" className="mt-2 rounded-md" />
              )}

              <Input
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                placeholder="Enter Captcha"
              />

              <Button
                type="button"
                onClick={handleFetchGSTDetails}
                className="mt-2 w-full"
              >
                Fetch GST Details
              </Button>

              <Button
                onClick={handleCloseGSTModal}
                className="mt-4 w-full bg-red-500 text-white"
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
