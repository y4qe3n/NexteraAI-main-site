import { useState, useEffect } from "react";
import { useAuth } from "@/react-app/lib/AuthContext";

export interface SubscriptionData {
  plan: string;
  status: string;
  amount: number;
  current_period_start: string;
  current_period_end: string;
  payment_gateway: string;
  gateway_subscription_id: string;
  cancel_at_period_end: number;
  calculated_tier?: string;
  formatted_renewal_date?: string;
  days_remaining?: number | null;
}

export interface OrganizationData {
  id: number;
  plan: string;
  devices_limit: number;
}

export function useSubscription() {
  const { admin } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [organization, setOrganization] = useState<OrganizationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch subscription data
        const subRes = await fetch("/api/subscription", { credentials: "include" });
        if (!subRes.ok && subRes.status !== 404) {
          throw new Error("Failed to fetch subscription data");
        }

        if (subRes.ok) {
          const subData = await subRes.json();
          setSubscription(subData);
        }

        // Fetch organization data
        const orgRes = await fetch("/api/organization", { credentials: "include" });
        if (!orgRes.ok && orgRes.status !== 404) {
          throw new Error("Failed to fetch organization data");
        }

        if (orgRes.ok) {
          const orgData = await orgRes.json();
          setOrganization(orgData);
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load subscription data");
      } finally {
        setLoading(false);
      }
    };

    if (admin) {
      fetchSubscriptionData();
    }
  }, [admin]);

  // Calculate days remaining
  const getDaysRemaining = () => {
    if (subscription?.days_remaining !== undefined) {
      return subscription.days_remaining;
    }
    if (!subscription?.current_period_end) return null;
    
    const endDate = new Date(subscription.current_period_end);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  // Get plan pricing - use calculated_tier from backend (amount-based) or fall back to plan field
  const getPlanPricing = () => {
    const planPricing = {
      basic: { monthly: 1000, name: "Basic" },
      pro: { monthly: 2000, name: "Pro" },
      enterprise: { monthly: 3000, name: "Enterprise" },
    };

    // Use calculated_tier from backend (based on amount paid) or fall back to plan field
    const currentPlan = subscription?.calculated_tier || subscription?.plan || organization?.plan || "basic";
    return planPricing[currentPlan as keyof typeof planPricing] || planPricing.basic;
  };

  // Check if subscription is expiring soon
  const isExpiringSoon = () => {
    const daysRemaining = getDaysRemaining();
    return daysRemaining !== null && daysRemaining < 7 && daysRemaining > 0;
  };

  // Check if subscription is expired
  const isExpired = () => {
    const daysRemaining = getDaysRemaining();
    return daysRemaining !== null && daysRemaining <= 0;
  };

  // Get formatted renewal date from backend or calculate locally
  const getFormattedRenewalDate = () => {
    return subscription?.formatted_renewal_date || "";
  };

  // Get current plan using amount-based tier calculation from backend
  const getCurrentPlan = () => {
    return subscription?.calculated_tier || subscription?.plan || organization?.plan || "basic";
  };

  return {
    subscription,
    organization,
    loading,
    error,
    daysRemaining: getDaysRemaining(),
    planPricing: getPlanPricing(),
    formattedRenewalDate: getFormattedRenewalDate(),
    isExpiringSoon,
    isExpired,
    currentPlan: getCurrentPlan(),
  };
}
