import { useState } from "react";
import { Card } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Badge } from "@/react-app/components/ui/badge";
import { Loader2, CreditCard, ExternalLink, AlertTriangle, CheckCircle } from "lucide-react";
import { useSubscription } from "@/react-app/hooks/useSubscription";

interface SubscriptionManagementProps {
  onUpgrade?: () => void;
}

export function SubscriptionManagement({ onUpgrade }: SubscriptionManagementProps) {
  const { subscription, loading, daysRemaining, planPricing, formattedRenewalDate, isExpiringSoon, isExpired, currentPlan } = useSubscription();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleManageSubscription = async (action: string) => {
    if (actionLoading) return;
    
    setActionLoading(action);
    try {
      if (action === "manage") {
        // Get management URL from backend
        const res = await fetch("/api/subscription/manage", {
          credentials: "include",
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data.useUpdatePaymentFlow) {
            // Use update payment flow as fallback
            const paymentRes = await fetch("/api/payfast/create-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ plan: currentPlan, billing_period: "monthly" }),
            });
            
            if (paymentRes.ok) {
              const paymentData = await paymentRes.json();
              if (paymentData.redirectUrl) {
                window.location.href = `${paymentData.redirectUrl}?${new URLSearchParams(paymentData.formData).toString()}`;
              }
            }
          }
        }
      } else if (action === "update-payment") {
        // Create a payment update flow
        const res = await fetch("/api/payfast/create-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ plan: currentPlan, billing_period: "monthly" }),
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data.redirectUrl) {
            window.location.href = `${data.redirectUrl}?${new URLSearchParams(data.formData).toString()}`;
          }
        }
      } else if (action === "cancel") {
        if (confirm("Are you sure you want to cancel your subscription? This action cannot be undone.")) {
          const res = await fetch("/api/subscription/cancel", {
            method: "POST",
            credentials: "include",
          });
          
          if (res.ok) {
            alert("Subscription cancellation request submitted. You will retain access until the end of your billing period.");
            window.location.reload();
          }
        }
      } else if (action === "billing-history") {
        // Navigate to billing history or open modal
        alert("Billing history feature coming soon!");
      }
    } catch (error) {
      alert("Unable to process request. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </Card>
    );
  }

  const planFeatures = {
    basic: [
      "Up to 10 devices",
      "Endpoint Shield",
      "Email Guard",
      "Monthly reports",
      "Email support",
    ],
    pro: [
      "Up to 25 devices",
      "All Basic features",
      "POPIA Compliance Hub",
      "Priority support",
      "Missed call SMS automation",
      "🚀 V2: Financial Risk Assessment Tools",
      "🚀 V2: Transaction Monitoring System",
      "🚀 V2: FICA Compliance Automation",
    ],
    enterprise: [
      "Unlimited devices",
      "Dedicated account manager",
      "Academy & training",
      "Custom integrations",
      "SLA-backed SLAs",
      "🚀 V2: Advanced Financial Crime Detection",
      "🚀 V2: AML/KYC Integration Suite",
      "🚀 V2: Regulatory Reporting Automation",
      "🚀 V2: Blockchain Transaction Analysis",
    ],
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            Subscription & Billing
          </h3>
          <p className="text-sm text-muted-foreground">
            View and manage your NexteraAI Security plan.
          </p>
        </div>

        {isExpired() && (
          <div className="p-4 rounded-lg border bg-destructive/10 border-destructive/20">
            <p className="text-sm text-destructive flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-semibold">Subscription expired – please renew to continue</span>
            </p>
          </div>
        )}

        {/* Current Plan Display */}
        <div className={`p-4 rounded-lg border ${
          isExpired() ? 'bg-destructive/10 border-destructive/20' :
          isExpiringSoon() ? 'bg-amber-500/10 border-amber-500/20' :
          'bg-primary/10 border-primary/20'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-lg">
                You are on the {planPricing.name} plan – R{planPricing.monthly}/month
              </p>
              <p className="text-sm text-muted-foreground">
                {daysRemaining !== null && daysRemaining > 0 ? (
                  <>Your subscription renews in {daysRemaining} days on {formattedRenewalDate || subscription?.current_period_end?.split('T')[0]}</>
                ) : daysRemaining !== null && daysRemaining <= 0 ? (
                  <span className="text-destructive">Subscription expired</span>
                ) : (
                  <>Monthly billing</>
                )}
              </p>
              {isExpired() && (
                <p className="text-sm text-destructive flex items-center gap-1 mt-2">
                  <AlertTriangle className="w-4 h-4" />
                  Subscription expired – please renew to continue
                </p>
              )}
              {isExpiringSoon() && !isExpired() && (
                <p className="text-sm text-amber-500 flex items-center gap-1 mt-2">
                  <AlertTriangle className="w-4 h-4" />
                  Subscription expires in {daysRemaining} days – renew soon
                </p>
              )}
            </div>
            <Badge 
              variant="outline" 
              className={
                isExpired() ? 'border-destructive/40 text-destructive' :
                isExpiringSoon() ? 'border-amber-500/40 text-amber-400' :
                'border-emerald-500/40 text-emerald-400'
              }
            >
              {isExpired() ? 'Expired' : subscription?.status || 'Active'}
            </Badge>
          </div>
        </div>

        {/* Pro/Enterprise status message */}
        {currentPlan !== "basic" && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-sm text-emerald-400 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              You're on {planPricing.name} – all features unlocked
            </p>
          </div>
        )}

        {/* Current Plan Features */}
        <div className="space-y-2">
          <h4 className="font-medium">Included Features</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {planFeatures[currentPlan as keyof typeof planFeatures]?.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
          {currentPlan === "basic" && onUpgrade && (
            <Button 
              className="text-white"
              onClick={onUpgrade}
            >
              Upgrade to Pro – R2,000/month
            </Button>
          )}
          
          {currentPlan !== "basic" && (
            <>
              <Button 
                variant="outline" 
                className="text-white"
                onClick={() => handleManageSubscription("manage")}
                disabled={actionLoading === "manage"}
              >
                {actionLoading === "manage" ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <ExternalLink className="w-4 h-4 mr-2" />
                )}
                Manage Subscription
              </Button>
              
              <Button 
                variant="outline" 
                className="text-white"
                onClick={() => handleManageSubscription("update-payment")}
                disabled={actionLoading === "update-payment"}
              >
                {actionLoading === "update-payment" ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <CreditCard className="w-4 h-4 mr-2" />
                )}
                Update Payment Method
              </Button>
              
              <Button 
                variant="outline" 
                className="text-white"
                onClick={() => handleManageSubscription("billing-history")}
                disabled={actionLoading === "billing-history"}
              >
                {actionLoading === "billing-history" ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <ExternalLink className="w-4 h-4 mr-2" />
                )}
                Billing History
              </Button>
              
              <Button 
                variant="outline" 
                className="text-destructive"
                onClick={() => handleManageSubscription("cancel")}
                disabled={actionLoading === "cancel"}
              >
                {actionLoading === "cancel" ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                Cancel Subscription
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
