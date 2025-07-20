import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { ClientData } from "@/types";
import { clientSchema } from "@/schemas/schema";
import { fetchGSTDetails, getGSTCaptcha } from "@/apis/gst";

interface AddClientModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleAddClient: (client: ClientData) => void;
  type: "Individual" | "Organization";
}

const AddClientModal: React.FC<AddClientModalProps> = ({
  open,
  setOpen,
  handleAddClient,
  type,
}) => {
  const [captcha, setCaptcha] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [GSTIN, setGSTIN] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [gstDetails, setGstDetails] = useState<any>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<
    "Individual" | "Organization" | null
  >(type);
  const [showGSTModal, setShowGSTModal] = useState(false);

  const handleOpenGSTModal = () => {
    setShowGSTModal(true);
  };

  const handleCloseGSTModal = () => {
    setShowGSTModal(false);
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ClientData>({
    resolver: zodResolver(clientSchema),
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: ClientData) => {
    if (
      selectedType === "Organization" &&
      (data?.taxId == "" || data?.gstIn == "")
    ) {
      alert("Please fill in the Tax ID and GST Number fields");
      return;
    }

    console.log("Validated Client Data:", data);

    handleAddClient(data);
    setOpen(false);
  };

  const handleFetchCaptcha = async () => {
    try {
      const response = await getGSTCaptcha();
      setSessionId(response.sessionId);
      setCaptcha(response.image);
    } catch (error) {
      console.error("Error fetching captcha", error);
    }
  };

  function getPANFromGSTIN(gstin: string) {
    if (!gstin || gstin.length !== 15) {
      throw new Error("Invalid GSTIN format");
    }
    return gstin.substring(2, 12);
  }

  useEffect(() => {
    setValue("type", type);
  }, [selectedType]);

  // Submit GST details
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
      setCaptchaInput("");
      setGSTIN("");
      setShowGSTModal(false);
    } catch (error) {
      console.error("Error fetching GST details", error);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className=" fixed inset-0 flex items-center justify-center bg-purple-500 bg-opacity-50 left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2">
        <div className="bg-white dark:bg-black dark:border  w-full max-w-2xl rounded-lg shadow-xl p-8">
          <div className="flex justify-between items-center border-b pb-3">
            <h2 className="text-lg font-semibold">Add New Client</h2>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
          </div>

          {/* Modal Content */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            {/* Upload Logo */}
            <div className="border-2 border-dashed rounded-lg p-12 text-center relative">
              {logo ? (
                <div className="flex flex-col items-center">
                  <img
                    src={logo}
                    alt="Client Logo"
                    className="h-24 w-24 object-cover rounded-md"
                  />
                  <Button
                    variant="outline"
                    className="mt-2 text-sm text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                    onClick={() => setLogo(null)}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div>
                  <span className="text-sm text-gray-500 flex flex-col justify-center items-center">
                    Upload Logo (JPG or PNG, 1080×1080px, Max 20MB) <Plus />
                  </span>
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                  />
                </div>
              )}
            </div>

            {/* Form Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Business Name *</Label>
                <Input
                  {...register("businessName")}
                  placeholder="Enter Business Name"
                />
                {errors.businessName && (
                  <p className="text-red-500 text-sm">
                    {errors.businessName.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Client Industry</Label>
                <Select onValueChange={(value) => setValue("industry", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tech">Tech</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label>Select Address *</Label>
                <Input {...register("address")} placeholder="Enter Address" />
                {errors.address && (
                  <p className="text-red-500 text-sm">
                    {errors.address.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* Tax Information */}
              {selectedType == "Organization" && (
                <>
                  {" "}
                  <div>
                    <Label>Tax ID</Label>
                    <Input {...register("taxId")} placeholder="Enter Tax ID" />
                    {errors.taxId && (
                      <p className="text-red-500 text-sm">
                        {errors.taxId.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>GST Number</Label>
                    <Input
                      {...register("gstIn")}
                      placeholder="Enter GST Number"
                      onClick={handleOpenGSTModal}
                      value={gstDetails?.gstin}
                      readOnly
                    />
                  </div>
                </>
              )}
            </div>

            <div>
              <Label>Type</Label>
              <Select value={type}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  {type === "Individual" ? (
                    <SelectItem value="Individual">Individual</SelectItem>
                  ) : (
                    <SelectItem value="Organization">Organization</SelectItem>
                  )}
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-red-500 text-sm">{errors.type.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-[#67338a] text-white hover:bg-[#3a54ff]"
            >
              Save Client
            </Button>
          </form>
        </div>
      </DialogContent>
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
    </Dialog>
  );
};

export default AddClientModal;
