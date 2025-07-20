import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardQuotation from "./pages/QuotationDashboard";
import InvoicePageGST from "./pages/InvoicePageGST";
import InvoicePageRetail from "./pages/InvoicePageRetail";
import QuotationPage from "./pages/QuotationPage";
import { InvoiceProvider } from "./contexts/InvoiceContext";
import { DashboardShell } from "./components/Wrapper/DashboardWrapper";
import { HomeDashboard } from "./pages/HomeDashboard";
import { QuotationProvider } from "./contexts/QuotationContext";
import ProfilePage from "./pages/ProfileDashboard";
import InventoryPage from "./pages/InventoryDashboard";
import { InvoicesProvider } from "./contexts/InvoicesStoreContext";
import AllInvoicesPage from "./pages/InvoicesAll";
import AllQuotationsPage from "./pages/QuotationsAll";
import { QuotationsProvider } from "./contexts/QuotationStoreContext";
import ClientCreate from "./pages/ClientDashboard";
import { ClientProvider } from "./contexts/ClientContext";
import ClientsAll from "./pages/ClientsAll";
import { InventoryProvider } from "./contexts/InventoryStoreContext";
import { ProfileProvider } from "./contexts/ProfileContext";
import { ThemeProvider } from "next-themes";
import InvoiceFormModify from "./pages/InvoiceModifyGST";
import QuotationFormModify from "./pages/QuotationModify";
import InvoiceFormGST from "./pages/InvoiceGST";
import InvoiceFormRetail from "./pages/InvoiceRetail";
import InvoiceFormModifyRetail from "./pages/InvoiceModifyRetail";

const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ProfileProvider>
          <InventoryProvider>
            <ClientProvider>
              <QuotationsProvider>
                <InvoicesProvider>
                  <InvoiceProvider>
                    <QuotationProvider>
                      <DashboardShell>
                        <LocationAwareComponent />
                      </DashboardShell>
                    </QuotationProvider>
                  </InvoiceProvider>
                </InvoicesProvider>
              </QuotationsProvider>
            </ClientProvider>
          </InventoryProvider>
        </ProfileProvider>
      </ThemeProvider>
    </Router>
  );
};

const LocationAwareComponent: React.FC = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomeDashboard />} />
        <Route
          path="/InvoiceDashboard/CreateInvoiceGST"
          element={<InvoiceFormGST />}
        />
        <Route
          path="/InvoiceDashboard/CreateInvoiceRetail"
          element={<InvoiceFormRetail />}
        />
        <Route
          path="/InvoiceDashboard/InvoiceGST"
          element={<InvoicePageGST />}
        />
        <Route
          path="/InvoiceDashboard/InvoiceRetail"
          element={<InvoicePageRetail />}
        />
        <Route
          path="/InvoiceDashboard/AllInvoices"
          element={<AllInvoicesPage />}
        />
        <Route
          path="/InvoiceDashboard/ModifyInvoiceGST"
          element={<InvoiceFormModify />}
        />
        <Route
          path="/InvoiceDashboard/ModifyInvoiceRetail"
          element={<InvoiceFormModifyRetail />}
        />
        <Route
          path="/QuotationDashboard/Quotation"
          element={<QuotationPage />}
        />
        <Route
          path="/QuotationDashboard/CreateQuotation"
          element={<DashboardQuotation />}
        />
        <Route
          path="/QuotationDashboard/AllQuotations"
          element={<AllQuotationsPage />}
        />
        <Route
          path="/QuotationDashboard/ModifyQuotation"
          element={<QuotationFormModify />}
        />
        <Route
          path="/ClientDashboard/CreateClient"
          element={<ClientCreate />}
        />

        <Route path="/ProfileDashboard" element={<ProfilePage />} />
        <Route path="/InventoryDashboard" element={<InventoryPage />} />
        <Route path="/ClientDashboard/AllClients" element={<ClientsAll />} />
      </Routes>
    </div>
  );
};

export default App;
